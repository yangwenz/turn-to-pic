import React, {useState} from "react";
import Pagination from "@/components/Pagination";
import GalleryCard, {ImageInfo} from "@/components/GalleryCard";


// For testing purpose
async function getRecentImages(skip: number, take: number, orderBy?: string) {
    let images: ImageInfo[] = []
    for (let i = skip; i < skip + take; i++) {
        images.push({
            id: String(i),
            imageUrl: `https://robohash.org/${i}?200x200`,
            author: String(i),
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
    const [counts, setCounts] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    async function onPageChange(page: number) {
        const skip = page * itemsPerPage;
        const r = await getRecentImages(skip, itemsPerPage, orderBy);
        setImages(r.images);
        setCounts(r.counts);
        setCurrentPage(page);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className="grid md:grid-cols-4 grid-cols-2"
                style={{gridGap: "10px"}}
            >
                {images.map((image, i) => {
                    return (
                        <div key={`${i}`}>
                            <GalleryCard image={images[i]}/>
                        </div>
                    )
                })}
            </div>
            <Pagination
                pageCount={Math.ceil(counts / itemsPerPage)}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
        </div>
    )
}
