import React, {useState} from "react";
import {getStyles, label2name} from "@/configs/heroes";
import Image from "next/image";

function StyleCard({style, setStyle, setShowModal}: {
    style: string,
    setStyle: (x: string) => void,
    setShowModal: (x: boolean) => void
}) {
    const styles = getStyles();
    const [selectedStyle, setSelectedStyle] = useState<string>(style);
    let imgUrl = selectedStyle != "None"? "/styles/" + selectedStyle + ".png": "/styles/none.png";

    return (
        <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
            flex flex-col items-center justify-center bg-gray-900 rounded-lg shadow-xl px-2 min-w-[300px]"
        >
            <div className="text-gray-300 font-semibold text-lg mt-2">
                Choose a Style
            </div>
            <div className="w-full flex justify-center mt-2">
                <select
                    id="stylelist"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                        focus:border-blue-500 block w-4/5 p-2.5 min-w-40"
                    value={selectedStyle}
                    onChange={(event) => setSelectedStyle(event.target.value)}
                >
                    {styles.map(style => (<option value={style} key={style}>{style}</option>))}
                </select>
            </div>
            <div
                className={"flex flex-col md:w-[320px] w-[240px] items-center justify-center mt-2"}
            >
                <div
                    className={"relative md:w-[320px] md:h-[480px] w-[240px] h-[360px] rounded-lg overflow-hidden"}
                >
                    <Image
                        src={imgUrl}
                        alt="imagebox"
                        title={selectedStyle}
                        fill
                        sizes="(max-width: 240px), (max-width: 320px)"
                    />
                </div>
            </div>
            <div className="w-full flex justify-center mt-2">
                <button
                    className="w-auto h-10 px-10 ml-1 mb-2 text-gray-300 lg:text-base text-xs bg-transparent
                        border-slate-500 rounded-lg border-2 hover:bg-gray-300 hover:text-black font-bold"
                    onClick={() => {
                        setStyle(selectedStyle);
                        setShowModal(false);
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    )
}

export default function StyleModal({showModal, setShowModal, style, setStyle}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    style: string,
    setStyle: (x: string) => void
}) {
    return (
        <div>
            {showModal ? (
                <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <StyleCard style={style} setStyle={setStyle} setShowModal={setShowModal}/>
                </div>
            ) : null}
        </div>
    );
}
