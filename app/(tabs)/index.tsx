import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Screen } from '@/components/layout';
import { OptionButton } from '@/components/question';
import { AppText, Badge, Button, Card, ProgressBar, useToast } from '@/components/ui';
import { useTheme } from '@/src/theme';

export default function HomeScreen() {
  const { toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();
  const [selectedOption, setSelectedOption] = useState(0);

  return (
    <Screen>
      <ScrollView
        contentContainerClassName="grow gap-4 p-4 pb-16"
        showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          <AppText variant="screenTitle" color="primary">
            QnA MCQ
          </AppText>
          <AppText variant="metadata" color="textSecondary">
            NativeWind tokens loaded — emerald primary, {isDark ? 'dark' : 'light'} mode
          </AppText>
        </View>

        <Card title="Actions">
          <View className="gap-3">
            <Button title="Success toast" onPress={() => showToast('Saved successfully', 'success')} />
            <Button
              title="Error toast"
              variant="outline"
              onPress={() => showToast('Something went wrong', 'error')}
            />
            <Button title="Toggle theme" variant="outline" onPress={() => void toggleTheme()} />
          </View>
        </Card>

        <Card title="Daily-style options">
          <AppText variant="metadata" color="textTertiary" className="mb-3">
            Tap an option (visual states from the plan)
          </AppText>
          <View className="gap-2">
            <OptionButton
              index={0}
              label="Hydrogen"
              state={selectedOption === 0 ? 'selected' : 'default'}
              onPress={() => setSelectedOption(0)}
            />
            <OptionButton
              index={1}
              label="Oxygen"
              state={selectedOption === 1 ? 'selected' : 'default'}
              onPress={() => setSelectedOption(1)}
            />
            <OptionButton index={2} label="Correct (revealed)" state="correct" />
            <OptionButton index={3} label="Wrong (revealed)" state="wrong" />
            <OptionButton index={4} label="Dimmed after submit" state="dimmed" />
          </View>
        </Card>

        <Card title="Progress">
          <AppText variant="metadata" color="textSecondary" className="mb-3">
            7 of 20 today
          </AppText>
          <ProgressBar progress={7 / 20} />
        </Card>

        <View className="flex-row flex-wrap items-center gap-2">
          <Badge label="3-day streak" tone="streak" />
          <Badge label="Subscribed" tone="primary" />
          <Badge label="Approved" tone="success" />
          <Badge label="Rejected" tone="error" />
        </View>
      </ScrollView>
    </Screen>
  );
}
