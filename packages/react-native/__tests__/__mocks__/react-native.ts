// Minimal React Native mock for tests.
// Avoids pulling in the full react-native package (~200MB).

import * as React from 'react';

// Host components that @testing-library/react-native needs to know about
const createMockComponent = (name: string): React.ComponentType<any> => {
  const Comp = React.forwardRef<any, any>((props: any, ref: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...rest } = props;
    return React.createElement(name as any, { ...rest, ref }, children);
  });
  Comp.displayName = name;
  return Comp;
};

export const Text = createMockComponent('Text');
export const View = createMockComponent('View');
export const TextInput = createMockComponent('TextInput');
export const TouchableOpacity = createMockComponent('TouchableOpacity');
export const TouchableHighlight = createMockComponent('TouchableHighlight');
export const ScrollView = createMockComponent('ScrollView');
export const FlatList = createMockComponent('FlatList');
export const SectionList = createMockComponent('SectionList');
export const Modal = createMockComponent('Modal');
export const Pressable = createMockComponent('Pressable');
export const Switch = createMockComponent('Switch');
export const ActivityIndicator = createMockComponent('ActivityIndicator');
export const Image = createMockComponent('Image');
export const SafeAreaView = createMockComponent('SafeAreaView');
export const StatusBar = createMockComponent('StatusBar');

export const Platform = {
  OS: 'ios' as const,
  Version: '16.0',
  select: <T extends Record<string, unknown>>(obj: T): T[keyof T] =>
    (obj.ios ?? obj.default) as T[keyof T],
};

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => style,
  hairlineWidth: 1,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } as const,
};

export const Dimensions = {
  get: (_name: string) => ({ width: 390, height: 844 }),
};

export const Animated = new Proxy(
  {},
  {
    get: (_target, prop) => {
      if (prop === 'View') return View;
      if (prop === 'Text') return Text;
      if (prop === 'Image') return Image;
      if (prop === 'ScrollView') return ScrollView;
      if (prop === 'FlatList') return FlatList;
      return createMockComponent(`Animated.${String(prop)}`);
    },
  }
);
