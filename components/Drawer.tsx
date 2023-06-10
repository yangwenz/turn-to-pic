import React, {useEffect, useState} from "react";
import {FaBars, FaMinus, FaPlus} from "react-icons/fa";
import clsx from "clsx";

export default function Drawer({
        negativePrompt, setNegativePrompt,
        width, setWidth,
        height, setHeight,
        numSteps, setNumSteps,
        guidanceScale, setGuidanceScale,
        seed, setSeed, reset}: {
    negativePrompt: string,
    setNegativePrompt: (x: string) => void,
    width: number,
    setWidth: (x: number) => void,
    height: number,
    setHeight: (x: number) => void
    numSteps: number,
    setNumSteps: (x: number) => void,
    guidanceScale: number,
    setGuidanceScale: (x: number) => void,
    seed: number | string,
    setSeed: (x: number | string) => void,
    reset: () => void
}) {
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
                    "z-30 m-0 flex h-screen md:w-80 w-64 flex-col justify-between bg-gray-900 p-3 " +
                    "text-gray-300 shadow-3xl transition-all",
                    "fixed top-0 "
                )}
            >
                <div className="flex flex-col gap-1 overflow-y-auto">
                    <div className="mb-2 flex justify-center gap-2">
                        <span className="font-bold text-lg">
                            Advanced Settings
                        </span>
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
                    <div className="border-b border-slate-500 mt-2 mb-4"></div>
                    <NegativePrompt prompt={negativePrompt} setPrompt={setNegativePrompt}/>
                    <WidthAndHeight width={width} height={height} setWidth={setWidth} setHeight={setHeight}/>
                    <InferenceSteps numSteps={numSteps} setNumSteps={setNumSteps}/>
                    <GuidanceScale guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale}/>
                    <RandomSeed seed={seed} setSeed={setSeed}/>
                    <div className="w-full flex justify-center">
                        <button
                            className="w-auto h-10 px-10 ml-1 text-gray-300 lg:text-base text-xs bg-transparent
                                border-slate-500 rounded-lg border-2 hover:bg-gray-300 hover:text-black font-bold"
                            onClick={reset}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

function NegativePrompt({prompt, setPrompt}: {
    prompt: string,
    setPrompt: (x: string) => void
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-5">
            <label
                className="flex flex-row items-center justify-between
                    mb-2 text-base font-medium text-gray-300 hover:cursor-pointer"
                onClick={() => {setShow(!show)}}
            >
                <span>Negative Prompt</span>
                {show && (<FaMinus/>)}
                {!show && (<FaPlus/>)}
            </label>
            {show && (
                <textarea
                    id="message"
                    rows={12}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-300 rounded border
                        border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Write negative prompt here..."
                    maxLength={1500}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                >
                </textarea>
            )}
            <label className="block mt-1 text-sm font-medium text-gray-300/60">
                Specify things to not see in the output
            </label>
        </div>
    )
}

function WidthAndHeight({width, height, setWidth, setHeight}: {
    width: number,
    height: number,
    setWidth: (x: number) => void,
    setHeight: (x: number) => void
}) {
    const widths = [256, 384, 480, 512, 720, 768, 960];
    const heights = [256, 384, 480, 512, 720, 768, 960];

    return (
        <div className="w-full mb-5">
            <label className="block mb-2 text-base font-medium text-gray-300">
                Image Width
            </label>
            <div className="flex justify-center mt-2">
                <select
                    id="widthlist"
                    className="bg-gray-300 text-gray-900 text-sm rounded
                        block w-full px-3 py-2 min-h-[auto]"
                    value={width}
                    onChange={(event) => setWidth(Number(event.target.value))}
                >
                    {widths.map(w => (<option value={w} key={w}>{w}</option>))}
                </select>
            </div>
            <label className="block mt-1 text-sm font-medium text-gray-300/60 mb-5">
                Maximum size is 960x768 or 768x960
            </label>
            <label className="block mt-2 mb-2 text-base font-medium text-gray-300">
                Image Height
            </label>
            <div className="flex justify-center mt-2">
                <select
                    id="heightlist"
                    className="bg-gray-300 text-gray-900 text-sm rounded
                        block w-full px-3 py-2 min-h-[auto]"
                    value={height}
                    onChange={(event) => setHeight(Number(event.target.value))}
                >
                    {heights.map(w => (<option value={w} key={w}>{w}</option>))}
                </select>
            </div>
            <label className="block mt-1 text-sm font-medium text-gray-300/60">
                Maximum size is 960x768 or 768x960
            </label>
        </div>
    )
}

