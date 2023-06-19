import Link from "next/link";
import Image from "next/image";
import {signOut} from "next-auth/react";
import {Session} from "next-auth";
import Tilt from "react-parallax-tilt";
import {useState} from "react";
import Settings from "@/components/Settings";


function signButtons(session: Session | null, status: string) {
    const buttonStyle =
        "h-10 px-3 ml-1 text-gray-300 lg:text-base text-sm bg-transparent border-slate-500 " +
        "rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold";

    if (status === "loading") {
        return <div className="flex justify-end">
            <p>Validating session ...</p>
        </div>
    } else if (status != "authenticated") {
        return <div className="flex justify-end">
            <Link href={"/signin"}>
                <button className={buttonStyle}>
                    Sign In
                </button>
            </Link>
        </div>
    } else {
        return <div className="flex justify-end">
            <button
                onClick={() => signOut({callbackUrl: "/"})}
                className={buttonStyle}
            >
                Sign Out
            </button>
        </div>
    }
}

export default function Header(
    {session, status}: { session: Session | null, status: string }
) {
    const photo = session?.user?.image || undefined
    const [showModal, setShowModal] = useState(false);
    const buttonStyle =
        "h-10 px-3 ml-1 text-gray-300 lg:text-base text-sm bg-transparent border-slate-500 " +
        "rounded-lg border-2 hover:bg-slate-500 hover:text-black font-bold";

    return (
        <header className="flex w-full justify-between items-center border-b border-slate-500 py-3">
            <Tilt className="Tilt br3 shadow-3 px-4">
                <Link href="/" className="flex">
                    <div className="flex flex-row items-center justify-center">
                        <Image
                            alt="logo"
                            src="/logo_3.png"
                            className="sm:w-12 sm:h-12 w-7 h-7"
                            width={30}
                            height={30}
                        />
                        <div className="lg:text-3xl text-2xl font-bold ml-2 tracking-tight drop-shadow-xl">
                            <span className="text-slate-400">Turn</span>
                            <span className="text-slate-400">2</span>
                            <span className="text-slate-300">Pic</span>
                        </div>
                    </div>
                </Link>
            </Tilt>
            <div className="flex justify-end items-center text-center px-4">
                {photo && (
                    <Image
                        alt="profile"
                        src={photo}
                        className="w-10 rounded-full"
                        width={25}
                        height={25}
                    />
                )}
                {status === "authenticated" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className={buttonStyle}
                        title="Set Replicate API Key"
                    >
                        API Key
                    </button>
                )}
                {status === "authenticated" && (
                    <Settings
                        showModal={showModal}
                        setShowModal={(x: boolean) => setShowModal(x)}
                    />
                )}
                {signButtons(session, status)}
            </div>
        </header>
    )
}
