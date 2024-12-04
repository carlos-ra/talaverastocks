import '@testing-library/jest-native/extend-expect';
import { RenderResult } from '@testing-library/react-native';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string) => R;
      toBeVisible: () => R;
      toBeDisabled: () => R;
    }
  }
}

export type TestRenderResult = RenderResult; 