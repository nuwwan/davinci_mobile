import { useWindowDimensions as useRNWindowDimensions } from 'react-native';

const COMPACT_WIDTH = 375;
const LARGE_WIDTH = 430;

/**
 * Window size plus simple layout buckets from the product plan (no hardcoded per-device widths).
 */
export function useWindowDimensions() {
  const { width, height, fontScale, scale } = useRNWindowDimensions();
  const isCompactPhone = width <= COMPACT_WIDTH;
  const isLargePhone = width >= LARGE_WIDTH;
  const isTablet = width >= 768;

  return {
    width,
    height,
    fontScale,
    scale,
    isCompactPhone,
    isLargePhone,
    isTablet,
  };
}
