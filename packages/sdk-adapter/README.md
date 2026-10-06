# @reactforge/sdk-adapter

The core TypeScript engine powering the Toronet SDK.

This package contains the core business logic, API communication layers, cryptography formatting, and shared types used by both `@reactforge/react` and `@reactforge/react-native`.

## Installation

```bash
npm install @reactforge/sdk-adapter
```
*(Note: You usually do not need to install this directly. Install the React or React Native SDKs instead, which wrap this adapter with UI-friendly hooks).*

## Features
- Shared global state management (Keystore, Address)
- Formats payloads for the Toronet Blockchain
- Resolves TNS (Toronet Name Service) domains
- Universal API abstraction (Browser & Mobile compatible)

## Usage

```typescript
import { Toronet } from '@reactforge/sdk-adapter';

// Direct API calls (usually handled by the hooks)
const balance = await Toronet.getBalance("0xYourAddress");
```
