import Link from "next/link";
import Image from "next/image";
import {signOut} from "next-auth/react";
import {Session} from "next-auth";
import Tilt from "react-parallax-tilt";
import {useState} from "react";
import Settings from "@/components/Settings";


function signButtons(session: Session | null, status: string) {
    const buttonStyle =
        "h-10 px-3 m-2 text-white transition-colors duration-150 lg:text-base text-xs " +
        "bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg focus:ring-4 hover:bg-gradient-to-bl";

    if (status === "loading") {
        return <div className="flex justify-end">
            <p>Validating session ...</p>
        </div>
    }

    if (!session) {
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
    const name = session?.user?.name || undefined
    const [showModal, setShowModal] = useState(false);

    return (
        <header className="flex w-full justify-between items-center border-b border-slate-500 p-3">
            <Tilt className="Tilt br3 shadow-3 pa3">
                <Link href="/" className="flex">
                    <Image
                        alt="logo"
                        src="/logo_3.png"
                        className="sm:w-12 sm:h-12 w-7 h-7"
                        width={30}
                        height={30}
                    />
                    <h1 className="lg:text-4xl text-2xl font-bold ml-2 tracking-tight
                        antialiased mt-1 drop-shadow-xl"
                        style={{fontFamily: "ABC"}}>
                        <span className="text-slate-800">Turn</span>
                        <span className="text-slate-700">To</span>
                        <span className="text-slate-600">Pic</span>
                    </h1>
                </Link>
            </Tilt>
            <div className="flex justify-end items-center text-center">
                {photo && (
                    <Image
                        alt="profile"
                        src={photo}
                        className="w-10 rounded-full"
                        width={25}
                        height={25}
                    />
                )}
                {name && (
                    <p className="mr-1 ml-1 lg:text-base text-sm">
                        {name}
                    </p>
                )}
                {status === "authenticated" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="h-10 px-3 ml-2 text-white transition-colors duration-150
                        lg:text-base text-xs bg-gradient-to-br from-purple-600 to-blue-500
                        rounded-lg focus:ring-4 hover:bg-gradient-to-bl"
                    >
                        Settings
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
