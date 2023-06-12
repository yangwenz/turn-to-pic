import React, {useState} from "react";
import Image from "next/image";
import {UserHistoryRecord} from "@/hooks/useHistory";

export default function InfoCard({record, setShowInfo}: {
    record: UserHistoryRecord | null
    setShowInfo: (x: boolean) => void
}) {
    const [isHovering, setIsHovering] = useState(false);

    if (record == null) {
        return (
            <div></div>
        )
    }

    return (
        <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
            <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                rounded-lg shadow-xl bg-gray-900 flex flex-col items-center
                justify-center"
            >
                <div
                    className="relative md:w-[512px] md:h-[512px] w-[320px] h-[320px]
                        rounded-lg overflow-hidden m-2"
                    onMouseOver={() => {setIsHovering(true)}}
                    onMouseOut={() => {setIsHovering(false)}}
                >
                    <Image
                        src={record.dataUrl!}
                        alt="Generated image"
                        fill={true}
                        style={{objectFit: "contain"}}
                        onClick={() => setShowInfo(false)}
                    />
                    {isHovering && (
                        <div className="absolute top-full right-0 -translate-y-full flex flex-col
                            text-sm text-gray-300 font-semibold font-mono p-2 bg-white/20 rounded-lg">
                            <span>{`Width: ${record.width}`}</span>
                            <span>{`Height: ${record.height}`}</span>
                            <span>{`Inference steps: ${record.numInferenceSteps}`}</span>
                            <span>{`Guidance scale: ${record.guidanceScale}`}</span>
                            <span>{`Random seed: ${record.seed == ""? "null": record.seed}`}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-full justify-center">
                    <label className="text-gray-300 font-semibold mx-2 mb-1">
                        Style
                    </label>
                    <textarea
                        id="info_style"
                        rows={1}
                        value={record?.style}
                        className="bg-gray-300 border border-gray-300 text-gray-900 rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 resize-none font-semibold
                        lg:text-base text-sm mx-2"
                        disabled={true}
                    />
                    <label className="text-gray-300 font-semibold mx-2 mb-1 mt-1">
                        Input Prompt
                    </label>
                    <textarea
                        id="info_prompt"
                        rows={2}
                        value={record?.prompt}
                        className="bg-gray-300 border border-gray-300 text-gray-900 rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 resize-none font-semibold
                        lg:text-base text-sm mx-2"
                        disabled={true}
                    />
                    <label className="text-gray-300 font-semibold mx-2 mb-1 mt-1">
                        Negative Prompt
                    </label>
                    <textarea
                        id="info_negative_prompt"
                        rows={2}
                        value={record?.negativePrompt}
                        className="bg-gray-300 border border-gray-300 text-gray-900 rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 resize-none font-semibold
                        lg:text-base text-sm mx-2"
                        disabled={true}
                    />
                </div>
                <button
                    className="h-10 px-5 m-2 text-white transition-colors duration-150
                                    bg-gradient-to-br from-gray-500 to-gray-700
                                    rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                    onClick={() => setShowInfo(false)}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
