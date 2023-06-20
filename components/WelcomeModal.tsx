import {FaSmile} from "react-icons/fa";
import Link from "next/link";
import {useState} from "react";

type CheckStatus = {
    checked: boolean
}

export function loadCheckStatus() {
    if (typeof window === "undefined") {
        return false;
    }
    const data = localStorage.getItem("WELCOME_CHECK");
    if (!data) {
        return false;
    }
    try {
        const obj = JSON.parse(data) as CheckStatus;
        return obj.checked;
    } catch (error) {
        return false;
    }
}

export default function WelcomeModal() {
    const [showModal, setShowModal] = useState(!loadCheckStatus());
    const [checkStatus, setCheckStatus] = useState(false);

    function onClickOK() {
        setShowModal(false);
        try {
            localStorage.setItem("WELCOME_CHECK", JSON.stringify({checked: checkStatus}));
        } catch (e) {}
    }

    return (
        <div>
            {showModal ? (
                <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl bg-gray-900 md:w-[600px] w-80">
                        <div className="flex items-center justify-center border-b-2 border-slate-500
                            text-gray-300 rounded-t-lg pt-2 pb-2">
                            <h2 className="text-white text-center text-xl font-bold">
                                Welcome
                            </h2>
                            <FaSmile className="text-white text-xl ml-2"/>
                        </div>
                        <div className="mt-3 text-gray-300 lg:text-base text-sm md:max-h-none
                            md:overflow-hidden max-h-80 overflow-y-scroll">
                            <div className="flex flex-col text-left font-medium pl-4 pr-4">
                                <div className="mb-2 ml-2">
                                    Thanks to IceFrog and Valve for their incredible creation of
                                    <Link
                                        className="underline text-amber-400 ml-1 mr-1"
                                        href={"https://www.dota2.com/home"}
                                    >
                                        Dota 2
                                    </Link>
                                    which has provided us with countless enjoyable and unforgettable moments.
                                </div>
                                <div className="mb-2 ml-2">
                                    This is a personal project in the testing phase. More features will be added soon.
                                    The model used here is finetuned from the Stable Diffusion model. Please follow
                                    the
                                    <Link
                                        className="underline text-amber-400 ml-1 mr-1"
                                        href={"https://github.com/CompVis/stable-diffusion/blob/main/LICENSE"}
                                    >
                                        license
                                    </Link>
                                    conditions strictly.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full mt-1">
                            <input
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                onChange={
                                (event) => setCheckStatus(event.target.checked)}
                            />
                            <label className="ml-2 text-white">Don&#39;t show this message again</label>
                        </div>
                        <button
                            className="h-10 px-5 m-2 text-white transition-colors duration-150
                                bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                            onClick={onClickOK}
                        >
                            OK
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
