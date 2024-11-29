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
      <Stack.Screen name="index" />
      <Stack.Screen name="screens/Home"  options={{ title: 'Home' }}/> {/* Navigate to screens/Home */}
      <Stack.Screen name="screens/Events" options={{ title: 'Events' }} /> {/* Navigate to screens/Events */}
      <Stack.Screen name="screens/calendarTest"  options={{ title: 'Test' }}/> {/* Navigate to screens/CalendarTest */}
    </Stack>
  );
}
