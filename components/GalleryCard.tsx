import Image from "next/image";
import { motion } from "framer-motion";
import React, {useState} from "react";
import {FaHeart} from "react-icons/fa";

export type ImageInfo = {
    id: string,
    url: string,
    author: string,
    width: number,
    height: number,
    likes: number,
    userLiked: boolean
}

function ImageModal({showModal, setShowModal, image}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    image: ImageInfo
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
                        rounded-lg shadow-xl bg-slate-300"
                    >
                        <img src={image.url} alt="Generated image"/>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function LikeButton({numLikes, disabled, onClick}: {
    numLikes: number,
    disabled: boolean,
    onClick: () => void
}) {
    let heartColor = disabled? "text-red-600": "text-white";
    return (
        <div className="relative left-1/2 -translate-x-1/2 m-2">
            <button
                onClick={onClick}
                className="flex items-center justify-center bg-sky-500
                px-3 py-1 rounded-lg min-w-[80px] enabled:hover:bg-sky-700 disabled:opacity-70"
                disabled={disabled}
            >
                <FaHeart className={`mr-1 ${heartColor}`}/>
                <span className="font-semibold text-base">{numLikes}</span>
            </button>
        </div>
    )
}

export default function GalleryCard({image, width, height}: {
    image: ImageInfo,
    width: number,
    height: number
}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div
            className="border border-slate-400 align-top inline-block"
            style={{"width": width, "height": height}}
        >
            <motion.div
                className="flex flex-col w-full h-full items-start justify-center bg-white/40"
                whileHover={{
                    position: 'relative',
                    zIndex: 1,
                    scale: 1.1  ,
                    transition: {
                        duration: .2
                    }
                }}
            >
                <div
                    className="hover:cursor-pointer relative w-full h-full"
                    onClick={() => setShowModal(true)}
                >
                    <Image src={image.url} alt="image" fill/>
                </div>
            </motion.div>
            <ImageModal
                showModal={showModal}
                setShowModal={(x: boolean) => setShowModal(x)}
                image={image}
            />
        </div>
    )
}
