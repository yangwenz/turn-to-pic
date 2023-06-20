import Image from "next/image";
import React, {useState} from "react";
import {motion} from "framer-motion";

function computeSize(
    isTablet: boolean,
    width: number,
    height: number
): [number, number] {
    const maxWidth = isTablet? 360: 1024;
    const maxHeight = isTablet? 360: 560;
    const a = maxWidth / width;
    const b = maxHeight / height;
    const r = a > b? b: a;
    return [Math.floor(r * width), Math.floor(r * height)]
}

export default function ImageCard({url, isTablet, width, height}: {
    url: string,
    isTablet: boolean,
    width: number,
    height: number
}) {
    const [showModal, setShowModal] = useState(false);
    const [newWidth, newHeight] = computeSize(isTablet, width, height);

    return (
        <div>
            <motion.div
                className="border-slate-500 border m-3 relative shadow-xl
                    rounded-lg bg-slate-300 overflow-hidden"
                style={{"width": newWidth, "height": newHeight}}
                whileHover={{
                    position: 'relative',
                    zIndex: 1,
                    scale: 1.1,
                    transition: {
                        duration: .2
                    }
                }}
            >
                <div
                    className="hover:cursor-pointer relative w-full h-full"
                    onClick={() => setShowModal(true)}
                >
                    <Image src={url} alt="generated image" fill unoptimized={true}/>
                </div>
            </motion.div>
            <div>
                {showModal ? (
                    <div
                        className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90
                            flex flex-col items-center justify-center"
                        onClick={() => setShowModal(false)}
                    >
                            <div className="relative md:w-3/4 md:h-3/4 w-full h-full">
                                <Image
                                    src={url}
                                    alt="Generated image"
                                    fill={true}
                                    sizes="(max-width: 768px) 100vw"
                                    style={{objectFit: "contain"}}
                                    unoptimized={true}
                                />
                            </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
