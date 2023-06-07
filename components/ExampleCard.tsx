import React, {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";

let examples = [
    "test_29.png", "test_42.png", "test_50.png", "test_58.png", "test_66.png", "test_74.png", "test_82.png",
    "test_32.png", "test_43.png", "test_51.png", "test_59.png", "test_67.png", "test_75.png", "test_83.png",
    "test_34.png", "test_44.png", "test_52.png", "test_60.png", "test_68.png", "test_76.png", "test_84.png",
    "test_35.png", "test_45.png", "test_53.png", "test_61.png", "test_69.png", "test_77.png", "test_85.png",
    "test_37.png", "test_46.png", "test_54.png", "test_62.png", "test_70.png", "test_78.png", "test_86.png",
    "test_38.png", "test_47.png", "test_55.png", "test_63.png", "test_71.png", "test_79.png", "test_87.png",
    "test_39.png", "test_48.png", "test_56.png", "test_64.png", "test_72.png", "test_80.png", "test_88.png",
    "test_41.png", "test_49.png", "test_57.png", "test_65.png", "test_73.png", "test_81.png", "test_89.png"
]

function shuffle(items: string[]) {
    for (let i = items.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = items[i];
        items[i] = items[j];
        items[j] = x;
    }
    return items;
}

function Content({imageUrl, isSmall, onClick}: {
    imageUrl: string,
    isSmall: boolean,
    onClick: () => void
}) {
    let frameStyle: string;
    let contentStyle: string;
    if (isSmall) {
        frameStyle = "lg:w-[256px] w-[160px] ";
        contentStyle = "lg:w-[256px] lg:h-[384px] w-[160px] h-[240px] ";
    } else {
        frameStyle = "lg:w-[480px] w-[320px] ";
        contentStyle = "lg:w-[480px] lg:h-[720px] w-[320px] h-[480px] ";
    }

    return (
        <div
            className={frameStyle + "flex flex-col w-full items-center justify-center"}
            onClick={onClick}
        >
            <div
                className={contentStyle + "relative rounded-lg overflow-hidden"}>
                <Image src={imageUrl} alt="imagebox" fill/>
            </div>
        </div>
    )
}

function ImageModal({showModal, setShowModal, imageUrl}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    imageUrl: string
}) {
    return (
        <div>
            {showModal ? (
                <div
                    className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="fixed z-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl"
                    >
                        <Content
                            imageUrl={imageUrl}
                            isSmall={false}
                            onClick={() => null}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function Card(url: string) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <motion.div
                className="flex flex-col items-center justify-center
                        lg:w-[256px] w-[160px] lg:h-[384px] h-[240px]
                        rounded-lg bg-slate-300 overflow-hidden relative"
                whileHover={{
                    position: 'relative',
                    zIndex: 1,
                    scale: 1.1,
                    transition: {
                        duration: .2
                    }
                }}
            >
                <div className="hover:cursor-pointer">
                    <Content
                        imageUrl={url}
                        isSmall={true}
                        onClick={() => setShowModal(true)}
                    />
                </div>
            </motion.div>
            <ImageModal
                showModal={showModal}
                setShowModal={(x: boolean) => setShowModal(x)}
                imageUrl={url}
            />
        </div>
    )
}

export function GalleryExample() {
    useEffect(() => {
        shuffle(examples);
    }, [])

    let cards = examples.map(img => Card("/images/" + img));
    return (
        <div className="rounded-lg shadow-lg m-1 bg-white/25 mb-4 p-3">
            <div
                className="grid md:grid-cols-4 grid-cols-2"
                style={{gridGap: "10px"}}
            >
                {cards}
            </div>
        </div>
    )
}
