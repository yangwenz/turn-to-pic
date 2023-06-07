import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function GalleryExample() {

    function Card(url: string) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center
                    lg:w-[256px] w-[160px] lg:h-[256px] h-[160px]
                    rounded-lg bg-slate-300 overflow-hidden relative"
                whileHover={{
                    position: 'relative',
                    zIndex: 1,
                    scale: 1.1  ,
                    transition: {
                        duration: .2
                    }
                }}
            >
                <Image src={url} alt="imagebox" fill/>
            </motion.div>
        )
    }

    return (
        <div className="rounded-lg shadow-lg m-1 bg-white/25 mb-4 p-3">
            <div
                className="grid md:grid-cols-4 grid-cols-2"
                style={{gridGap: "10px"}}
            >
                {Card("/example_1.webp")}
                {Card("/example_2.webp")}
                {Card("/example_3.webp")}
                {Card("/example_4.webp")}
            </div>
            <Link href={"/gallery"} passHref>
                <button className="bg-gradient-to-br from-purple-500/80 to-blue-500/80
                    text-white rounded-lg text-small p-2 px-16 flex-none
                    hover:bg-gradient-to-bl focus:ring-4 mt-3">
                    Go to Gallery
                </button>
            </Link>
        </div>
    )
}
