import React, {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";

const examples = [
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
    let array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

function Content({imageUrl, isSmall, onClick}: {
    imageUrl: string,
    isSmall: boolean,
    onClick: () => void
}) {
    let frameStyle: string;
    let contentStyle: string;
    if (isSmall) {
        frameStyle = "lg:w-[216px] w-[120px] ";
        contentStyle = "lg:w-[216px] lg:h-[324px] w-[120px] h-[180px] ";
    } else {
        frameStyle = "lg:w-[480px] w-[240px] ";
        contentStyle = "lg:w-[480px] lg:h-[720px] w-[240px] h-[360px] ";
    }

    return (
        <div
            className={frameStyle + "flex flex-col w-full items-center justify-center"}
            onClick={onClick}
        >
            <div
                className={contentStyle + "relative rounded-lg overflow-hidden"}>
                <Image
                    src={imageUrl}
                    alt="imagebox"
                    fill
                    sizes="(max-width: 120px), (max-width: 216px)"
                    unoptimized={true}
                />
            </div>
        </div>
    )
}

function Card(url: string) {
    return (
        <div key={url}>
            <motion.div
                className="flex flex-col items-center justify-center
                        lg:w-[216px] w-[120px] lg:h-[324px] h-[180px]
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
                <Content
                    imageUrl={url}
                    isSmall={true}
                    onClick={() => {}}
                />
            </motion.div>
        </div>
    )
}

export function GalleryExample() {
    const [images, setImages] = useState<string[]>([...examples]);

    useEffect(() => {
        setImages(shuffle(examples).slice(0, 20));
    }, [])

    return (
        <div className="rounded-lg shadow-lg m-1 bg-white/25 mb-4 p-3 max-h-screen overflow-y-scroll">
            <div
                className="grid md:grid-cols-4 grid-cols-2"
                style={{gridGap: "10px"}}
            >
                {images.map(img => Card("https://upcdn.io/12a1yBZ/raw/turn2pic/examples/small/" + img))}
            </div>
        </div>
    )
}
