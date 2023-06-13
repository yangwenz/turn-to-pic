import React, {useEffect, useState} from "react";
import GalleryCard, {ImageInfo} from "@/components/GalleryCard";


function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


// For testing purpose
async function getRecentImages(skip: number, take: number, orderBy?: string) {
    let images: ImageInfo[] = []
    for (let i = skip; i < skip + take; i++) {
        images.push({
            id: String(i),
            imageUrl: `https://robohash.org/${i}?200x200`,
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
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchData(page);
    }, [page])

    const fetchData = async (page: number) => {
        const skip = page * itemsPerPage;
        const r = await getRecentImages(skip, itemsPerPage, orderBy);
        setImages([...images, ...r.images]);
        setPage(page);
        if (page === 100) {
            setHasMore(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="md:w-[1024px] w-full md:columns-4 columns-1 gap-0">
                {images.map((image, i) => {
                    return (
                        <div key={`${i}`}>
                            <GalleryCard image={images[i]}/>
                        </div>
                    )
                })}
            </div>
            <button
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-lg
                    px-6 py-2 hover:bg-gradient-to-bl focus:ring-4 font-bold lg:text-base text-lg mt-6"
                onClick={() => setPage(page + 1)}>
                Load More
            </button>
        </div>
    )
}
