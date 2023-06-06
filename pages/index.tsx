import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useSession} from "next-auth/react";


export default function Home() {
    const {data: session, status} = useSession();

    return (
        <div className="flex flex-col lg:max-w-6xl w-full mx-auto items-center min-h-screen">
            <Head>
                <title>TurnToPic</title>
            </Head>
            <Header session={session} status={status}/>
            <main className="flex w-full flex-col items-center justify-center text-center px-4 mt-8 sm:mb-0 mb-auto">
                <h1 className="mx-auto font-display text-4xl font-bold
                    tracking-normal text-slate-900 sm:text-6xl mb-5 drop-shadow-xl"
                    style={{fontFamily: "ABC"}}
                >
                    <span className="animate-text bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800
                        bg-clip-text text-transparent font-black">
                        Playing Magic with Your Pictures
                    </span>
                </h1>
                <h2 className="mx-auto font-display text-3xl font-semibold
                    tracking-normal text-slate-600 mb-8 drop-shadow-xl"
                    style={{fontFamily: "ABC"}}
                >
                    <span>
                        Generating Amazing Pictures using AI
                    </span>
                </h2>
            </main>
            <Footer/>
        </div>
    )
}
