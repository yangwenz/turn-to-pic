import Spinner from "@/components/Spinner";
import React from "react";

export function LoadingInfoModal({content, otherInfo}: {
    content: string,
    otherInfo: string}
) {
    return (
        <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
            <div
                className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{zIndex: 100}}
            >
                <div className="p-4 w-80 bg-white text-center rounded-lg animate-in zoom-in
                                    flex flex-col items-center justify-center">
                    <Spinner/>
                    <p className="pt-3 opacity-50 text-center text-base mb-2">
                        {content}
                    </p>
                    <span className="text-xs opacity-30">
                        {otherInfo}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function ErrorInfoModal({error, onClickError}: {
    error: string,
    onClickError: () => void}
) {
    return (
        <div
            className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90"
            onClick={() => onClickError()}
        >
            <div
                className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{zIndex: 200}}
                role="alert"
            >
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                    ERROR
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-4 text-red-700">
                    {error}
                </div>
            </div>
        </div>
    );
}
