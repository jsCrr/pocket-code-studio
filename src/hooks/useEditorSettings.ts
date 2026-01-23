import { useState, useEffect } from 'react';

export interface EditorSettings {
  fontSize: number;
  theme: 'dark' | 'monokai' | 'dracula' | 'nord';
}

const STORAGE_KEY = 'mobile-editor-settings';

const defaultSettings: EditorSettings = {
  fontSize: 14,
  theme: 'dark',
};

export const useEditorSettings = () => {
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  return { settings, setSettings };
};
