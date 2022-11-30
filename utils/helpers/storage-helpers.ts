const AppStorage = {
  save: (key: string, value: any) => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.setItem(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    } catch (error) {
      console.error("Unable to save to localStorage: ", error);
    }
  },
  get: <T = any>(key: string): T | null => {
    if (typeof window === "undefined") {
      return null;
    }
    const str = localStorage.getItem(key);
    try {
      const output = str ? JSON.parse(str) : null;
      return output;
    } catch (error) {
      return str as any;
    }
  },
  remove: (key: string) => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(key);
  },
  clear: () => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.clear();
  }
};

if (typeof window !== "undefined") {
  const currentVersion = 0;
  const savedVersionStr = AppStorage.get<number>("LOCAL_STORAGE_SYNC_VERSION");
  const savedVersion = Number(savedVersionStr || 0);
  if (currentVersion > savedVersion) {
    AppStorage.clear();
    AppStorage.save("LOCAL_STORAGE_SYNC_VERSION", currentVersion);
  }
}

export default AppStorage;
