import { Text, type TextProps } from 'react-native';

import { cn } from '@/lib/cn';

export type ThemedTextType = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  className?: string;
};

const TYPE_CLASS: Record<ThemedTextType, string> = {
  default: 'text-body font-inter text-t-primary',
  title: 'text-page-title font-display text-t-primary',
  subtitle: 'text-section font-display-semibold text-t-secondary',
  defaultSemiBold: 'text-[16px] leading-6 font-inter-semibold text-t-primary',
  link: 'text-body font-inter text-secondary',
};

export function ThemedText({ type = 'default', className, ...rest }: ThemedTextProps) {
  return <Text className={cn(TYPE_CLASS[type], className)} {...rest} />;
}
