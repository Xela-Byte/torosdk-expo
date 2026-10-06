// Minimal React Native type declarations for tests.
// Avoids pulling in the full react-native package (~200MB).
declare module 'react-native' {
  import * as React from 'react';

  export interface TextProps {
    testID?: string;
    children?: React.ReactNode;
    style?: unknown;
    [key: string]: unknown;
  }

  export interface ViewProps {
    testID?: string;
    children?: React.ReactNode;
    style?: unknown;
    [key: string]: unknown;
  }

  export const Text: React.ComponentType<TextProps>;
  export const View: React.ComponentType<ViewProps>;
}
