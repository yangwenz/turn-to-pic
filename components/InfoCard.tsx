import React, {useState} from "react";
import Image from "next/image";

interface ImageInfo {
    id: string;
    dataUrl?: string;

    hero: string;
    heroWeight?: number;
    style: string;
    styleWeight?: number;
    prompt: string;
    negativePrompt: string;
    width: number;
    height: number;
    numInferenceSteps?: number;
    guidanceScale?: number;
    seed?: number | string;
}

export default function InfoCard({record, setShowInfo}: {
    record: ImageInfo | null
    setShowInfo: (x: boolean) => void
}) {
    const [isHovering, setIsHovering] = useState(false);

    if (record == null) {
        return (
            <div></div>
        )
    }

    return (
        <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90">
            <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                rounded-lg shadow-xl bg-gray-900 flex flex-col items-center
                justify-center"
            >
                <div
                    className="relative md:w-[480px] md:h-[480px] w-[320px] h-[320px]
                        rounded-lg overflow-hidden m-2"
                    onMouseOver={() => {setIsHovering(true)}}
                    onMouseOut={() => {setIsHovering(false)}}
                >
                    {record.dataUrl && (
                        <Image
                            src={record.dataUrl!}
                            alt="Generated image"
                            fill={true}
                            sizes="(max-width: 512px) 100vw"
                            style={{objectFit: "contain"}}
                            onClick={() => setShowInfo(false)}
                        />
                    )}
                    {isHovering && (
                        <div className="absolute top-full right-0 -translate-y-full flex flex-col
                            text-sm font-semibold font-mono p-2 bg-white/30 rounded-lg text-black">
                            <span>{`Width: ${record.width}`}</span>
                            <span>{`Height: ${record.height}`}</span>
                            {record.numInferenceSteps != undefined && (
                                <span>{`Inference steps: ${record.numInferenceSteps}`}</span>
                            )}
                            {record.guidanceScale != undefined && (
                                <span>{`Guidance scale: ${record.guidanceScale}`}</span>
                            )}
                            {record.seed != undefined && (
                                <span>{`Random seed: ${record.seed == ""? "null": record.seed}`}</span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center md:w-full w-[320px]">
                    <div className="flex flex-row">
                        <div className="flex flex-col w-1/2">
                            <label className="text-gray-300 font-semibold mx-2 mb-1">
                                Hero
                            </label>
                            <textarea
                                id="info_hero"
                                rows={1}
                                value={record?.hero}
                                className="bg-gray-300 border border-gray-300 text-gray-900 rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 resize-none font-semibold
                        lg:text-base text-sm mx-2"
                                disabled={true}
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
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
                        </div>
                    </div>
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
