import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import DefaultLayout from "@/layout/default";
import GalleryCardList from "@/components/GalleryCardList";

function Tabs() {
    const [openTab, setOpenTab] = useState(1);

    return (
        <div className="flex flex-wrap w-full">
            <ul
                className="grid grid-cols-2 mb-3 w-full"
                role="tablist"
            >
                <li className="last:mr-0 flex-auto text-center hover:cursor-pointer">
                    <a
                        className={
                            "text-base font-bold uppercase px-5 py-3 shadow-lg rounded-lg block " +
                            (openTab === 1
                                ? "text-white bg-gray-600/80"
                                : "text-blueGray-600 bg-slate-300/80")
                        }
                        onClick={e => {
                            e.preventDefault();
                            setOpenTab(1);
                        }}
                        data-toggle="tab"
                        role="tablist"
                    >
                        Most Liked
                    </a>
                </li>
                <li className="last:mr-0 flex-auto text-center hover:cursor-pointer">
                    <a
                        className={
                            "text-base font-bold uppercase px-5 py-3 shadow-lg rounded-lg block " +
                            (openTab === 2
                                ? "text-white bg-gray-600/80"
                                : "text-blueGray-600 bg-slate-300/80")
                        }
                        onClick={e => {
                            e.preventDefault();
                            setOpenTab(2);
                        }}
                        data-toggle="tab"
                        role="tablist"
                    >
                        Latest Shared
                    </a>
                </li>
            </ul>
            <div className="relative flex flex-col break-words w-full rounded">
                <div className="flex-auto">
                    <div className="tab-content tab-space">
                        <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                            <div className="flex flex-col items-center justify-center">
                                <GalleryCardList
                                    orderBy={"likes"}
                                    itemsPerPage={2}
                                />
                            </div>
                        </div>
                        <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                            <div className="flex flex-col items-center justify-center">
                                <GalleryCardList
                                    orderBy={"createdAt"}
                                    itemsPerPage={2}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Gallery() {
    const {data: session, status} = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/signin");
        return <div>Unauthenticated</div>
    } else if (status === "loading") {
        return <div className="flex justify-end">
            <p>Validating session ...</p>
        </div>
    }

    return (
        <DefaultLayout>
            <div className="flex flex-col lg:max-w-6xl w-full mx-auto items-center min-h-screen">
                <Header session={session} status={status}/>
                <main className="flex flex-col items-center justify-center
                text-center px-4 mt-8 sm:mb-0 mb-auto w-full">
                    <h1 className="mx-auto font-display text-4xl font-bold
                    tracking-normal text-slate-900 sm:text-5xl mb-4 drop-shadow-xl"
                        style={{fontFamily: "ABC"}}
                    >
                    <span className="animate-text bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300
                        bg-clip-text text-transparent font-black">
                        Gallery of Dota 2 Heroes
                    </span>
                    </h1>
                    <h2 className="mx-auto font-display text-2xl font-semibold
                        tracking-normal text-slate-400 mb-6 drop-shadow-xl"
                        style={{fontFamily: "ABC"}}
                    >
                        <span>
                            View beautiful pictures shared by other amazing users
                        </span>
                    </h2>
                    <Tabs/>
                </main>
                <Footer/>
            </div>
        </DefaultLayout>
    );
}
