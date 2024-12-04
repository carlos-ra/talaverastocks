import { Stack } from 'expo-router';

import { StocksProvider } from '../context/StocksContext';

export default function Layout() {
  return (
    <StocksProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          gestureEnabled: true,
          animation: 'slide_from_right',
          animationDuration: 200,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            };
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Stock Market',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="stock/[symbol]"
          options={({ route }: { route: { params: { symbol: string } } }) => ({
            title: route.params?.symbol || 'Stock Details',
            headerShown: true,
            headerBackTitle: 'Back',
          })}
        />
      </Stack>
    </StocksProvider>
  );
}
