import clsx from "clsx";
import React, {useState} from "react";
import Image from "next/image";
import {FaBars} from "react-icons/fa";
import {UserHistoryRecord} from "@/hooks/useHistory";
import InfoCard from "@/components/InfoCard";

function HistoryCard(
    record: UserHistoryRecord,
    setShowInfo: (x: boolean) => void,
    setRecord: (x: UserHistoryRecord) => void,
    loadHistoryRecord: (x: UserHistoryRecord) => void,
    setDeleteRecord: (x: string) => void,
    isHovering: string,
    setIsHovering: (x: string) => void
) {
    const hasDataUrl = !!record.dataUrl;

    return (
        <div
            className="p-2 rounded-lg bg-gray-700 m-1"
            key={record.id}
            onMouseOver={() => {setIsHovering(record.id)}}
            onMouseOut={() => {setIsHovering("")}}
        >
            {hasDataUrl && (
                <div className="relative flex items-center justify-center">
                    <div
                        className="relative rounded-lg overflow-hidden md:w-60 md:h-60 w-48 h-48"
                    >
                        <Image
                            src={record.dataUrl!}
                            alt={record.id}
                            fill
                        />
                    </div>
                    {isHovering == record.id && (
                        <div className="absolute top-full -translate-y-full flex flex-row">
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
            )}
            {!hasDataUrl && (
                <div className="relative flex items-center justify-end">
                    <div
                        className="relative rounded-lg overflow-hidden md:w-60 md:h-10 w-48 h-8
                        flex flex-col items-center justify-center"
                    >
                        <span className="font-semibold">
                            {record.status == "starting" && (
                                <div className="flex flex-row items-center justify-center">
                                    <span className="mr-1">Generating</span>
                                    <LoadingIcon/>
                                </div>
                            )}
                            {record.status != "starting" && (
                                <span>Failed</span>
                            )}
                        </span>
                    </div>
                    {isHovering == record.id && (
                        <div className="absolute top-full -translate-y-full flex flex-row">
                            <button className="px-2 bg-white/60 rounded m-1 hover:bg-slate-500" title="Refresh">
                                <RefreshIcon/>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function History({historyRecords, showHistory, setShowHistory, loadHistoryRecord, deleteRecord}: {
    historyRecords: UserHistoryRecord[],
    showHistory: boolean,
    setShowHistory: (x: boolean) => void,
    loadHistoryRecord: (x: UserHistoryRecord) => void,
    deleteRecord: (x: string) => void
}) {
    const [showInfo, setShowInfo] = useState(false);
    const [record, setRecord] = useState<UserHistoryRecord | null>(null);
    const [isHovering, setIsHovering] = useState("");
    const [showDelete, setShowDelete] = useState("");

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
                        historyRecords.slice(0).reverse().map((record) => HistoryCard(
                            record, setShowInfo, setRecord, loadHistoryRecord,
                            setShowDelete, isHovering, setIsHovering
                        ))
                    )}
                </div>
            </div>
            {showInfo && (
                <InfoCard record={record} setShowInfo={setShowInfo}/>
            )}
            {showDelete != "" && (
                <DeleteModal
                    showDelete={showDelete}
                    setShowDelete={setShowDelete}
                    deleteRecord={deleteRecord}
                />
            )}
        </>
    )
}

function DeleteModal({showDelete, setShowDelete, deleteRecord}: {
    showDelete: string,
    setShowDelete: (x: string) => void,
    deleteRecord: (x: string) => void
}) {
    return (
        <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
            <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                rounded-lg shadow-xl bg-gray-900 flex flex-col items-center
                justify-center p-1"
            >
                <div className="text-white text-center text-xl font-bold px-5 py-2">
                    Are you sure to delete this record?
                </div>
                <div className="flex flex-row">
                    <button
                        className="h-10 px-2 m-2 text-white transition-colors duration-150
                                bg-gradient-to-br from-gray-500 to-gray-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                        onClick={() => setShowDelete("")}
                    >
                        Cancel
                    </button>
                    <button
                        className="h-10 px-5 m-2 text-white transition-colors duration-150
                                bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                        onClick={() => {
                            deleteRecord(showDelete);
                            setShowDelete("")
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

function OpenIcon() {
    return (
        <svg fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19,2 C20.5976809,2 21.9036609,3.24891996 21.9949073,4.82372721 L22,5
                L22,15 C22,16.5976809 20.75108,17.9036609 19.1762728,17.9949073 L19,18 L15,18
                L15,16 L19,16 C19.5128358,16 19.9355072,15.6139598 19.9932723,15.1166211
                L20,15 L20,6 L4,6 L4,15 C4,15.5128358 4.38604019,15.9355072 4.88337887,15.9932723
                L5,16 L9,16 L9,18 L5,18 C3.40231912,18 2.09633912,16.75108 2.00509269,15.1762728
                L2,15 L2,5 C2,3.40231912 3.24891996,2.09633912 4.82372721,2.00509269 L5,2 L19,2
                Z M12.082,8.003 L12.079,8.002 L12.2335141,8.02742266 L12.2335141,8.02742266
                L12.3416665,8.05989459 L12.3416665,8.05989459 L12.4232215,8.09367336
                L12.5207088,8.14599545 L12.5207088,8.14599545 L12.5951593,8.19631351
                L12.5951593,8.19631351 L12.7071068,8.29289322 L16.7071068,12.2928932
                C17.0976311,12.6834175 17.0976311,13.3165825 16.7071068,13.7071068
                C16.3466228,14.0675907 15.7793918,14.0953203 15.3871006,13.7902954
                L15.2928932,13.7071068 L13,11.414 L13,21 C13,21.5522847 12.5522847,22 12,22
                C11.4477153,22 11,21.5522847 11,21 L11,11.416 L8.70710678,13.7071068
                C8.34662282,14.0675907 7.77939176,14.0953203 7.38710056,13.7902954
                L7.29289322,13.7071068 C6.93240926,13.3466228 6.90467972,12.7793918
                7.20970461,12.3871006 L7.29289322,12.2928932 L11.2928932,8.29289322
                L11.336853,8.2514958 L11.336853,8.2514958 L11.4046934,8.19633458
                L11.4046934,8.19633458 L11.5159379,8.12467117 L11.5769009,8.09365378
                L11.5769009,8.09365378 L11.6583496,8.05988586 L11.6583496,8.05988586
                L11.734007,8.03584514 L11.734007,8.03584514 L11.8825258,8.00683422
                L11.8825258,8.00683422 L11.9667532,8.00054939 L11.9667532,8.00054939
                L12.082,8.003 Z"/>
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 20V4C2 3.44772 2.44772 3 3 3H8.44792C8.79153 3 9.11108 3.17641 9.29416 3.46719L10.5947
            5.53281C10.7778 5.82359 11.0974 6 11.441 6H21C21.5523 6 22 6.44772 22 7V20C22 20.5523 21.5523 21 21
            21H3C2.44772 21 2 20.5523 2 20Z" stroke="#200E32" strokeWidth="2"/>
            <path d="M12 13L12 17" stroke="#200E32" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="10" r="1" fill="#200E32"/>
        </svg>
    );
}

function RefreshIcon() {
    return (
        <svg fill="#000000" width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.1 14.313V5.396L24.158 8.34c-2.33-2.325-5.033-3.503-8.11-3.503C9.902
            4.837 4.901 9.847 4.899 16c.001 6.152 5.003 11.158 11.15 11.16 4.276 0 9.369-2.227
            10.836-8.478l.028-.122h-3.23l-.022.068c-1.078 3.242-4.138 5.421-7.613 5.421a8 8 0
            0 1-5.691-2.359A7.993 7.993 0 0 1 8 16.001c0-4.438 3.611-8.049 8.05-8.049 2.069 0
            3.638.58 5.924 2.573l-3.792 3.789H27.1z"/>
        </svg>
    );
}

function LoadingIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
             width="30px" height="30px" viewBox="0 0 32 32">
            <path className="linesandangles_een" d="M24.308,10.229V9H26V4H6v5h2v1.229c0,2.665,1.79,5.037,4.352,5.769L12.36,16l-0.008,0.002
            C9.79,16.734,8,19.107,8,21.771V23H6v5h20v-5h-1.692v-1.229c0-2.665-1.79-5.037-4.352-5.769L19.948,16l0.008-0.002
            C22.518,15.266,24.308,12.893,24.308,10.229z M8,7V6h16v1H8z M24,25v1H8v-1H24z M17.716,17.442l1.69,0.483
            c1.708,0.488,2.901,2.07,2.901,3.846V23H10v-1.229c0-1.776,1.193-3.358,2.901-3.846l1.691-0.483c0.65-0.186,1.087-0.766,1.087-1.442
            s-0.437-1.256-1.088-1.442l-1.69-0.483C11.193,13.586,10,12.005,10,10.229V9h12.308v1.229c0,1.776-1.193,3.358-2.901,3.846
            l-1.691,0.483c-0.651,0.186-1.088,0.766-1.088,1.442S17.064,17.257,17.716,17.442z"/>
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg width="30px" height="30px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#000000">
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216
                        L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206
                        L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204
                        Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220
                        L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"/>
                    </g>
                </g>
            </g>
        </svg>
    )
}
