import Image from "next/image";
import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import {FaHeart} from "react-icons/fa";

export type ImageInfo = {
    id: string,
    imageUrl: string,
    author: string,
    likes: number,
    userLiked: boolean
}

function Content({imageUrl, author, isSmall, onClick}: {
    imageUrl: string,
    author: string,
    isSmall: boolean,
    onClick: () => void
}) {
    let frameStyle: string;
    let contentStyle: string;
    if (isSmall) {
        frameStyle = "lg:w-[256px] w-[160px] ";
        contentStyle = "lg:w-[256px] lg:h-[256px] w-[160px] h-[160px] ";
    } else {
        frameStyle = "lg:w-[512px] w-[320px] ";
        contentStyle = "lg:w-[512px] lg:h-[512px] w-[320px] h-[320px] ";
    }

    return (
        <div
            className={frameStyle + "flex flex-col w-full items-center justify-center"}
            onClick={onClick}
        >
            <div
                className={contentStyle + "relative rounded-lg bg-slate-300 overflow-hidden"}>
                <Image
                    src={imageUrl}
                    alt="imagebox"
                    fill
                />
            </div>
            <div>
                <h2 className="text-slate-900 drop-shadow-xl mb-1">
                    Shared by <span className="font-bold">{author}</span>
                </h2>
            </div>
        </div>
    )
}

function ImageModal({showModal, setShowModal, imageUrl, author}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    imageUrl: string,
    author:string
}) {
    const buttonStyle =
        "h-10 px-8 m-2 text-white transition-colors duration-150 " +
        "bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg focus:ring-4 hover:bg-gradient-to-bl";

    return (
        <div>
            {showModal ? (
                <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <div
                        className="fixed z-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl bg-slate-300"
                    >
                        <Content
                            imageUrl={imageUrl}
                            author={author}
                            isSmall={false}
                            onClick={() => null}
                        />
                        <button
                            className={buttonStyle}
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
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

export default function GalleryCard({image}: {
    image: ImageInfo
}) {
    const [showModal, setShowModal] = useState(false);
    const [numLikes, setNumLikes] = useState(image.likes);
    const [disabled, setDisabled] = useState(image.userLiked);
    const frameStyle = "lg:w-[256px] w-[160px] ";

    useEffect(() => {
        setNumLikes(image.likes);
        setDisabled(image.userLiked);
    }, [image])

    async function onClickLike() {
        setNumLikes(numLikes + 1);
        setDisabled(true);
        /*
        try {
            const res = await fetch("/api/gallery/rate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    photoId: image.id
                }),
            });
            if (res.status !== 200) {
                throw new Error("Failed to rate the image");
            }
        } catch (error) {
            setNumLikes(numLikes);
            setDisabled(false);
        }
        */
    }

    return (
        <div>
            <motion.div
                className={frameStyle + "flex flex-col w-full items-start justify-center " +
                    "bg-white/40 rounded-lg shadow-xl"}
                whileHover={{
                    position: 'relative',
                    zIndex: 1,
                    scale: 1.1  ,
                    transition: {
                        duration: .2
                    }
                }}
            >
                <div className="hover:cursor-pointer">
                    <Content
                        imageUrl={image.imageUrl}
                        author={image.author}
                        isSmall={true}
                        onClick={() => setShowModal(true)}
                    />
                </div>
                <LikeButton
                    numLikes={numLikes}
                    disabled={disabled}
                    onClick={() => onClickLike()}
                />
            </motion.div>
            <ImageModal
                showModal={showModal}
                setShowModal={(x: boolean) => setShowModal(x)}
                imageUrl={image.imageUrl}
                author={image.author}
            />
        </div>
    )
}
