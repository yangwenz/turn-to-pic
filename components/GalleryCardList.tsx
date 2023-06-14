import React, {useEffect, useState} from "react";
import GalleryCard, {ImageInfo} from "@/components/GalleryCard";


function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function resizeImage(
    isTablet: boolean,
    width: number,
    height: number
): [number, number] {
    const maxWidth: number = isTablet? 256: 320;
    const r = maxWidth / width;
    return [Math.floor(r * width), Math.floor(r * height)]
}

// For testing purpose
async function getRecentImages(skip: number, take: number, orderBy?: string) {
    let images: ImageInfo[] = []
    for (let i = skip; i < skip + take; i++) {
        images.push({
            id: String(i),
            url: `https://robohash.org/${i}?200x200`,
            author: String(i),
            width: getRandomInt(256, 512),
            height: getRandomInt(256, 512),
            likes: i,
            userLiked: i % 2 === 0
        })
    }
    return {images: images, counts: 100};
}

export default function GalleryCardList({orderBy, itemsPerPage}: {
    orderBy: string,
    itemsPerPage: number
}) {
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsTablet(window.innerWidth < 768);
        };
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);

        const fetchData = async () => {
            const r = await getRecentImages(0, itemsPerPage, orderBy);
            setImages([...r.images]);
        }
        fetchData().catch(console.error);

        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, [itemsPerPage, orderBy]);

    async function fetchData(page: number) {
        if (page < 100) {
            const skip = page * itemsPerPage;
            const r = await getRecentImages(skip, itemsPerPage, orderBy);
            setImages([...images, ...r.images]);
            setPage(page);
        }
    }

    function ImageColumns() {
        return (
            <div className="lg:w-[1280px] md:w-[640px] w-full lg:columns-4 md:columns-2 columns-1 gap-0">
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

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <ImageColumns/>
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
