import Image from "next/image";

function getNumberIcon(index: number) {
    switch (index) {
        case 1:
            return (
                <Image
                    src="/number-1.svg"
                    width={24}
                    height={24}
                    alt="number-1"
                />
            );
        case 2:
            return (
                <Image
                    src="/number-2.svg"
                    width={24}
                    height={24}
                    alt="number-2"
                />
            );
        case 3:
            return (
                <Image
                    src="/number-3.svg"
                    width={24}
                    height={24}
                    alt="number-3"
                />
            );
        default:
            return (
                <Image
                    src="/number-1.svg"
                    width={24}
                    height={24}
                    alt="number-1"
                />
            )
    }
}

export default function HelpModal({showModal, setShowModal, content}: {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
    content: string[]}
) {
    const buttonStyle =
        "h-10 px-5 m-2 text-white transition-colors duration-150 " +
        "bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg focus:ring-4 hover:bg-gradient-to-bl";

    return (
        <div>
            {showModal ? (
                <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                rounded-lg shadow-xl bg-white/60">
                    <div className="border-b border-gray-600 bg-gradient-to-br from-purple-600 to-blue-500
                        text-white rounded-t-lg pt-2">
                        <h2 className="mx-4 text-white text-center text-xl font-bold mb-3">
                            Tips
                        </h2>
                    </div>
                    <div className="mt-3 mb-2">
                        <ol className="text-left font-medium pl-8 pr-8">
                            {content.map((item, index) =>
                                <div key={index}>
                                    <li key={index} className="p-0.5 inline-flex">
                                        {getNumberIcon(index + 1)}
                                        <span className="ml-2">{item}</span>
                                    </li>
                                </div>
                            )}
                        </ol>
                    </div>
                    <button
                        className={buttonStyle}
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                </div>
            ) : null}
        </div>
    );
};
