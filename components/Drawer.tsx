import {useEffect, useState} from "react";
import {FaBars} from "react-icons/fa";
import clsx from "clsx";

export default function Drawer() {
    const [showDrawer, setShowDrawer] = useState(true);

    useEffect(() => {
        // Function to check if the screen width is for desktop or tablet
        const checkScreenWidth = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 768) {
                // 768px is the breakpoint for tablet devices
                setShowDrawer(true);
            } else {
                setShowDrawer(false);
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

    const toggleDrawer = () => {
        setShowDrawer((prevState) => !prevState);
    };

    return (
        <>
            <div
                id="drawer"
                className={clsx(
                    showDrawer ? "translate-x-0" : "-translate-x-full",
                    "z-30 m-0 flex h-screen w-80 flex-col justify-between bg-gray-900 p-3 " +
                    "text-gray-300 shadow-3xl transition-all",
                    "fixed top-0 "
                )}
            >
                <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="mb-2 flex justify-center gap-2">
                        More Settings
                        <button
                            className={clsx(
                                showDrawer ? "-translate-x-2" : "translate-x-12",
                                "absolute right-0 top-2 z-40 rounded-md border-2 border-slate-500 " +
                                "bg-transparent p-2 text-gray-300 transition-all hover:bg-gray-300 " +
                                "hover:text-black"
                            )}
                            onClick={toggleDrawer}
                        >
                            <FaBars />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
