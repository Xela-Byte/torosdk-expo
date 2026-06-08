/**
 * Minimal ambient type declarations for `react-native` used by the axios adapter.
 *
 * The package declares `react-native` as a peer dependency.  At compile-time
 * we only need the shape of `Platform` and `NativeModules`, so we declare them
 * here instead of pulling in the full `@types/react-native`.
 */

declare module 'react-native' {
  export const Platform: {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
    Version: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (specifics: Record<string, any>) => any;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const NativeModules: Record<string, any>;
}
