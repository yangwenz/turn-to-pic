import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

import {
    defaultGuidanceScale,
    defaultWidth,
    defaultHeight,
    defaultNegativePrompt,
    defaultNumInferenceSteps,
    defaultRandomSeed
} from "@/configs/default";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Drawer from "@/components/Drawer";
import DefaultLayout from "@/layout/default";
import HeroModal from "@/components/HeroModal";
import StyleModal from "@/components/StyleModal";
import ControlPanel from "@/components/ControlPanel";
import ImageCard from "@/components/ImageCard";
import ButtonList from "@/components/ButtonList";
import {downloadImage} from "@/utils/file";
import History from "@/components/History";
import {loadSettings} from "@/hooks/useSettings";
import {buildPrompt} from "@/utils/prompt";
import {label2name} from "@/configs/heroes";
import {GenerateResponse} from "@/pages/api/generate";
import {AccessResponse} from "@/pages/api/access";
import Spinner from "@/components/Spinner";


export default function Generate() {
    const {data: session, status} = useSession();
    const router = useRouter();

    // Menu:
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [showDrawer, setShowDrawer] = useState(true);
    const [showHistory, setShowHistory] = useState(true);
    // The selected hero
    const [hero, setHero] = useState<string>("");
    const [heroWeight, setHeroWeight] = useState<number>(0);
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
    // App states
    const [generatedImage, setGeneratedImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Function to check if the screen width is for desktop or tablet
        const checkScreenWidth = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 768) {
                // 768px is the breakpoint for tablet devices
                setIsTablet(false);
                setShowDrawer(true);
                setShowHistory(true);
            } else {
                setIsTablet(true);
                setShowDrawer(false);
                setShowHistory(false);
            }
        };
        // Call the checkScreenWidth function initially
        checkScreenWidth();
        // Set up an event listener for window resize events
        window.addEventListener("resize", checkScreenWidth);
        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

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

    async function onClickDownload() {
        if (!loading && generatedImage) {
            console.log(generatedImage);
            downloadImage(generatedImage!, "hero.jpg");
        }
    }

    async function onClickError() {
        setError(null);
    }

    async function onClickGenerate() {
        setLoading(true);
        setError(null);
        const settings = loadSettings();

        if (!settings.apikey) {
            setError("Please set your Replicate API Key")
        }
        if (!hero) {
            setError("Please select a Dota2 hero")
        }

        let endpointUrl: string = "";
        // Submit a request
        try {
            const body = {
                hero: label2name(hero, true),
                heroWeight: heroWeight,
                prompt: buildPrompt(prompt, style, styleWeight),
                negativePrompt: negativePrompt,
                width: width,
                height: height,
                numInferenceSteps: numSteps,
                guidanceScale: guidanceScale,
                seed: seed,
                token: settings.apikey
            };
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (res.status !== 200) {
                setError(await res.json());
            } else {
                let response = (await res.json()) as GenerateResponse;
                endpointUrl = response.endpointUrl;
                // Add to history...
            }
        } catch (error) {
            setError("Failed to generate image");
        }

        // Check the generated image
        if (endpointUrl !== "") {
            const body = {
                endpointUrl: endpointUrl,
                token: settings.apikey!
            }
            const res = await fetch("/api/access", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (res.status !== 200) {
                setError(await res.json());
            } else {
                let response = (await res.json()) as AccessResponse;
                setGeneratedImage(response.generated);
                // Update the history...
            }
        }
        setLoading(false);
    }

    return (
        <DefaultLayout>
            <Drawer
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
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
            <History
                showHistory={showHistory}
                setShowHistory={setShowHistory}
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
                        onClickGenerate={onClickGenerate}
                    />
                    <div className="flex w-full flex-col items-center text-center mt-2">
                        {generatedImage && (
                            <ImageCard
                                url={generatedImage}
                                isTablet={isTablet}
                                width={width}
                                height={height}
                            />
                        )}
                        {!generatedImage && (
                            <div className="border border-slate-500 md:w-[512px] w-[320px]
                                md:h-[512px] h-[320px] rounded-lg m-3 flex flex-col items-center justify-center">
                                <Image src="/picture.png" alt="pic_logo" width={100} height={100}/>
                            </div>
                        )}
                    </div>
                    <ButtonList
                        onClickDownload={onClickDownload}
                        onClickHelp={() => {
                        }}
                        onClickHistory={() => {
                            setShowHistory(!showHistory)
                        }}
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
                    {loading && (
                        <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
                            <div
                                className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
                                style={{zIndex: 100}}
                            >
                                <div className="p-4 w-80 bg-white text-center rounded-lg animate-in zoom-in
                                    flex flex-col items-center justify-center">
                                    <Spinner/>
                                    <p className="pt-3 opacity-50 text-center text-base mb-2">
                                        Loading ...
                                    </p>
                                    <span className="text-xs opacity-30">
                                        This can sometimes take around 3 to 5 minutes while the model boots up.
                                        After the model is loaded, it will take around 5 seconds.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
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
                                <div className="border border-t-0 border-red-400 rounded-b
                                    bg-red-100 px-4 py-4 text-red-700">
                                    {error}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
                <Footer/>
            </div>
        </DefaultLayout>
    )
}
