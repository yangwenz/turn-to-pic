import Image from "next/image";
import {motion} from "framer-motion";
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

function LikeButton({numLikes, disabled, onClick}: {
    numLikes: number,
    disabled: boolean,
    onClick: () => void
}) {
    let heartColor = disabled ? "text-red-600" : "text-white";
    let style = !disabled ? "bg-white/60 hover:bg-white/90" : "bg-white/60";
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

    let url = image.dataUrl;
    if (url.startsWith("https://upcdn.io"))
        url = url.replace("/raw/", "/image/") + "?w=480&h=480&fit=max";

    async function onClickLike() {
        if (!disabled) {
            setNumLikes(numLikes + 1);
            setDisabled(true);
            try {
                const res = await fetch("/api/gallery/rate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        imageId: image.id
                    }),
                });
                if (res.status !== 200) {
                    throw new Error("Rating failed");
                }
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
                    scale: 1.1,
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
                        src={url}
                        alt="image"
                        fill
                        sizes="(max-width: 320px) 100vw"
                        unoptimized={true}
                        priority={true}
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
            {showModal && (
                <ImageInfoCard
                    record={image}
                    setShowInfo={setShowModal}
                />
            )}
        </div>
    )
}
