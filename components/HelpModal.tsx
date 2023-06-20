import {FaLightbulb} from "react-icons/fa";
import Link from "next/link";

export default function HelpModal({showModal, setShowModal}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
}) {
    return (
        <div>
            {showModal ? (
                <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl bg-gray-900 md:w-[600px] w-80">
                        <div className="flex items-center justify-center border-b-2 border-slate-500
                            text-gray-300 rounded-t-lg pt-2 pb-2">
                            <h2 className="text-white text-center text-xl font-bold">
                                Tips
                            </h2>
                            <FaLightbulb className="text-white text-xl ml-2"/>
                        </div>
                        <div className="mt-3 text-gray-300 lg:text-base text-sm md:max-h-none
                            md:overflow-hidden max-h-80 overflow-y-scroll">
                            <div className="flex flex-col text-left font-medium pl-4 pr-4">
                                <div className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        1. Set the Replicate API Key.
                                        <Link
                                            className="underline text-amber-400 mr-1 ml-1"
                                            href={"https://replicate.com/account/api-tokens"}
                                        >
                                            Here
                                        </Link>
                                        to find your API key. The model utilizes an A100 GPU.
                                        If the usage exceeds the free limit, each generation will incur a cost
                                        of approximately $0.0115.
                                    </div>
                                </div>
                                <div className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        2. Select a Dota 2 Hero.
                                    </div>
                                </div>
                                <div className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        3. Select a style. If you prefer to use your own style, please choose
                                        <span className="font-semibold italic ml-1 mr-1 text-white">
                                            None.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        4. Enter the appropriate prompt. If you want to emphasize certain words,
                                        use the operator
                                        <span className="font-semibold italic ml-1 mr-1 text-white">
                                            (some words)+
                                        </span> where the number of + can be up to 3.
                                        For example, you can use
                                        <span className="font-semibold italic ml-1 mr-1 text-white">
                                            (sitting in a chair)+, (full body)++
                                        </span>
                                        to depict a specific hero sitting down.
                                    </div>
                                </div>
                                <div className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        5. Click
                                        <span className="font-semibold italic ml-1 mr-1 text-white">
                                            Generate
                                        </span>
                                        and patiently wait for approximately six seconds
                                        to receive the result.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="h-10 px-5 m-2 text-white transition-colors duration-150
                                bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                            onClick={() => setShowModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
