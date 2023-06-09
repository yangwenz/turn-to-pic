import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Drawer from "@/components/Drawer";
import DefaultLayout from "@/layout/default";
import HeroModal from "@/components/HeroModal";

import {
    defaultGuidanceScale,
    defaultNegativePrompt,
    defaultNumInferenceSteps,
    defaultRandomSeed
} from "@/configs/default";
import Image from "next/image";
import {label2name} from "@/configs/heroes";
import StyleModal from "@/components/StyleModal";

function ControlPanel({hero, setShowHeroModal, style, setShowStyleModal}: {
    hero: string,
    setShowHeroModal: (x: boolean) => void,
    style: string,
    setShowStyleModal: (x: boolean) => void
}) {
    let heroUrl = hero != ""? "/heroes/" + hero + ".jpg": "/heroes/question_mark.png";
    return (
        <div className="flex flex-row w-full items-center justify-center border-slate-500 rounded p-2">
            <div className="flex flex-row">
                <button
                    className="w-auto h-[36px] px-3 ml-1 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-gray-300 hover:text-black font-bold"
                    onClick={() => setShowHeroModal(true)}
                >
                    Choose a Hero
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
            <div className="flex flex-row ml-4">
                <button
                    className="w-auto min-h-[36px] px-3 ml-1 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-gray-300 hover:text-black font-bold"
                    onClick={() => {setShowStyleModal(true)}}
                >
                    Choose a Style
                </button>
                <div className="w-auto min-h-[36px] px-3 ml-1 rounded-lg border-2 border-slate-500 text-center
                    bg-gray-900 text-gray-300 font-bold flex items-center italic">
                    {style}
                </div>
            </div>
        </div>
    )
}

export default function Generate() {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [hero, setHero] = useState<string>("");
    const [style, setStyle] = useState<string>("Default");
    const [negativePrompt, setNegativePrompt] = useState<string>(defaultNegativePrompt);
    const [numSteps, setNumSteps] = useState<number>(defaultNumInferenceSteps);
    const [guidanceScale, setGuidanceScale] = useState<number>(defaultGuidanceScale);
    const [seed, setSeed] = useState<number | string>(defaultRandomSeed);
    const [showHeroModal, setShowHeroModal] = useState(false);
    const [showStyleModal, setShowStyleModal] = useState(false);

    if (status === "unauthenticated") {
        router.push("/signin");
        return <div>Unauthenticated</div>
    } else if (status === "loading") {
        return <div className="flex justify-end">
            <p>Validating session ...</p>
        </div>
    }

    const reset = () => {
        setNegativePrompt(defaultNegativePrompt);
        setNumSteps(defaultNumInferenceSteps);
        setGuidanceScale(defaultGuidanceScale);
        setSeed(defaultRandomSeed);
    }

    return (
        <DefaultLayout>
            <Drawer
                negativePrompt={negativePrompt}
                setNegativePrompt={(x: string) => {setNegativePrompt(x)}}
                numSteps={numSteps}
                setNumSteps={(x: number) => {setNumSteps(x)}}
                guidanceScale={guidanceScale}
                setGuidanceScale={(x: number) => setGuidanceScale(x)}
                seed={seed}
                setSeed={(x: number | string) => setSeed(x)}
                reset={reset}
            />
            <div className="flex flex-col lg:max-w-6xl w-full mx-auto items-center min-h-screen">
                <Header session={session} status={status}/>
                <main className="flex flex-col items-center justify-center
                text-center px-4 mt-8 sm:mb-0 mb-auto w-full">
                    <h1 className="mx-auto font-display text-4xl font-bold
                    tracking-normal text-slate-900 sm:text-5xl mb-5 drop-shadow-xl"
                        style={{fontFamily: "ABC"}}
                    >
                    <span className="animate-text bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300
                        bg-clip-text text-transparent font-black">
                        Creating Amazing Pictures of Dota 2 Heroes
                    </span>
                    </h1>
                    <ControlPanel
                        hero={hero}
                        setShowHeroModal={setShowHeroModal}
                        style={style}
                        setShowStyleModal={setShowStyleModal}
                    />
                    <HeroModal
                        showModal={showHeroModal}
                        setShowModal={setShowHeroModal}
                        hero={hero} setHero={(x: string) => setHero(x)}
                    />
                    <StyleModal
                        showModal={showStyleModal}
                        setShowModal={setShowStyleModal}
                        style={style}
                        setStyle={setStyle}
                    />
                </main>
                <Footer/>
            </div>
        </DefaultLayout>
    )
}
