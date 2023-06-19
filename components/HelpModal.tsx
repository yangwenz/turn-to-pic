import {
    FaLightbulb,
    FaDiceOne,
    FaDiceTwo,
    FaDiceThree,
    FaDiceFour
} from "react-icons/fa";

export default function HelpModal({showModal, setShowModal}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
}) {
    return (
        <div>
            {showModal ? (
                <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl bg-gray-900 lg:max-w-3xl min-w-[300px]">
                        <div className="flex items-center justify-center border-b-2 border-slate-500
                            text-gray-300 rounded-t-lg pt-2 pb-2">
                            <h2 className="text-white text-center text-xl font-bold">
                                Tips
                            </h2>
                            <FaLightbulb className="text-white text-xl ml-2"/>
                        </div>
                        <div className="mt-3 text-gray-300 lg:text-base text-sm">
                            <ol className="flex flex-col text-left font-medium pl-4 pr-4" type="1">
                                <li className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        1. Choose a Dota 2 Hero
                                    </div>
                                </li>
                                <li className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        2. Choose a style. If you want to use your own style, please choose None.
                                    </div>
                                </li>
                                <li className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        3. Input proper prompt. If you want to emphasize more on some words, use
                                        the operator
                                        <span className="font-semibold italic ml-1 mr-1 text-white">
                                            (some words)+
                                        </span> where the number of + can be up to 3.
                                        For example, you may use
                                        <span className="font-semibold italic ml-1 mr-1 text-white">
                                            (sitting in a chair)+, (full body)++
                                        </span>
                                        to let a specific hero sit down.
                                    </div>
                                </li>
                                <li className="flex flex-row items-center mb-2">
                                    <div className="ml-2">
                                        4. Click generate and wait about 6 seconds for the result.
                                    </div>
                                </li>
                            </ol>
                        </div>
                        <button
                            className="h-10 px-5 m-2 text-white transition-colors duration-150
                                bg-gradient-to-br from-gray-500 to-gray-700
                                rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
