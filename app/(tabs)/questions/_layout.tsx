import { Stack } from 'expo-router';

/** Questions tab stack: Subjects → Subject (topics) → Topic (questions by difficulty). Tab bar stays visible. */
export default function QuestionsStack() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
