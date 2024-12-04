const { expect, jest } = require('@jest/globals');
global.expect = expect;
global.jest = jest;

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    symbol: 'AAPL',
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => () => {}),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: () => ({
        start: jest.fn(),
      }),
      parallel: () => ({
        start: jest.fn(),
      }),
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
      })),
    },
  };
});
  