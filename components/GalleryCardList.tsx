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
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        // Function to check if the screen width is for desktop or tablet
        const checkScreenWidth = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 768) {
                // 768px is the breakpoint for tablet devices
                setIsTablet(false);
            } else {
                setIsTablet(true);
            }
        };
        // Call the checkScreenWidth function initially
        checkScreenWidth();
        // Set up an event listener for window resize events
        window.addEventListener("resize", checkScreenWidth);
        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page])

    const fetchData = async (page: number) => {
        if (page < 100) {
            const skip = page * itemsPerPage;
            const r = await getRecentImages(skip, itemsPerPage, orderBy);
            setImages([...images, ...r.images]);
            setPage(page);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="md:w-[1280px] w-full md:columns-4 columns-1 gap-0">
                {images.map((image, i) => {
                    return (
                        <div key={`${i}`}>
                            <GalleryCard isTablet={isTablet} image={images[i]}/>
                        </div>
                    )
                })}
            </div>
            <button
                className="h-10 px-3 ml-1 text-gray-300 lg:text-base text-lg bg-transparent border-slate-500
                    w-1/2 rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold mt-6"
                onClick={() => setPage(page + 1)}>
                Load More
            </button>
        </div>
    )
}
