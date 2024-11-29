import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3F6D89',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false}} /> {/* remove a header on the login screen */}
      <Stack.Screen name="Home"  options={{ title: 'Home' }}/> {/* Navigate to screens/Home */}
      <Stack.Screen name="Events" options={{ title: 'Events' }} /> {/* Navigate to screens/Events */}
      <Stack.Screen name="calendarTest"  options={{ title: 'Test' }}/> {/* Navigate to screens/CalendarTest */}
    </Stack>
  );
}
