import {useState} from "react";

export type UserSettings = {
    apikey?: string;
}

const SETTINGS_KEY = "USER_SETTINGS";
const DEFAULT_SETTINGS: UserSettings = {
    apikey: undefined,
};

function loadSettings() {
    if (typeof window === "undefined") {
        return DEFAULT_SETTINGS;
    }

    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
        return DEFAULT_SETTINGS;
    }

    try {
        const obj = JSON.parse(data) as UserSettings;
        Object.entries(obj).forEach(([key, value]) => {
            if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
                // @ts-ignore
                DEFAULT_SETTINGS[key] = value;
            }
        });
    } catch (error) {}

    return DEFAULT_SETTINGS;
}

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(loadSettings);

    const saveSettings = (settings: UserSettings) => {
        setSettings(settings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    };

    return {
        settings,
        saveSettings,
    };
}
