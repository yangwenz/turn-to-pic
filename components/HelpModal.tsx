import Image from "next/image";
import {
    FaLightbulb,
    FaDiceOne,
    FaDiceTwo,
    FaDiceThree,
    FaDiceFour
} from "react-icons/fa";

function getNumberIcon(index: number) {
    switch (index) {
        case 1:
            return (
                <FaDiceOne className="text-white text-xl"/>
            );
        case 2:
            return (
                <FaDiceTwo className="text-white text-xl"/>
            );
        case 3:
            return (
                <FaDiceThree className="text-white text-xl"/>
            );
        case 4:
            return (
                <FaDiceFour className="text-white text-xl"/>
            );
        default:
            return (
                <FaDiceOne className="text-white text-xl"/>
            )
    }
}

export default function HelpModal({showModal, setShowModal}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
}) {
    const content = ["a", "b", "c"];

    return (
        <div>
            {showModal ? (
                <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-gray-800/90">
                    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                        rounded-lg shadow-xl bg-gray-900 min-w-[300px]">
                        <div className="flex items-center justify-center border-b-2 border-slate-500
                            text-gray-300 rounded-t-lg pt-2 pb-2">
                            <h2 className="text-white text-center text-xl font-bold">
                                Tips
                            </h2>
                            <FaLightbulb className="text-white text-xl ml-2"/>
                        </div>
                        <div className="mt-3 mb-2 text-gray-300">
                            <ol className="text-left font-medium pl-8 pr-8">
                                {content.map((item, index) =>
                                    <div key={index}>
                                        <li key={index} className="flex flex-row items-center mb-2">
                                            {getNumberIcon(index + 1)}
                                            <span className="ml-2">{item}</span>
                                        </li>
                                    </div>
                                )}
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
