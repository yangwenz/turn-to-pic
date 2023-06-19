import React, {useEffect, useState} from "react";
import GalleryCard, {GalleryImageInfo} from "@/components/GalleryCard";
import {RecommendItem} from "@/pages/api/gallery/recommend";
import {LoadingInfoModal} from "@/components/InfoModal";

function resizeImage(
    isTablet: boolean,
    width: number,
    height: number
): [number, number] {
    const maxWidth: number = isTablet? 256: 320;
    const r = maxWidth / width;
    return [Math.floor(r * width), Math.floor(r * height)]
}

function expandImageInfo(items: RecommendItem[]) {
    return items.map(r => {
        return {
            id: r.id,
            dataUrl: r.url,
            width: r.width,
            height: r.height,
            hero: "",
            style: "",
            prompt: "",
            negativePrompt: "",
            likes: r.likes? r.likes: 0,
            userLiked: r.userLiked? r.userLiked: false
        }
    })
}

async function getImages(type: string, hero: string, skip: number, take: number) {
    try {
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
            return expandImageInfo((await res.json()) as RecommendItem[]);
        } else if (res.status == 501) {
            return null;
        } else {
            return [];
        }
    } catch (e) {
        console.log(e);
        return [];
    }
}

export default function GalleryCardList({type, hero, itemsPerPage}: {
    type: string,
    hero: string,
    itemsPerPage: number
}) {
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [numColumns, setNumColumns] = useState(4);
    const [images, setImages] = useState<GalleryImageInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [noMoreImages, setNoMoreImages] = useState<boolean>(false);

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
            setLoading(true);
            const items = await getImages(type, hero, 0, itemsPerPage);
            if (items === null) {
                setNoMoreImages(true);
            } else {
                setImages([...items]);
            }
            setLoading(false);
        }
        fetchData().catch(console.error);

        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, [itemsPerPage, type, hero]);

    async function fetchData() {
        if (images.length < 200 && !noMoreImages) {
            setLoading(true);
            const skip = images.length;
            const items = await getImages(type, hero, skip, itemsPerPage);
            if (items === null) {
                setNoMoreImages(true);
            } else {
                setImages([...images, ...items]);
            }
            setLoading(false);
        } else {
            setNoMoreImages(true);
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
                    w-1/2 rounded-lg border-2 enabled:hover:bg-slate-500 enabled:hover:text-black font-bold mt-6
                    disabled:opacity-50"
                onClick={async () => {
                    await fetchData();
                }}
                disabled={loading || noMoreImages}
            >
                Load More
            </button>
            {loading && (
                <LoadingInfoModal
                    content="Loading ..."
                    otherInfo=""
                />
            )}
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
