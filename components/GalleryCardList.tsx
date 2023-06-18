import React, {useEffect, useState} from "react";
import GalleryCard, {GalleryImageInfo} from "@/components/GalleryCard";
import {RecommendItem} from "@/pages/api/gallery/recommend";

function resizeImage(
    isTablet: boolean,
    width: number,
    height: number
): [number, number] {
    const maxWidth: number = isTablet? 256: 320;
    const r = maxWidth / width;
    return [Math.floor(r * width), Math.floor(r * height)]
}

function newImageInfo(r: RecommendItem) {
    return {
        id: r.id,
        dataUrl: r.url,
        width: r.width,
        height: r.height,
        hero: "",
        style: "",
        prompt: "",
        negativePrompt: "",
        likes: 0,
        userLiked: false
    }
}

async function getImages(type: string, hero: string, skip: number, take: number) {
    const res = await fetch("/api/gallery/recommend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: type,
            hero: hero,
            skip: skip,
            take: take
        })
    });
    if (res.status == 200) {
        const items = (await res.json()) as RecommendItem[];
        return items.map(r => newImageInfo(r));
    }
    else
        return  [];
}

/*
// For testing purpose
async function getRecentImages(skip: number, take: number) {
    let images: GalleryImageInfo[] = []

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    for (let i = skip; i < skip + take; i++) {
        images.push({
            id: String(i),
            dataUrl: `https://robohash.org/${i}?200x200`,
            width: getRandomInt(256, 512),
            height: getRandomInt(256, 512),
            hero: "robot",
            style: "Default",
            prompt: "prompt",
            negativePrompt: "negative prompt",
            likes: i,
            userLiked: i % 2 === 0
        })
    }
    return {images: images, counts: 100};
}
*/

export default function GalleryCardList({type, hero, itemsPerPage}: {
    type: string,
    hero: string,
    itemsPerPage: number
}) {
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [numColumns, setNumColumns] = useState(4);
    const [images, setImages] = useState<GalleryImageInfo[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsTablet(window.innerWidth < 768);
            if (window.innerWidth >= 1024) {
                setNumColumns(Math.min(4, Math.floor(window.innerWidth / 320)));
            } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
                setNumColumns(2);
            }
            else {
                setNumColumns(1);
            }
        };
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);

        const fetchData = async () => {
            const items = await getImages(type, hero, 0, itemsPerPage);
            setImages([...items]);
        }
        fetchData().catch(console.error);

        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, [itemsPerPage, type, hero]);

    async function fetchData(page: number) {
        if (page < 25) {
            const skip = page * itemsPerPage;
            const items = await getImages(type, hero, skip, itemsPerPage);
            setImages([...images, ...items]);
            setPage(page);
        }
    }

    function imageColumn(images: GalleryImageInfo[], key: number) {
        return (
            <div className="flex flex-col" key={key}>
                {images.map(image => {
                    const [w, h] = resizeImage(isTablet, image.width, image.height);
                    return (
                        <div key={image.id}>
                            <GalleryCard image={image} width={w} height={h}/>
                        </div>
                    )
                })}
            </div>
        )
    }

    let grid = buildImageGrid(isTablet, images, numColumns);
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row">
                {grid.map((images, i) => imageColumn(images, i))}
            </div>
            <button
                className="h-10 px-3 ml-1 text-gray-300 lg:text-base text-lg bg-transparent border-slate-500
                    w-1/2 rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold mt-6"
                onClick={async () => {
                    await fetchData(page + 1);
                }}>
                Load More
            </button>
        </div>
    )
}

function buildImageGrid(
    isTablet: boolean,
    images: GalleryImageInfo[],
    numColumns: number
) {
    if (numColumns <= 1)
        return [images];

    let heights: number[] = Array(numColumns);
    for (let i = 0; i < numColumns; i++)
        heights[i] = 0;

    let colIndices: number[] = Array(images.length);
    for (let i = 0; i < images.length; i++) {
        const k = heights.indexOf(Math.min(...heights));
        colIndices[i] = k;
        const [_, h] = resizeImage(isTablet, images[i].width, images[i].height);
        heights[k] += h;
    }

    let grid: GalleryImageInfo[][] = [];
    for (let i = 0; i < numColumns; i++)
        grid.push([]);
    for (let i = 0; i < images.length; i++) {
        grid[colIndices[i]].push({...images[i]});
    }
    return grid;
}
