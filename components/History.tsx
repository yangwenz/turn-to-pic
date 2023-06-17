import clsx from "clsx";
import React, {useState} from "react";
import Image from "next/image";
import {FaBars} from "react-icons/fa";
import {UserHistoryRecord} from "@/hooks/useHistory";
import ImageInfoCard from "@/components/ImageInfoCard";
import {ErrorInfoModal, DeleteModal, LoadingProgressModal} from "@/components/InfoModal";
import {Upload} from "upload-js";
import {dataURLtoBlob} from "@/utils/file";
import {getUploadKey, hashHistoryRecord} from "@/utils/crypto";

import {
    DeleteIcon,
    InfoIcon,
    LoadingIcon,
    OpenIcon,
    RefreshIcon,
    ShareIcon
} from "@/components/Icons";
import {GetImageResponse} from "@/pages/api/gallery/image";

function HistoryCard(
    record: UserHistoryRecord,
    setShowInfo: (x: boolean) => void,
    setRecord: (x: UserHistoryRecord) => void,
    loadHistoryRecord: (x: UserHistoryRecord) => void,
    setDeleteRecord: (x: string) => void,
    isHovering: string,
    setIsHovering: (x: string) => void,
    refresh: (x: UserHistoryRecord) => void,
    share: (x: UserHistoryRecord) => void,
) {
    const hasDataUrl = !!record.dataUrl;

    return (
        <div
            className="p-2 rounded-lg bg-gray-700 m-1"
            key={record.id}
            onMouseOver={() => {
                setIsHovering(record.id)
            }}
            onMouseOut={() => {
                setIsHovering("")
            }}
        >
            <div className="relative flex items-center justify-center">
                {hasDataUrl && (
                    <div
                        className="relative rounded-lg overflow-hidden md:w-56 md:h-56 w-48 h-48"
                    >
                        <Image
                            src={record.dataUrl!}
                            alt={record.id}
                            fill
                        />
                    </div>
                )}
                {!hasDataUrl && (
                    <div
                        className="relative rounded-lg overflow-hidden md:w-56 md:h-10 w-48 h-8
                    flex flex-col items-center justify-center"
                    >
                    <span className="font-semibold">
                        {record.status == "starting" && (
                            <div className="flex flex-row items-center justify-center">
                                <span className="mr-1">Generating</span>
                                <LoadingIcon/>
                            </div>
                        )}
                        {record.status == "succeeded" && (
                            <span>Succeeded</span>
                        )}
                        {record.status == "image unavailable" && (
                            <span>Image Unavailable</span>
                        )}
                        {record.status == "failed" && (
                            <span>Failed</span>
                        )}
                    </span>
                    </div>
                )}
                {isHovering == record.id && (
                    <div className="absolute top-full -translate-y-full flex flex-row">
                        {!hasDataUrl && record.status == "starting" && (
                            <button
                                className="px-2 bg-white/60 rounded m-1 hover:bg-slate-500"
                                title="Refresh"
                                onClick={() => refresh(record)}
                            >
                                <RefreshIcon/>
                            </button>
                        )}
                        <button
                            className="px-2 bg-white/60 rounded m-1 hover:bg-slate-500"
                            title="Load"
                            onClick={() => loadHistoryRecord(record)}
                        >
                            <OpenIcon/>
                        </button>
                        <button
                            className="px-2 bg-white/60 rounded m-1 hover:bg-slate-500"
                            title="Info"
                            onClick={() => {
                                setShowInfo(true);
                                setRecord(record);
                            }}
                        >
                            <InfoIcon/>
                        </button>
                        {hasDataUrl && (
                            <button
                                className="px-2 bg-white/60 rounded m-1 hover:bg-slate-500"
                                title="Share"
                                onClick={() => share(record)}
                            >
                                <ShareIcon/>
                            </button>
                        )}
                        <button
                            className="px-2 bg-white/60 rounded m-1 hover:bg-slate-500"
                            title="Delete"
                            onClick={() => setDeleteRecord(record.id)}
                        >
                            <DeleteIcon/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function History(
    {
        historyRecords, showHistory, setShowHistory,
        loadHistoryRecord, deleteRecord, refreshRecord
    }: {
        historyRecords: UserHistoryRecord[],
        showHistory: boolean,
        setShowHistory: (x: boolean) => void,
        loadHistoryRecord: (x: UserHistoryRecord) => void,
        deleteRecord: (x: string) => void,
        refreshRecord: (x: UserHistoryRecord) => void
    }
) {
    const [record, setRecord] = useState<UserHistoryRecord | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [isHovering, setIsHovering] = useState("");
    const [showDelete, setShowDelete] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    async function refresh(record: UserHistoryRecord) {
        await refreshRecord(record);
    }

    async function uploadImage(dataUrl: string): Promise<string | null> {
        try {
            setProgress(0);
            const upload = Upload({apiKey: getUploadKey()});
            const {fileUrl} = await upload.uploadFile(
                dataURLtoBlob(dataUrl),
                {
                    onProgress: ({ progress }) => setProgress(progress),
                }
            );
            return fileUrl;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async function share(record: UserHistoryRecord) {
        setLoading(true);
        setError(null);

        if (!record.dataUrl || record.hash !== hashHistoryRecord(record))
            setError("The data is invalid")
        else {
            try {
                // Check if the image has been already shared
                const imageRes = await fetch("/api/gallery/image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: record.id,
                        onlyUrl: true
                    }),
                })
                if (imageRes.status != 200) {
                    setError("Connection error, please try again later.");
                    return;
                }
                let imageJsonResponse = (await imageRes.json()) as GetImageResponse;
                if (imageJsonResponse.id) {
                    setError("The image has been shared already.");
                    return;
                }

                // Upload the image file
                const fileUrl = await uploadImage(record.dataUrl!);
                if (!fileUrl) {
                    setError("Connection error or exceed the sharing limit. Please try again later.");
                    return;
                }

                // Update the share information
                const obj = {
                    id: record.id,
                    imageUrl: fileUrl!,
                    hash: "",
                    width: record.width,
                    height: record.height,
                    hero: record.hero,
                    heroWeight: record.heroWeight,
                    style: record.style,
                    styleWeight: record.styleWeight,
                    prompt: record.prompt,
                    negativePrompt: record.negativePrompt,
                    numInferenceSteps: record.numInferenceSteps,
                    guidanceScale: record.guidanceScale
                }
                obj.hash = hashHistoryRecord(obj);
                const res = await fetch("/api/gallery/share", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                });
                if (res.status !== 200) {
                    setError(await res.json());
                }

            } catch (error) {
                setError("An error occurred, please try again later.");
            } finally {
                setLoading(false);
            }
        }
        setLoading(false);
    }

    return (
        <>
            <div
                id="drawer"
                className={clsx(
                    showHistory ? "-translate-x-full" : "translate-x-0",
                    "z-40 m-0 flex h-screen md:w-72 w-64 flex-col justify-between bg-gray-900/90 p-3 " +
                    "text-gray-300 shadow-3xl transition-all",
                    "fixed top-0 left-full "
                )}
            >
                <div className="flex flex-col gap-1 overflow-y-auto items-center">
                    <div className="mb-2 flex justify-center gap-2">
                        <span className="font-bold text-lg">
                            History
                        </span>
                        <button
                            className={clsx(
                                showHistory ? "translate-x-2" : "-translate-x-12",
                                "absolute left-0 top-2 z-40 rounded-md border-2 border-slate-500 " +
                                "bg-transparent p-2 text-gray-300 transition-all hover:bg-gray-300 " +
                                "hover:text-black"
                            )}
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            <FaBars/>
                        </button>
                    </div>
                    <div className="border-t border-slate-500 mt-2 mb-2 w-full text-sm text-center text-gray-300/60">
                        <div className="mt-1">Up to 10 images are stored due to the local storage limit</div>
                    </div>
                    {historyRecords.length == 0 && (
                        <div className="font-semibold italic">No Records</div>
                    )}
                    {historyRecords.length > 0 && (
                        historyRecords.slice(0).reverse().map((record) => HistoryCard(
                            record, setShowInfo, setRecord, loadHistoryRecord,
                            setShowDelete, isHovering, setIsHovering, refresh, share
                        ))
                    )}
                </div>
            </div>
            {showInfo && (
                <ImageInfoCard record={record} setShowInfo={setShowInfo}/>
            )}
            {showDelete != "" && (
                <DeleteModal
                    showDelete={showDelete}
                    setShowDelete={setShowDelete}
                    deleteRecord={deleteRecord}
                />
            )}
            {loading && (
                <LoadingProgressModal
                    content={"Sharing ..."}
                    progress={progress}
                />
            )}
            {error && (
                <ErrorInfoModal
                    error={error}
                    onClickError={() => setError(null)}
                />
            )}
        </>
    )
}
