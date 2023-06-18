import Image from "next/image";
import { motion } from "framer-motion";
import React, {useState} from "react";
import {FaHeart} from "react-icons/fa";
import ImageInfoCard from "@/components/ImageInfoCard";

export type GalleryImageInfo = {
    id: string;
    dataUrl: string;

    width: number;
    height: number;
    hero: string;
    style: string;
    prompt: string;
    negativePrompt: string;

    likes: number;
    userLiked: boolean;
}

function ImageModal({showModal, setShowModal, image}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    image: GalleryImageInfo
}) {
    return (
        <div>
            {showModal ? (
                <ImageInfoCard record={image} setShowInfo={setShowModal}/>
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
    let style = !disabled? "bg-white/60 hover:bg-white/90": "bg-white/60";
    return (
        <button
            onClick={onClick}
            className={`z-40 flex items-center justify-center bg-white 
                rounded px-4 py-2 mb-1 h-[30px] w-auto ${style}`}
        >
            <FaHeart className={`mr-1 ${heartColor}`}/>
            <span className="font-semibold text-base">{numLikes}</span>
        </button>
    )
}

export default function GalleryCard({image, width, height}: {
    image: GalleryImageInfo,
    width: number,
    height: number
}) {
    const [numLikes, setNumLikes] = useState(image.likes);
    const [disabled, setDisabled] = useState(image.userLiked);
    const [showModal, setShowModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    async function onClickLike() {
        if (!disabled) {
            setNumLikes(numLikes + 1);
            setDisabled(true);
            try {

            } catch (error) {
                setNumLikes(numLikes);
                setDisabled(false);
            }
        }
    }

    return (
        <div
            className="border border-slate-400 align-top inline-block"
            style={{"width": width, "height": height}}
        >
            <motion.div
                className="flex flex-col w-full h-full items-center justify-center bg-white/40"
                whileHover={{
                    position: 'relative',
                    zIndex: 1,
                    scale: 1.1  ,
                    transition: {
                        duration: .2
                    }
                }}
                onMouseOver={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
            >
                <div
                    className="hover:cursor-pointer relative w-full h-full"
                    onClick={() => setShowModal(true)}
                >
                    <Image
                        src={image.dataUrl}
                        alt="image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw,
                        (max-width: 1200px) 33vw, 25vw"
                        unoptimized={true}
                    />
                </div>
                {isHovering && (
                    <div className="absolute top-full -translate-y-full flex flex-row">
                        <LikeButton
                            numLikes={numLikes}
                            disabled={disabled}
                            onClick={onClickLike}
                        />
                    </div>
                )}
            </motion.div>
            <ImageModal
                showModal={showModal}
                setShowModal={setShowModal}
                image={image}
            />
        </div>
    )
}
