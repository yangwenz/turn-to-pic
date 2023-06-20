import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import React, {useState} from "react";
import DefaultLayout from "@/layout/default";
import GalleryCardList from "@/components/GalleryCardList";
import Image from "next/image";
import {label2name} from "@/configs/heroes";
import HeroModal from "@/components/HeroModal";

function Tabs({hero}: {hero: string}) {
    const [openTab, setOpenTab] = useState(1);
    hero = hero == ""? "all": hero;

    return (
        <div className="flex flex-wrap w-full">
            <ul
                className="grid grid-cols-2 mb-3 w-full"
                role="tablist"
            >
                <li className="last:mr-0 flex-auto text-center hover:cursor-pointer">
                    <a
                        className={
                            "text-base font-bold uppercase px-5 py-3 shadow-lg rounded-lg block border " +
                            (openTab === 1
                                ? "text-black bg-slate-300 border-slate-300"
                                : "text-gray-300 bg-transparent border-slate-500")
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
                            "text-base font-bold uppercase px-5 py-3 shadow-lg rounded-lg block border " +
                            (openTab === 2
                                ? "text-black bg-slate-300 border-slate-300"
                                : "text-gray-300 bg-transparent border-slate-500")
                        }
                        onClick={e => {
                            e.preventDefault();
                            setOpenTab(2);
                        }}
                        data-toggle="tab"
                        role="tablist"
                    >
                        Shared Recently
                    </a>
                </li>
            </ul>
            <div className="relative flex flex-col break-words w-full rounded">
                <div className="flex-auto">
                    <div className="tab-content tab-space">
                        <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                            <div className="flex flex-col items-center justify-center">
                                <GalleryCardList
                                    type="popular"
                                    hero={hero}
                                    itemsPerPage={8}
                                />
                            </div>
                        </div>
                        <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                            <div className="flex flex-col items-center justify-center">
                                <GalleryCardList
                                    type="recent"
                                    hero={hero}
                                    itemsPerPage={8}
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
    const [hero, setHero] = useState<string>("");
    const [showHeroModal, setShowHeroModal] = useState(false);
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/signin");
        return <div>Unauthenticated</div>
    } else if (status === "loading") {
        return <div className="flex justify-end">
            <p>Validating session ...</p>
        </div>
    }

    let heroUrl = hero != "" ?
        "https://upcdn.io/12a1yBZ/raw/turn2pic/heroes/" + hero + ".jpg" :
        "https://upcdn.io/12a1yBZ/raw/turn2pic/heroes/question_mark.png";

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
                            Gallery of Amazing Hero Images
                        </span>
                    </h1>
                    <div className="flex flex-row mb-5">
                        <button
                            className="w-auto h-[36px] px-3 mr-0.5 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-slate-300 hover:text-black font-bold"
                            onClick={() => setShowHeroModal(true)}
                            title="Choose a hero"
                        >
                            Hero
                        </button>
                        <div className={"flex flex-col w-[64px] items-center justify-center ml-0.5"}>
                            <div className={"relative w-[64px] h-[36px] rounded-lg overflow-hidden bg-gray-900"}>
                                <Image
                                    src={heroUrl}
                                    alt="imagebox"
                                    title={label2name(hero)}
                                    fill
                                    sizes="(max-width: 96px), (max-width: 64px)"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    </div>
                    <Tabs
                        hero={hero}
                    />
                    <HeroModal
                        showModal={showHeroModal}
                        setShowModal={setShowHeroModal}
                        hero={hero}
                        setHero={(x: string) => setHero(x)}
                        weight={-100}
                        setWeight={() => {}}
                    />
                </main>
                <Footer/>
            </div>
        </DefaultLayout>
    );
}
