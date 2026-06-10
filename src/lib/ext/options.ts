// Open the Options page from the popup (the FR-41 "Go to Settings ->" nudge).
// chrome.runtime.openOptionsPage() opens options.html consistently in both
// browsers (options_ui.open_in_tab: true).

export function openOptions(): void {
  chrome.runtime.openOptionsPage();
}
