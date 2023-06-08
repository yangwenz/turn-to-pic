import Head from "next/head";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Drawer from "@/components/Drawer";
import {useState} from "react";
import {
    defaultGuidanceScale,
    defaultNegativePrompt,
    defaultNumInferenceSteps,
    defaultRandomSeed
} from "@/configs/default";

export default function Generate() {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [negativePrompt, setNegativePrompt] = useState<string>(defaultNegativePrompt);
    const [numSteps, setNumSteps] = useState<number>(defaultNumInferenceSteps);
    const [guidanceScale, setGuidanceScale] = useState<number>(defaultGuidanceScale);
    const [seed, setSeed] = useState<number | string>(defaultRandomSeed);

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
        <div className="flex flex-row">
            <Head>
                <title>Turn2Pic</title>
            </Head>
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
                </main>
                <Footer/>
            </div>
        </div>
    )
}
