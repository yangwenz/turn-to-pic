import React, {useEffect, useState} from "react";
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
import {useHistory, UserHistoryRecord} from "@/hooks/useHistory";


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
    const {history, addRecord, updateRecord} = useHistory();

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

    const addToHistory = (
        id: string,
        endpointUrl: string,
        cancelUrl: string,
        status: string
    ) => {
        addRecord({
            id: id,
            createdAt: Date().toLocaleString(),
            createdTimestamp: Date.now(),
            endpointUrl: endpointUrl,
            cancelUrl: cancelUrl,
            status: status,
            hero: hero,
            heroWeight: heroWeight,
            style: style,
            styleWeight: styleWeight,
            prompt: prompt,
            negativePrompt: negativePrompt,
            width: width,
            height: height,
            numInferenceSteps: numSteps,
            guidanceScale: guidanceScale,
            seed: seed
        })
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

        let requestId: string = "";
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
                requestId = response.id;
                endpointUrl = response.endpointUrl;
                addToHistory(requestId, endpointUrl, response.cancelUrl, "starting");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to generate image");
        }

        // Check the generated image
        if (endpointUrl !== "") {
            const body = {
                endpointUrl: endpointUrl,
                token: settings.apikey!,
                numTrials: 30
            }
            const res = await fetch("/api/access", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (res.status === 501) {
                // Failed
                await updateRecord(requestId, "failed");
            } else if (res.status === 502) {
                // Image was deleted
                await updateRecord(requestId, "image unavailable");
            } else if (res.status === 503) {
                // Other errors
                await updateRecord(requestId, "unknown");
            } else if (res.status !== 200) {
                // Running
                setError(await res.json());
            } else {
                // Success
                let response = (await res.json()) as AccessResponse;
                setGeneratedImage(response.generated);
                await updateRecord(requestId, "succeeded", response.generated);
            }
        }
        setLoading(false);
    }

    return (
        <DefaultLayout>
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
                                <ImageIcon/>
                            </div>
                        )}
                        {loading && (
                            <LoadingWindow/>
                        )}
                        {error && (
                            <ErrorWindow
                                error={error}
                                onClickError={onClickError}
                            />
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
                </main>
                <Footer/>
            </div>
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
                historyRecords={history}
            />
        </DefaultLayout>
    )
}

function LoadingWindow() {
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
                        Loading ...
                    </p>
                    <span className="text-xs opacity-30">
                        This can sometimes take around 3 to 5 minutes while the model boots up.
                        After the model is loaded, it will take much less time.
                    </span>
                </div>
            </div>
        </div>
    );
}

function ErrorWindow({error, onClickError}: {
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

function ImageIcon() {
    return (
        <svg
            fill="rgb(17 24 39)"
            width="100px"
            height="100px"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>image</title>
            <path
                d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0
                4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256
                1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0
                1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832
                0-1.44-0.576t-0.576-1.408zM6.016 24q0 0.832 0.576 1.44t1.408 0.576h16q0.832
                0 1.408-0.576t0.608-1.44v-0.928q-0.224-0.448-1.12-2.688t-1.6-3.584-1.28-2.112q-0.544-0.576-1.12-0.608t-1.152
                0.384-1.152 1.12-1.184 1.568-1.152 1.696-1.152 1.6-1.088 1.184-1.088 0.448q-0.576
                0-1.664-1.44-0.16-0.192-0.48-0.608-1.12-1.504-1.6-1.824-0.768-0.512-1.184
                0.352-0.224 0.512-0.928 2.24t-1.056 2.56v0.64zM6.016 9.024q0 1.248 0.864
                2.112t2.112 0.864 2.144-0.864 0.864-2.112-0.864-2.144-2.144-0.864-2.112
                0.864-0.864 2.144z">
            </path>
        </svg>
    );
}
