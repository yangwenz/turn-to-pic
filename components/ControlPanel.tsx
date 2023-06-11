import Image from "next/image";
import {label2name} from "@/configs/heroes";
import React from "react";

export default function ControlPanel({hero, setShowHeroModal, style, setShowStyleModal, setPrompt, onClickGenerate}: {
    hero: string,
    setShowHeroModal: (x: boolean) => void,
    style: string,
    setShowStyleModal: (x: boolean) => void,
    setPrompt: (x: string) => void,
    onClickGenerate: () => void
}) {
    let heroUrl = hero != "" ? "/heroes/" + hero + ".jpg" : "/heroes/question_mark.png";
    return (
        <div className="flex flex-col w-full items-center justify-center">
            <div className="flex flex-row w-full items-center justify-center border-slate-500 rounded p-2 mb-2">
                <div className="flex flex-row">
                    <button
                        className="w-auto h-[36px] px-3 ml-1 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold"
                        onClick={() => setShowHeroModal(true)}
                    >
                        Hero
                    </button>
                    <div className={"flex flex-col w-[64px] items-center justify-center ml-1"}>
                        <div className={"relative w-[64px] h-[36px] rounded-lg overflow-hidden"}>
                            <Image
                                src={heroUrl}
                                alt="imagebox"
                                title={label2name(hero)}
                                fill
                                sizes="(max-width: 96px), (max-width: 64px)"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row ml-5">
                    <button
                        className="w-auto min-h-[36px] px-3 ml-1 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold"
                        onClick={() => {
                            setShowStyleModal(true)
                        }}
                    >
                        Style
                    </button>
                    <div className="w-auto min-h-[36px] px-3 ml-1 rounded-lg text-center
                    bg-gray-900 text-gray-300 font-bold flex items-center italic lg:text-base text-xs">
                        {style}
                    </div>
                </div>
            </div>
            <div className="flex flex-row md:w-2/3 w-full">
                <textarea
                    id="prompt"
                    rows={2}
                    name="prompt"
                    placeholder="Enter a prompt e.g., standing, (full body)++..."
                    className="bg-gray-300 border border-gray-300 text-gray-900 rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full resize-none font-semibold
                        lg:text-base text-sm"
                    maxLength={800}
                    onChange={(event) => setPrompt(event.target.value)}
                />
                <button
                    className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-lg
                        px-1 hover:bg-gradient-to-bl focus:ring-4 font-bold lg:text-base text-sm"
                    onClick={onClickGenerate}
                >
                    Generate Image
                </button>
            </div>
        </div>
    )
}
