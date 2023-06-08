import Head from "next/head";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Drawer from "@/components/Drawer";

export default function Generate() {
    const {data: session, status} = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push("/signin");
        return <div>Unauthenticated</div>
    } else if (status === "loading") {
        return <div className="flex justify-end">
            <p>Validating session ...</p>
        </div>
    }

    return (
        <div className="flex flex-row">
            <Head>
                <title>Turn2Pic</title>
            </Head>
            <Drawer/>
            <div className="flex flex-col lg:max-w-6xl w-full mx-auto items-center min-h-screen">
                <Header session={session} status={status}/>
                <main className="flex flex-col items-center justify-center
                text-center px-4 mt-8 sm:mb-0 mb-auto w-full">
                    Test
                </main>
                <Footer/>
            </div>
        </div>
    )
}
