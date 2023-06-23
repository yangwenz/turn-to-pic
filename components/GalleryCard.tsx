import Image from "next/image";
import {motion} from "framer-motion";
import React, {useState} from "react";
import {FaHeart} from "react-icons/fa";
import ImageInfoCard from "@/components/ImageInfoCard";
import {GetImageResponse} from "@/pages/api/gallery/image";
import {LoadingInfoModal} from "@/components/InfoModal";

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
    const isHovering = true;
    const [numLikes, setNumLikes] = useState(image.likes);
    const [disabled, setDisabled] = useState(image.userLiked);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

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
                if (res.status == 200) {
                    return;
                }
            } catch (error) {
                console.log(error);
            }
            setNumLikes(numLikes);
            setDisabled(false);
        }
    }

    async function onClickImage() {
        setLoading(true);
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 10000);

            const response = await fetch("/api/gallery/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: image.id,
                    onlyUrl: false
                }),
                signal: controller.signal
            })
            clearTimeout(id);

            if (response.status == 200) {
                let imageResponse = (await response.json()) as GetImageResponse;
                image.hero = imageResponse.hero!;
                image.style = imageResponse.style!;
                image.prompt = imageResponse.prompt!;
                image.negativePrompt = imageResponse.negativePrompt!;
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setShowModal(true);
    }

    return (
        <div
            className="align-top inline-block"
            style={{"width": width, "height": height}}
        >
            <motion.div
                className="relative flex flex-col w-full h-full items-center justify-center bg-white/40"
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
                    onClick={onClickImage}
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
            {loading && (
                <LoadingInfoModal
                    content="Loading ..."
                    otherInfo=""
                />
            )}
        </div>
    )
}
