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
                    className="hover:cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    <Image src={url} alt="generated" fill/>
                </div>
            </motion.div>
            <div>
                {showModal ? (
                    <div
                        className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="fixed z-100 top-1/2 left-1/2 -translate-y-1/2
                            -translate-x-1/2 rounded-lg shadow-xl">
                            <img src={url} alt="Generated image"/>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
