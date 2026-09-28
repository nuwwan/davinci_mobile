import type { ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export type QuestionCardProps = ViewProps & {
  children: ReactNode;
  /** Minimum share of window height for the question block (daily flow spec: ~60%). */
  minHeightFraction?: number;
  className?: string;
};

export function QuestionCard({
  children,
  minHeightFraction = 0.6,
  className,
  style,
  ...rest
}: QuestionCardProps) {
  const { height } = useWindowDimensions();
  const minHeight = Math.round(height * minHeightFraction);

  return (
    <View
      className={cn('w-full px-4 py-5', className)}
      style={[{ minHeight }, style]}
      {...rest}>
      {children}
    </View>
  );
}

export type QuestionReaderProps = Omit<ScrollViewProps, 'children'> & {
  questionText: string;
  media?: ReactNode;
  footer?: ReactNode;
};

/** Scrollable question body: optional media, question copy, optional footer (e.g. options). */
export function QuestionReader({ questionText, media, footer, ...rest }: QuestionReaderProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-6"
      keyboardShouldPersistTaps="handled"
      {...rest}>
      <QuestionCard>
        {media ? <View className="mb-4">{media}</View> : null}
        <AppText variant="questionBody" color="textPrimary">
          {questionText}
        </AppText>
      </QuestionCard>
      {footer}
    </ScrollView>
  );
}
