import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useSession} from "next-auth/react";
import {GalleryExample} from "@/components/ExampleCard";
import DefaultLayout from "@/layout/default";


export default function Home() {
    const {data: session, status} = useSession();

    return (
        <DefaultLayout>
            <div className="flex flex-col lg:max-w-6xl w-full mx-auto items-center min-h-screen">
                <Header session={session} status={status}/>
                <main className="flex w-full flex-col items-center justify-center text-center px-4 mt-8 sm:mb-0 mb-auto">
                    <h1 className="mx-auto font-display text-4xl font-bold
                        tracking-normal text-slate-900 sm:text-5xl mb-5 drop-shadow-xl"
                    >
                        <span className="animate-text bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300
                            bg-clip-text text-transparent font-black">
                            Creating Amazing Pictures of Dota 2 Heroes
                        </span>
                    </h1>
                    <h2 className="mx-auto font-display text-2xl font-semibold
                        tracking-normal text-slate-400 mb-6 drop-shadow-xl"
                    >
                        <span>
                            Transform Your Love for Dota 2 into Stunning Visual Art
                        </span>
                    </h2>
                    <div className="flex flex-row items-center justify-center">
                        <Link href={"/generate"} passHref>
                            <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                            hover:bg-gradient-to-br font-bold rounded-full text-lg px-10 py-2.5 text-center mr-2 mb-4">
                                Image Creator
                            </button>
                        </Link>
                        <Link href={"/gallery"} passHref>
                            <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                            hover:bg-gradient-to-br font-bold rounded-full text-lg px-10 py-2.5 text-center ml-2 mb-4">
                                Image Gallery
                            </button>
                        </Link>
                    </div>
                    <div className="lg:flex items-center text-center justify-center">
                        <GalleryExample/>
                    </div>
                </main>
                <Footer/>
            </div>
        </DefaultLayout>
    )
}
