import React, {useState} from "react";

function StyleCard({style, setStyle, setShowModal}: {
    style: string,
    setStyle: (x: string) => void,
    setShowModal: (x: boolean) => void
}) {
    const [selectedStyle, setSelectedStyle] = useState<string>(style);

    return (
        <div className="fixed z-200 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
            flex flex-col items-center justify-center bg-gray-900 rounded-lg shadow-xl px-2 min-w-[300px]"
        >
            <div className="w-full flex justify-center">
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
