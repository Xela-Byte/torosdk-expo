//
// ToroNetworking.m — NWConnection-based raw HTTP transport
//
// Sends raw HTTP/1.1 bytes directly over a TCP+TLS socket using the
// Network framework (NWConnection), which operates below CFNetwork
// and is NOT subject to the Darwin 25 GET+body restriction.
//
// WHY: Starting in Darwin 25 (macOS 26 / iOS 26), CFNetwork blocks
// GET requests that carry an HTTP body with NSURLErrorDomain -1103
// ("resource exceeds maximum size"). The Toronet API requires
// GET+JSON-body for all read queries.
//

#import <Network/Network.h>
#import <React/RCTBridgeModule.h>

@interface ToroNetworking : NSObject <RCTBridgeModule>
@end

// ── Block-based helper for continuous receive ──────────────────────
typedef void (^ReceiveLoopBlock)(nw_connection_t connection,
                                  NSMutableData *responseData,
                                  RCTPromiseResolveBlock resolve,
                                  RCTPromiseRejectBlock reject);

@implementation ToroNetworking

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_EXPORT_METHOD(rawRequest:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *host = params[@"host"];
  NSNumber *portNum = params[@"port"];
  NSString *httpRequest = params[@"httpRequest"];
  BOOL useTls = params[@"useTls"] ? [params[@"useTls"] boolValue] : YES;

  if (!host || !portNum || !httpRequest) {
    reject(@"INVALID_PARAMS",
           @"rawRequest requires host (String), port (Number), and httpRequest (String)",
           nil);
    return;
  }

  uint16_t port = [portNum unsignedShortValue];

  // ── Build connection parameters ──────────────────────────────
  nw_parameters_t parameters = NULL;
  nw_endpoint_t endpoint = nw_endpoint_create_host([host UTF8String],
                                                    [@(port) stringValue].UTF8String);

  if (useTls) {
    nw_parameters_configure_protocol_block_t configure_tls =
      ^(nw_protocol_options_t options) {
        // Use default TLS (system trust store)
      };
    parameters = nw_parameters_create_secure_tcp(configure_tls,
                                                  NW_PARAMETERS_DEFAULT_CONFIGURATION);
  } else {
    parameters = nw_parameters_create_secure_tcp(
      NW_PARAMETERS_DISABLE_PROTOCOL,
      NW_PARAMETERS_DEFAULT_CONFIGURATION);
  }

  nw_connection_t connection = nw_connection_create(endpoint, parameters);

  // ── State: mutable, owned by this request ─────────────────────
  NSMutableData *responseData = [NSMutableData data];
  __block BOOL completed = NO;

  // Small helpers to finalize exactly once
  void (^fail)(NSString *, NSString *, NSError *) = ^(NSString *code,
                                                       NSString *msg,
                                                       NSError *err) {
    if (completed) return;
    completed = YES;
    nw_connection_cancel(connection);
    reject(code, msg, err);
  };

  void (^succeed)(NSDictionary *) = ^(NSDictionary *result) {
    if (completed) return;
    completed = YES;
    nw_connection_cancel(connection);
    resolve(result);
  };

  // ── HTTP response parser ─────────────────────────────────────
  NSDictionary * (^parseResponse)(NSString *) = ^(NSString *raw) {
    // Split on first \r\n\r\n
    NSRange headerBodySplit = [raw rangeOfString:@"\r\n\r\n"];
    NSString *headerSection;
    NSString *body;

    if (headerBodySplit.location != NSNotFound) {
      headerSection = [raw substringToIndex:headerBodySplit.location];
      body = [raw substringFromIndex:headerBodySplit.location + 4];
    } else {
      // Try \n\n as fallback
      headerBodySplit = [raw rangeOfString:@"\n\n"];
      if (headerBodySplit.location != NSNotFound) {
        headerSection = [raw substringToIndex:headerBodySplit.location];
        body = [raw substringFromIndex:headerBodySplit.location + 2];
      } else {
        return @{
          @"statusCode": @0,
          @"headers": @{},
          @"body": raw
        };
      }
    }

    NSArray<NSString *> *lines = [headerSection componentsSeparatedByString:@"\r\n"];
    NSInteger statusCode = 0;
    NSMutableDictionary<NSString *, NSString *> *headers = [NSMutableDictionary dictionary];

    for (NSUInteger i = 0; i < lines.count; i++) {
      NSString *line = lines[i];
      if (i == 0) {
        // Status line: "HTTP/1.1 200 OK"
        NSArray *parts = [line componentsSeparatedByString:@" "];
        if (parts.count >= 2) {
          statusCode = [parts[1] integerValue];
        }
      } else {
        NSRange colon = [line rangeOfString:@":"];
        if (colon.location != NSNotFound) {
          NSString *key = [[line substringToIndex:colon.location]
                           stringByTrimmingCharactersInSet:
                           [NSCharacterSet whitespaceCharacterSet]];
          NSString *val = [[line substringFromIndex:colon.location + 1]
                           stringByTrimmingCharactersInSet:
                           [NSCharacterSet whitespaceCharacterSet]];
          headers[[key lowercaseString]] = val;
        }
      }
    }

    return @{
      @"statusCode": @(statusCode),
      @"headers": headers,
      @"body": body
    };
  };

  // ── Receive loop (recursive via block capture) ───────────────
  __block __weak ReceiveLoopBlock weakReceiveLoop;
  ReceiveLoopBlock receiveLoop;
  receiveLoop = ^(nw_connection_t conn,
                  NSMutableData *data,
                  RCTPromiseResolveBlock res,
                  RCTPromiseRejectBlock rej) {
    nw_connection_receive(conn, 1, 65536, ^(dispatch_data_t content,
                                            nw_content_context_t context,
                                            bool is_complete,
                                            nw_error_t error) {
      if (error) {
        fail(@"RECEIVE_ERROR",
             [NSString stringWithFormat:@"Receive failed: errno %d",
              nw_error_get_error_code(error)],
             nil);
        return;
      }

      if (content) {
        [data appendData:(NSData *)content];
      }

      if (is_complete) {
        NSString *responseStr = [[NSString alloc] initWithData:data
                                                       encoding:NSUTF8StringEncoding];
        succeed(parseResponse(responseStr ?: @""));
      } else {
        ReceiveLoopBlock strongLoop = weakReceiveLoop;
        if (strongLoop) {
          strongLoop(conn, data, res, rej);
        }
      }
    });
  };
  weakReceiveLoop = receiveLoop;

  // ── State handler ────────────────────────────────────────────
  nw_connection_set_state_changed_handler(connection, ^(nw_connection_state_t state,
                                                         nw_error_t error) {
    switch (state) {
      case nw_connection_state_ready: {
        NSData *requestData = [httpRequest dataUsingEncoding:NSUTF8StringEncoding];
        dispatch_data_t sendData =
          dispatch_data_create(requestData.bytes,
                               requestData.length,
                               dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0),
                               DISPATCH_DATA_DESTRUCTOR_DEFAULT);

        nw_connection_send(connection, sendData,
                           NW_CONNECTION_DEFAULT_MESSAGE_CONTEXT,
                           true, ^(nw_error_t sendError) {
          if (sendError) {
            fail(@"SEND_ERROR",
                 [NSString stringWithFormat:@"Send failed: errno %d",
                  nw_error_get_error_code(sendError)],
                 nil);
            return;
          }
          receiveLoop(connection, responseData, resolve, reject);
        });
        break;
      }

      case nw_connection_state_waiting: {
        if (error) {
          NSLog(@"[ToroNetworking] waiting: errno %d", nw_error_get_error_code(error));
        }
        break;
      }

      case nw_connection_state_failed: {
        NSString *msg = @"Connection failed";
        if (error) {
          msg = [NSString stringWithFormat:@"Connection failed: errno %d",
                 nw_error_get_error_code(error)];
        }
        fail(@"CONNECTION_FAILED", msg, nil);
        break;
      }

      case nw_connection_state_cancelled:
        break;

      default:
        break;
    }
  });

  // ── Set queue + Go ──────────────────────────────────────────
  nw_connection_set_queue(connection,
    dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0));
  nw_connection_start(connection);
}

@end
