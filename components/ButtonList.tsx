import HelpModal from "@/components/HelpModal";
import {useState} from "react";


export default function ButtonList({onClickDownload, helpContent}: {
    onClickDownload: () => void,
    helpContent: string[]
}) {
    const buttonStyle = "bg-transparent hover:bg-slate-200 text-gray-800 m-2 " +
        "font-bold py-2 px-4 rounded-full inline-flex items-center"
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex">
            <button
                onClick={onClickDownload}
                className={buttonStyle}>
                <svg
                    className="fill-current w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
                <span>Download</span>
            </button>
            <button
                onClick={() => setShowModal(true)}
                className={buttonStyle}>
                <svg
                    className="fill-current w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                >
                    <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm2,
                    34.4c-.1.1-.1.2-.2.4s-.1.2-.1.3l-.3.3-.3.3h-.3l-.4.2h-.8l-.4-.2h-.3l-.3-.3-.3-.3c0-.1-.1-.2-.1-.3s-.1-.3-.2-.4v-.8c.1-.1.1-.2.2-.4s.1-.2.1-.3l.3-.3a1.9,
                    1.9,0,0,1,1.8-.6h.4l.3.2.3.3.3.3c0,.1.1.2.1.3s.1.3.2.4v.8ZM27.8,27a3.7,3.7,0,0,
                    0-1.6,1.7A1.9,1.9,0,0,1,24.4,30h-.8a2,2,0,0,1-1.1-2.6,7.1,7.1,0,0,1,3.7-3.9A4.9,
                    4.9,0,0,0,25,14.1a5.3,5.3,0,0,0-4.2,1A5.3,5.3,0,0,0,19,18.9a2,2,0,0,1-4,0,9,9,0,
                    0,1,3.2-6.8,8.7,8.7,0,0,1,7.6-1.9,8.7,8.7,0,0,1,7,6.9A8.9,8.9,0,0,1,27.8,27Z"/>
                </svg>
                <span>Help</span>
            </button>
            <HelpModal
                showModal={showModal}
                setShowModal={(x: boolean) => setShowModal(x)}
                content={helpContent}
            />
        </div>
    )
}
