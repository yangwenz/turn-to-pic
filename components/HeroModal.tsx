import React, {useState} from "react";
import Image from "next/image";
import {getHeroes, label2name} from "@/configs/heroes";
import clsx from "clsx";

function Card(label: string, url: string, setHero: (x: string) => void) {
    return (
        <div className="hover:cursor-pointer" key={url}>
            <div
                className={"flex flex-col md:w-[96px] w-[64px] items-center justify-center"}
            >
                <div
                    className={"relative md:w-[96px] md:h-[54px] w-[64px] h-[36px] rounded-lg overflow-hidden"}
                    onClick={() => {
                        setHero(label)
                    }}
                >
                    <Image
                        src={url}
                        alt="imagebox"
                        title={label2name(label)}
                        fill
                        sizes="(max-width: 96px), (max-width: 64px)"
                    />
                </div>
            </div>
        </div>
    )
}

function HeroCard({hero, setHero, setShowModal}: {
    hero: string,
    setHero: (x: string) => void,
    setShowModal: (x: boolean) => void
}) {
    const [heroes, heroAttributes] = getHeroes();
    const [selectedHero, setSelectedHero] = useState<string>(hero);
    const [attribute, setAttribute] = useState<string>("");
    let heroList = attribute === "" ? heroes : heroAttributes.get(attribute)!;

    const clickAttribute = (attr: string) => {
        attribute === attr ? setAttribute("") : setAttribute(attr);
    }

    return (
        <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
            flex flex-col items-center justify-center bg-gray-900 rounded-lg shadow-xl px-2 min-w-[300px]"
        >
            <div className="text-gray-300 font-semibold text-lg mt-2">
                Choose a Hero
            </div>
            <div className="flex flex-row items-center justify-center mt-2 w-full">
                <select
                    id="herolist"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                        focus:border-blue-500 block w-1/2 p-2.5 min-w-40"
                    value={selectedHero}
                    onChange={(event) => setSelectedHero(event.target.value)}
                >
                    <option>{""}</option>
                    {heroList.map(hero => (<option value={hero} key={hero}>{label2name(hero)}</option>))}
                </select>
                <button
                    className={clsx(attribute === "strength" ? "bg-gray-500" : "", "w-auto ml-1 rounded")}
                    onClick={() => {
                        clickAttribute("strength")
                    }}
                >
                    <Image alt="Strength" src="/heroes/Strength_attribute_symbol.png"
                           title="Strength" width={40} height={40}/>
                </button>
                <button
                    className={clsx(attribute === "agility" ? "bg-gray-500" : "", "w-auto ml-1 rounded")}
                    onClick={() => {
                        clickAttribute("agility")
                    }}
                >
                    <Image alt="Agility" src="/heroes/Agility_attribute_symbol.png"
                           title="Agility" width={40} height={40}/>
                </button>
                <button
                    className={clsx(attribute === "intelligence" ? "bg-gray-500" : "", "w-auto ml-1 rounded")}
                    onClick={() => {
                        clickAttribute("intelligence")
                    }}
                >
                    <Image alt="Intelligence" src="/heroes/Intelligence_attribute_symbol.png"
                           title="Intelligence" width={40} height={40}/>
                </button>
                <button
                    className={clsx(attribute === "universal" ? "bg-gray-500" : "", "w-auto ml-1 rounded")}
                    onClick={() => {
                        clickAttribute("universal")
                    }}
                >
                    <Image alt="Universal" src="/heroes/Universal_attribute_symbol.png"
                           title="Universal" width={40} height={40}/>
                </button>
            </div>
            <div
                className="grid grid-cols-4 mt-2 mb-2 lg:h-96 h-64 overflow-y-scroll"
                style={{gridGap: "5px"}}
            >
                {heroList.map(hero => Card(hero, "/heroes/" + hero + ".jpg", setSelectedHero))}
            </div>
            <div className="w-full flex justify-center">
                <button
                    className="w-auto h-10 px-10 ml-1 mb-2 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-gray-300 hover:text-black font-bold"
                    onClick={() => {
                        setHero(selectedHero);
                        setShowModal(false);
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    )
}

export default function HeroModal({showModal, setShowModal, hero, setHero}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    hero: string,
    setHero: (x: string) => void
}) {
    return (
        <div>
            {showModal ? (
                <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <HeroCard hero={hero} setHero={setHero} setShowModal={setShowModal}/>
                </div>
            ) : null}
        </div>
    );
}