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
import {useHistory, UserHistoryRecord} from "@/hooks/useHistory";
import {ErrorInfoModal, LoadingInfoModal} from "@/components/InfoModal";
import {ImageIcon} from "@/components/Icons";
import HelpModal from "@/components/HelpModal";


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
    const [showHelpModal, setShowHelpModal] = useState(false);
    // App states
    const [generatedImage, setGeneratedImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {history, addRecord, updateRecord, deleteRecord} = useHistory();

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

    const addHistoryRecord = (
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
        });
    }

    const loadHistoryRecord = (r: UserHistoryRecord) => {
        setHero(r.hero);
        setHeroWeight(r.heroWeight);
        setStyle(r.style);
        setStyleWeight(r.styleWeight);
        setPrompt(r.prompt);
        setNegativePrompt(r.negativePrompt);
        setWidth(r.width);
        setHeight(r.height);
        setNumSteps(r.numInferenceSteps);
        setGuidanceScale(r.guidanceScale);
        setSeed(r.seed);
        if (r.dataUrl) {
            setGeneratedImage(r.dataUrl);
        }
    }

    const refreshRecord = async (r: UserHistoryRecord) => {
        const settings = loadSettings();
        if (!settings.apikey) {
            setError("Please set your Replicate API Key")
        }
        await fetchTaskInfo(settings.apikey!, r.id, r.endpointUrl, updateRecord);
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
                addHistoryRecord(requestId, endpointUrl, response.cancelUrl, "starting");
            }
        } catch (error) {
            setError("Failed to generate image");
        }

        // Check the generated image
        if (endpointUrl !== "") {
            const body = {
                endpointUrl: endpointUrl,
                token: settings.apikey!,
                numTrials: 15
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
                    text-center px-4 mt-8 mb-auto w-full">
                    <h1 className="mx-auto font-display text-4xl font-bold
                        tracking-normal text-slate-900 sm:text-5xl mb-5 drop-shadow-xl">
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
                        prompt={prompt}
                        setPrompt={(x: string) => setPrompt(x)}
                        onClickGenerate={onClickGenerate}
                    />
                    <div className="flex w-full flex-col items-center text-center mt-4">
                        {generatedImage && (
                            <ImageCard
                                url={generatedImage}
                                isTablet={isTablet}
                                width={width}
                                height={height}
                            />
                        )}
                        {!generatedImage && (
                            <div
                                className="border border-slate-500 md:w-[512px] w-[320px]
                                md:h-[512px] h-[320px] rounded-lg m-3 flex flex-col items-center justify-center"
                                title="The generated hero image will be shown here"
                            >
                                <ImageIcon/>
                                <div className="p-4 font-medium text-gray-900">
                                    Each run of the same prompt will generate a different image.
                                    You can choose the best image from multiple runs.
                                </div>
                            </div>
                        )}
                        {loading && (
                            <LoadingInfoModal
                                content="Loading ..."
                                otherInfo="This can sometimes take around 3 to 5 minutes while the model boots up.
                                    After the model is loaded, it will take much less time."
                            />
                        )}
                        {error && (
                            <ErrorInfoModal
                                error={error}
                                onClickError={onClickError}
                            />
                        )}
                    </div>
                    <ButtonList
                        onClickDownload={onClickDownload}
                        onClickHelp={() => setShowHelpModal(true)}
                        onClickHistory={() => setShowHistory(!showHistory)}
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
                    <HelpModal
                        showModal={showHelpModal}
                        setShowModal={setShowHelpModal}
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
                historyRecords={history}
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                loadHistoryRecord={loadHistoryRecord}
                deleteRecord={deleteRecord}
                refreshRecord={refreshRecord}
            />
        </DefaultLayout>
    )
}

async function fetchTaskInfo(
    token: string,
    id: string,
    endpointUrl: string,
    updateRecord: any
) {
    const body = {
        endpointUrl: endpointUrl,
        token: token,
        numTrials: 1
    }
    const res = await fetch("/api/access", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (res.status === 501) {
        await updateRecord(id, "failed");
    } else if (res.status === 502) {
        await updateRecord(id, "image unavailable");
    } else if (res.status === 200) {
        let response = (await res.json()) as AccessResponse;
        await updateRecord(id, "succeeded", response.generated);
    }
}
