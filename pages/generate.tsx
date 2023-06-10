import React, {useState} from "react";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Drawer from "@/components/Drawer";
import DefaultLayout from "@/layout/default";
import HeroModal from "@/components/HeroModal";
import StyleModal from "@/components/StyleModal";
import ControlPanel from "@/components/ControlPanel";
import ImageCard from "@/components/ImageCard";
import ButtonList from "@/components/ButtonList";

import {
    defaultGuidanceScale,
    defaultWidth,
    defaultHeight,
    defaultNegativePrompt,
    defaultNumInferenceSteps,
    defaultRandomSeed
} from "@/configs/default";


export default function Generate() {
    const {data: session, status} = useSession();
    const router = useRouter();

    // The selected hero
    const [hero, setHero] = useState<string>("");
    const [heroWeight, setHeroWeight] = useState<number>(2);
    // The selected style
    const [style, setStyle] = useState<string>("Default");
    const [styleWeight, setStyleWeight] = useState<number>(2);
    // Prompt
    const [prompt, setPrompt] = useState<string>("");
    // The other parameters
    const [negativePrompt, setNegativePrompt] = useState<string>(defaultNegativePrompt);
    const [width, setWidth] = useState<number>(defaultWidth);
    const [height, setHeight] = useState<number>(defaultHeight);
    const [numSteps, setNumSteps] = useState<number>(defaultNumInferenceSteps);
    const [guidanceScale, setGuidanceScale] = useState<number>(defaultGuidanceScale);
    const [seed, setSeed] = useState<number | string>(defaultRandomSeed);
    // Modal related
    const [showHeroModal, setShowHeroModal] = useState(false);
    const [showStyleModal, setShowStyleModal] = useState(false);
    // The generated image
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

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
        setWidth(defaultWidth);
        setHeight(defaultHeight);
        setNumSteps(defaultNumInferenceSteps);
        setGuidanceScale(defaultGuidanceScale);
        setSeed(defaultRandomSeed);
    }

    return (
        <DefaultLayout>
            <Drawer
                negativePrompt={negativePrompt}
                setNegativePrompt={(x: string) => setNegativePrompt(x)}
                width={width}
                setWidth={(x: number) => setWidth(x)}
                height={height}
                setHeight={(x: number) => setHeight(x)}
                numSteps={numSteps}
                setNumSteps={(x: number) => setNumSteps(x)}
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
                        setPrompt={(x: string) => setPrompt(x)}
                    />
                    <div className="flex w-full flex-col items-center text-center mt-2">
                        {generatedImage && (
                            <ImageCard url={generatedImage}/>
                        )}
                        {!generatedImage && (
                            <div className="border border-slate-500 md:w-[512px] w-[320px]
                                md:h-[512px] h-[320px] rounded-lg m-3 flex flex-col items-center justify-center">
                                <Image src="/picture.png" alt="pic_logo" width={100} height={100}/>
                            </div>
                        )}
                    </div>
                    <ButtonList
                        onClickDownload={() => {}}
                        onClickHelp={() => {}}
                    />
                    <HeroModal
                        showModal={showHeroModal}
                        setShowModal={setShowHeroModal}
                        hero={hero}
                        setHero={(x: string) => setHero(x)}
                        weight={heroWeight}
                        setWeight={(x: number) => setHeroWeight(x)}
                    />
                    <StyleModal
                        showModal={showStyleModal}
                        setShowModal={setShowStyleModal}
                        style={style}
                        setStyle={setStyle}
                        weight={styleWeight}
                        setWeight={(x: number) => setStyleWeight(x)}
                    />
                </main>
                <Footer/>
            </div>
        </DefaultLayout>
    )
}
