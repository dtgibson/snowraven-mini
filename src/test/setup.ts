// Vitest jsdom setup. The golden formatter tests are pure (no clipboard/DOM
// needed), but later UI tests will exercise copyText, so stub the clipboard and
// execCommand here once. jsdom does not implement either.

import { vi } from 'vitest';

if (!('clipboard' in navigator)) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
    writable: true,
  });
}

if (typeof document !== 'undefined' && !document.execCommand) {
  document.execCommand = vi.fn().mockReturnValue(true);
}
