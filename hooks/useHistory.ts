import {useState} from "react";
import {downloadImageAsDataURL} from "@/utils/file";

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
        const obj = JSON.parse(data);
        return Object.keys(obj).map(function(index){
            return obj[index];
        }) as UserHistoryRecord[];
    } catch (error) {}

    return DEFAULT_HISTORY;
}

export function useHistory() {
    const [history, setHistory] = useState<UserHistoryRecord[]>(loadHistory);
    let historyRecords = [...history];

    const saveHistory = () => {
        setHistory(historyRecords);
        while (historyRecords.length > 0)
        {
            try {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(historyRecords));
                break;
            } catch (e) {
                // Remove the oldest record if there is no enough storage.
                historyRecords = historyRecords.slice(1);
            }
        }
    }

    const addRecord = (
        record: UserHistoryRecord,
        maxLength: number = 30
    ) => {
        if (historyRecords.length >= maxLength) {
            historyRecords.shift();
        }
        historyRecords.push(record);
        saveHistory();
    }

    const updateRecord = async (
        id: string,
        status: string,
        imageUrl?: string
    ) => {
        for (let i = 0; i < historyRecords.length; i++) {
            if (historyRecords[i].id === id) {
                historyRecords[i].status = status;
                if (imageUrl) {
                    historyRecords[i].imageUrl = imageUrl;
                    historyRecords[i].dataUrl = await downloadImageAsDataURL(imageUrl);
                }
                break;
            }
        }
        saveHistory();
    }

    const deleteRecord = (id: string) => {
        let index: number = -1;
        for (let i = 0; i < historyRecords.length; i++) {
            if (historyRecords[i].id === id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            historyRecords.splice(index, 1);
        }
        saveHistory();
    }

    return {
        history,
        addRecord,
        updateRecord,
        deleteRecord
    }
}
