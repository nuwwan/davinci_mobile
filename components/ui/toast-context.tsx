import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import type { ColorName } from '@/src/theme';

export type ToastKind = 'success' | 'error' | 'info';

type ToastPayload = {
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ message, kind });
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, AUTO_DISMISS_MS);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <ToastView payload={toast} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

const KIND_CLASS: Record<ToastKind, { container: string; text: ColorName }> = {
  success: { container: 'bg-correct-bg border-correct-border', text: 'correct' },
  error: { container: 'bg-wrong-bg border-wrong-border', text: 'wrong' },
  info: { container: 'bg-primary-light border-primary-muted', text: 'primary' },
};

function ToastView({ payload }: { payload: ToastPayload }) {
  const insets = useSafeAreaInsets();
  const kindClass = KIND_CLASS[payload.kind];

  return (
    <View
      pointerEvents="none"
      style={{ top: insets.top + 8 }}
      className={cn(
        'absolute left-4 right-4 z-[9999] rounded-lg border px-4 py-3',
        kindClass.container
      )}>
      <AppText variant="body" color={kindClass.text} numberOfLines={3}>
        {payload.message}
      </AppText>
    </View>
  );
}
