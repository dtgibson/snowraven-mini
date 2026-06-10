// chrome.storage.local key adapter — the extension replacement for SnowRaven's
// `storage.ts`. Keeps ONLY the three key methods of the desktop StorageAdapter
// (storage.ts:13-16); the file/settings/CSV methods are desktop concerns and are
// dropped. The two BYO keys ('ebird'/'openweather') are the only at-rest state.
//
// Matches TauriStorage.getApiKey semantics (storage.ts:121-129): an empty string
// resolves to null. Keys leave the device only as the eBird X-eBirdApiToken
// header and the OpenWeather appid param (FR-40, NFR-02).

export type ApiKeyService = 'ebird' | 'openweather';

export interface StorageAdapter {
  getApiKey(service: ApiKeyService): Promise<string | null>;
  setApiKey(service: ApiKeyService, value: string): Promise<void>;
  deleteApiKey(service: ApiKeyService): Promise<void>;
}

class ChromeLocalStorage implements StorageAdapter {
  async getApiKey(service: ApiKeyService): Promise<string | null> {
    const data = await chrome.storage.local.get([service]);
    const value = data[service] as string | undefined;
    return value && value.length > 0 ? value : null;
  }

  async setApiKey(service: ApiKeyService, value: string): Promise<void> {
    await chrome.storage.local.set({ [service]: value });
  }

  async deleteApiKey(service: ApiKeyService): Promise<void> {
    await chrome.storage.local.remove([service]);
  }
}

export const storage: StorageAdapter = new ChromeLocalStorage();
