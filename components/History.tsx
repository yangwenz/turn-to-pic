import clsx from "clsx";
import React from "react";
import Image from "next/image";
import {FaBars} from "react-icons/fa";
import {UserHistoryRecord} from "@/hooks/useHistory";

function HistoryCard(record: UserHistoryRecord) {
    const hasDataUrl = !!record.dataUrl;

    return (
        <div className="p-2 rounded-lg bg-gray-700 m-1" key={record.id}>
            {hasDataUrl && (
                <div
                    className="relative rounded-lg overflow-hidden md:w-60 md:h-60 w-48 h-48"
                >
                    <Image
                        src={record.dataUrl!}
                        alt={record.id}
                        fill
                        blurDataURL={record.dataUrl!}
                    />
                </div>
            )}
            {!hasDataUrl && (
                <div
                    className="relative rounded-lg overflow-hidden md:w-60 md:h-10 w-48 h-8
                    flex flex-col items-center justify-center"
                >
                    <span className="font-semibold italic">
                        {record.status == "starting"? "Generating ...": "Failed"}
                    </span>
                </div>
            )}
        </div>
    )
}

export default function History({showHistory, setShowHistory, historyRecords}: {
    showHistory: boolean,
    setShowHistory: (x: boolean) => void,
    historyRecords: UserHistoryRecord[]
}) {
    return (
        <>
            <div
                id="drawer"
                className={clsx(
                    showHistory ? "-translate-x-full" : "translate-x-0",
                    "z-40 m-0 flex h-screen md:w-80 w-64 flex-col justify-between bg-gray-900 p-3 " +
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
                            <FaBars />
                        </button>
                    </div>
                    <div className="border-b border-slate-500 mt-2 mb-2 w-full"></div>
                    {historyRecords.length == 0 && (
                        <div className="font-semibold italic">No Records</div>
                    )}
                    {historyRecords.length > 0 && (
                        historyRecords.slice(0).reverse().map((record) => HistoryCard(record))
                    )}
                </div>
            </div>
        </>
    )
}
