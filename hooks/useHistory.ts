import {useState} from "react";

export type UserHistoryRecord = {
    // Task info
    id: string;
    createdAt: string;
    createdTimestamp: number;
    endpointUrl: string;
    cancelUrl: string;
    status: string;
    // Parameter info
    hero: string;
    heroWeight: number;
    style: string;
    styleWeight: number;
    prompt: string;
    negativePrompt: string;
    width: number;
    height: number;
    numInferenceSteps: number;
    guidanceScale: number;
    seed: number | string;
    // Image info
    imageUrl?: string;
    dataUrl?: string;
}

const HISTORY_KEY = "USER_HISTORY";
const DEFAULT_HISTORY: UserHistoryRecord[] = [];

export function loadHistory() {
    if (typeof window === "undefined") {
        return DEFAULT_HISTORY;
    }
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) {
        return DEFAULT_HISTORY;
    }

    try {
        return JSON.parse(data) as UserHistoryRecord[];
    } catch (error) {}

    return DEFAULT_HISTORY;
}

export function useHistory() {
    const [history, setHistory] = useState<UserHistoryRecord[]>(loadHistory);

    const saveHistory = (history: UserHistoryRecord[]) => {
        setHistory(history);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    const addRecord = (record: UserHistoryRecord, maxLength: number = 50) => {
        let newHistory: UserHistoryRecord[] = [...history];
        if (newHistory.length >= maxLength) {
            newHistory.shift();
        }
        newHistory.push(record);
        saveHistory(newHistory);
    }

    const updateRecordStatus = (id: string, status: string, imageUrl?: string) => {
        let newHistory: UserHistoryRecord[] = [...history];
        for (let i = 0; i < history.length; i++) {
            if (newHistory[i].id === id) {
                newHistory[i].status = status;
                newHistory[i].imageUrl = imageUrl;
                break;
            }
        }
        saveHistory(newHistory);
    }

    const clearHistory = () => {
        saveHistory([]);
    }

    return {
        history,
        addRecord,
        updateRecordStatus,
        clearHistory
    }
}
