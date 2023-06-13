import ReactPaginate from "react-paginate";
import React, {useState} from "react";
import Spinner from "@/components/Spinner";

export default function Pagination({pageCount, currentPage, onPageChange}: {
    pageCount: number,
    currentPage: number,
    onPageChange: (page: number) => void
}) {
    const [loading, setLoading] = useState<string | null>(null);

    async function handlePageClick(page: any) {
        setLoading("Loading ...")
        await onPageChange(page.selected);
        setLoading(null);
    }

    return (
        <div className="m-5 max-w-fit text-center md:text-base text-sm">
            <ReactPaginate
                previousLabel={"Prev"}
                nextLabel={"Next"}
                pageCount={pageCount}
                initialPage={currentPage}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
            />
            {loading && (
                <div
                    className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ zIndex: 100 }}
                >
                    <div className="p-4 w-40 bg-white text-center rounded-lg animate-in zoom-in">
                        <Spinner />
                        <p className="pt-3 opacity-30 text-center text-sm">
                            {loading}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
