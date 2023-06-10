import Image from "next/image";
import React, {useState} from "react";
import {motion} from "framer-motion";

export default function ImageCard({url, width, height}: {
    url: string,
    width: number,
    height: number
}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <motion.div
                className="border-slate-500 border m-3 relative shadow-xl
                md:w-[512px] w-[320px] md:h-[512px] h-[320px]
                rounded-lg bg-slate-300 overflow-hidden"
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
                            <img src={url} alt="generated"/>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
