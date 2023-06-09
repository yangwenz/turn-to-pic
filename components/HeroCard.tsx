import React, {useState} from "react";
import Image from "next/image";
import {
    heroes,
    heroAttributes,
    label2name
} from "@/configs/heroes";

function Card(label: string, url: string) {
    return (
        <div className="hover:cursor-pointer" key={url}>
            <div
                className={"flex flex-col lg:w-[96px] w-[64px] items-center justify-center"}
            >
                <div
                    className={"relative lg:w-[96px] lg:h-[54px] w-[64px] h-[36px] rounded-lg overflow-hidden"}>
                    <Image src={url} alt="imagebox" title={label2name(label)} fill/>
                </div>
            </div>
        </div>
    )
}

export default function HeroCard() {
    const [attribute, setAttribute] = useState<string>("");
    let heroList = attribute === "" ? heroes : heroAttributes.get(attribute)!;

    return (
        <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg shadow-xl px-2">
            <div className="flex flex-row items-center justify-center mt-2">
                <select
                    id="herolist"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                        focus:border-blue-500 block w-full p-2.5"
                >
                    <option selected>Choose a hero</option>
                    {heroList.map(hero => (<option value={hero} key={hero}>{label2name(hero)}</option>))}
                </select>
                <button className="w-auto ml-1">
                    <Image alt="Strength" src="/heroes/Strength_attribute_symbol.png"
                           title="Strength" width={40} height={40}/>
                </button>
                <button className="w-auto ml-1">
                    <Image alt="Agility" src="/heroes/Agility_attribute_symbol.png"
                           title="Agility" width={40} height={40}/>
                </button>
                <button className="w-auto ml-1">
                    <Image alt="Intelligence" src="/heroes/Intelligence_attribute_symbol.png"
                           title="Intelligence" width={40} height={40}/>
                </button>
                <button className="w-auto ml-1">
                    <Image alt="Universal" src="/heroes/Universal_attribute_symbol.png"
                           title="Universal" width={40} height={40}/>
                </button>
            </div>
            <div
                className="grid grid-cols-4 mt-2 mb-2 lg:h-96 h-64 overflow-y-scroll"
                style={{gridGap: "5px"}}
            >
                {heroList.map(hero => Card(hero, "/heroes/" + hero + ".jpg"))}
            </div>
        </div>
    )
}
