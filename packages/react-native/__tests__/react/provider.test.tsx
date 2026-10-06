jest.mock('../../src/core/auth', () => ({
  createPasswordStrategy: jest.fn(() => ({ authorize: jest.fn().mockResolvedValue(true) })),
  getAuthStrategy: jest.fn(),
  setAuthStrategy: jest.fn(),
}));

import { render } from '@testing-library/react-native';
import { Text } from '../../__tests__/__mocks__/react-native';
import { ToronetProvider, useToronetContext } from '../../src/react/provider';
import { createPasswordStrategy } from '../../src/core/auth';

function TestConsumer() {
  const ctx = useToronetContext();
  return <Text testID="network">{ctx.config.network}</Text>;
}

describe('ToronetProvider', () => {
  test('provides config to children via context', () => {
    const { getByTestId } = render(
      <ToronetProvider
        config={{ network: 'testnet' }}
        authStrategy={createPasswordStrategy()}
      >
        <TestConsumer />
      </ToronetProvider>
    );
    expect(getByTestId('network').props.children).toBe('testnet');
  });

  test('throws when useToronetContext is used outside provider', () => {
    // Suppress console.error for expected error boundary
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      '[torosdk-expo] useToronetContext must be used within a <ToronetProvider>'
    );
    spy.mockRestore();
  });
});