function InferenceSteps({numSteps, setNumSteps}: {
    numSteps: number,
    setNumSteps: (x: number) => void}
) {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-5">
            <label
                className="flex flex-row items-center justify-between
                    mb-2 text-base font-medium text-gray-300 hover:cursor-pointer"
                onClick={() => {setShow(!show)}}
            >
                <span>Number of Inference Steps</span>
                {show && (<FaMinus/>)}
                {!show && (<FaPlus/>)}
            </label>
            {show && (
                <div className="flex flex-row items-center justify-center">
                    <input
                        id="step-number"
                        type="number"
                        className="block min-h-[auto] w-16 text-sm text-gray-900
                        rounded border bg-gray-300 px-3 py-1 mr-1"
                        min={1}
                        max={200}
                        value={numSteps}
                        onChange={(event) => {setNumSteps(Number(event.target.value))}}
                    />
                    <input
                        id="step-range"
                        type="range"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        min={1}
                        max={200}
                        step={1}
                        value={numSteps}
                        onChange={(event) => {setNumSteps(Number(event.target.value))}}
                    />
                </div>
            )}
            <label className="block mt-1 text-sm font-medium text-gray-300/60">
                Number of denoising steps (min: 1; max: 200)
            </label>
        </div>
    )
}

function GuidanceScale({guidanceScale, setGuidanceScale}:{
    guidanceScale: number,
    setGuidanceScale: (x: number) => void}
) {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-5">
            <label
                className="flex flex-row items-center justify-between
                    mb-2 text-base font-medium text-gray-300 hover:cursor-pointer"
                onClick={() => {setShow(!show)}}
            >
                <span>Guidance Scale</span>
                {show && (<FaMinus/>)}
                {!show && (<FaPlus/>)}
            </label>
            {show && (
                <div className="flex flex-row items-center justify-center">
                    <input
                        id="guidance-number"
                        type="number"
                        className="block min-h-[auto] w-16 text-sm text-gray-900
                        rounded border bg-gray-300 px-3 py-1 mr-1"
                        min={1}
                        max={20}
                        step={0.1}
                        value={guidanceScale}
                        onChange={(event) => {setGuidanceScale(Number(event.target.value))}}
                    />
                    <input
                        id="guidance-range"
                        type="range"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        min={1}
                        max={20}
                        step={0.1}
                        value={guidanceScale}
                        onChange={(event) => {setGuidanceScale(Number(event.target.value))}}
                    />
                </div>
            )}
            <label className="block mt-1 text-sm font-medium text-gray-300/60">
                Classifier-free guidance (min: 1; max: 20)
            </label>
        </div>
    )
}

function RandomSeed({seed, setSeed}: {
    seed: number | string,
    setSeed: (x: number | string) => void}
) {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-5">
            <label
                className="flex flex-row items-center justify-between
                    mb-2 text-base font-medium text-gray-300 hover:cursor-pointer"
                onClick={() => {setShow(!show)}}
            >
                <span>Random Seed</span>
                {show && (<FaMinus/>)}
                {!show && (<FaPlus/>)}
            </label>
            {show && (
                <input
                    id="guidance-number"
                    type="number"
                    className="block min-h-[auto] w-full text-sm text-gray-900
                    rounded border bg-gray-300 px-3 py-1 mr-1"
                    value={seed}
                    onChange={(event) => {
                        setSeed(event.target.value === ""? "": Number(event.target.value))}}
                />
            )}
            <label className="block mt-1 text-sm font-medium text-gray-300/60">
                Leave blank to randomize the seed
            </label>
        </div>
    )
}
