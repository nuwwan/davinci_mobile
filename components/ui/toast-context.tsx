import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

export type ToastKind = 'success' | 'error' | 'info';

type ToastPayload = { id: number; message: string; kind: ToastKind };

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, kind: ToastKind = 'info', durationMs = DEFAULT_DURATION_MS) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ id: Date.now(), message, kind });
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <ToastView key={toast.id} payload={toast} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/** Figma "O Toasts": top, 8pt below status bar, 16pt side margins, radius 12, 14 Medium. */
const KIND: Record<ToastKind, { box: string; text: ColorName }> = {
  success: { box: 'bg-success-bg border-success-border', text: 'success' },
  error: { box: 'bg-error-bg border-error-border', text: 'error' },
  info: { box: 'bg-primary-light border-primary-muted', text: 'primary' },
};

function ToastView({ payload }: { payload: ToastPayload }) {
  const insets = useSafeAreaInsets();
  const k = KIND[payload.kind];
  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(160)}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, zIndex: 9999 }}>
      <View className={cn('rounded-md border px-4 py-3', k.box)}>
        <AppText variant="bodyStrong" color={k.text} numberOfLines={3}>
          {payload.message}
        </AppText>
      </View>
    </Animated.View>
  );
}
