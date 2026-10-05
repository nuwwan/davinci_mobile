import Constants from 'expo-constants';
import { useState } from 'react';

import { NavHeader, ScrollScreen } from '@/components/layout';
import {
  Card,
  ChipGroup,
  ConfirmSheet,
  InfoRow,
  ListRow,
  SegmentedControl,
  Switch,
  useToast,
} from '@/components/ui';
import { useTheme, type ThemePreference } from '@/src/theme';

type Frequency = 'daily' | 'weekly';
type FontSize = 'small' | 'medium' | 'large';

/**
 * Settings (Figma N / N2 / N3).
 * Display → theme is live (ThemeContext, persisted). Notification / font-size / privacy
 * toggles are local UI state until the matching API + notification service exist.
 */
export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();
  const { showToast } = useToast();

  // TODO(api): persist via learner profile (notification_frequency, is_public_profile).
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [publicProfile, setPublicProfile] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollScreen edges={['top', 'left', 'right', 'bottom']} contentClassName="gap-4 pt-1">
      <NavHeader backLabel="Profile" title="Settings" />

      <Card variant="section" title="Notifications">
        <ListRow
          label="Daily question reminder"
          right={<Switch value={dailyReminder} onValueChange={setDailyReminder} accessibilityLabel="Daily question reminder" />}
        />
        <ListRow
          label="Streak reminders"
          right={<Switch value={streakReminder} onValueChange={setStreakReminder} accessibilityLabel="Streak reminders" />}
        />
        <ListRow label="Notification time" value="8:00 PM" chevron />
        <ListRow
          label="Frequency"
          last
          right={
            <ChipGroup
              layout="wrap"
              value={frequency}
              onChange={setFrequency}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
              ]}
            />
          }
        />
      </Card>

      <Card variant="section" title="Display">
        <ListRow
          label="Dark mode"
          right={
            <SegmentedControl<ThemePreference>
              value={preference}
              onChange={setPreference}
              options={[
                { value: 'system', label: 'System' },
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          }
        />
        <ListRow
          label="Font size"
          last
          right={
            <SegmentedControl<FontSize>
              value={fontSize}
              onChange={setFontSize}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          }
        />
      </Card>

      <Card variant="section" title="Privacy">
        <ListRow
          label="Public profile"
          hint={publicProfile ? 'On: other learners can see your profile' : 'Off: your profile is private'}
          last
          right={<Switch value={publicProfile} onValueChange={setPublicProfile} accessibilityLabel="Public profile" />}
        />
      </Card>

      <Card variant="section" title="About">
        <InfoRow label="App version" value={version} />
        <InfoRow label="Terms of Service" onPress={() => showToast('Terms of Service coming soon.', 'info')} />
        <InfoRow label="Privacy Policy" last onPress={() => showToast('Privacy Policy coming soon.', 'info')} />
      </Card>

      <Card variant="section" tone="error" elevated={false} title="Danger zone">
        <ListRow label="Delete account" icon="trash" labelColor="error" last onPress={() => setConfirmDelete(true)} chevron={false} />
      </Card>

      <ConfirmSheet
        visible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          // TODO(api): call the delete-account endpoint once available.
          setConfirmDelete(false);
          showToast('Account deletion is not available yet. Please contact support.', 'info', 4000);
        }}
        icon="trash"
        title="Delete account?"
        message="This will permanently delete your account and all your data."
        confirmLabel="Delete my account"
      />
    </ScrollScreen>
  );
}
