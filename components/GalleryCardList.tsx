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
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [numColumns, setNumColumns] = useState<number>(1);
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        // Function to check if the screen width is for desktop or tablet
        const checkScreenWidth = () => {
            if (window.innerWidth >= 768) {
                // 768px is the breakpoint for tablet devices
                setIsTablet(false);
            } else {
                setIsTablet(true);
            }
            const width = window.innerWidth;
            setScreenWidth(width)
            if (width >= 1280) {
                setNumColumns(4);
            } else if (width < 1280 && width >= 768) {
                setNumColumns(2);
            } else {
                setNumColumns(1);
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

    const ImageColumn = (col: number, numColumns: number) => {
        return (
            <div className="flex flex-col" key={col}>
                {images.filter((_, i) => {return (i % numColumns) === col})
                    .map((image, i) => {
                    return (
                        <div key={image.id}>
                            <GalleryCard isTablet={isTablet} image={image}/>
                        </div>
                    )
                })}
            </div>
        )
    }

    const ImageColumns = () => {
        let className: string = `w-[1280px] flex flex-row`;
        if (numColumns == 1) {
            className = "w-full columns-1"
        } else if (numColumns == 2) {
            className = "w-[640px] flex flex-row"
        }
        const indices = Array.from(Array(numColumns).keys()).map(x => x);
        return (
            <div className={className}>
                {indices.map(i => ImageColumn(i, numColumns))}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <ImageColumns/>
            <button
                className="h-10 px-3 ml-1 text-gray-300 lg:text-base text-lg bg-transparent border-slate-500
                    w-1/2 rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold mt-6"
                onClick={() => setPage(page + 1)}>
                Load More
            </button>
        </div>
    )
}
