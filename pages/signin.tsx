import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from 'next/router';
import React from "react";
import {router} from "next/client";


export default function SignIn() {
    const buttonStyle = " bg-transparent border border-slate-500 text-gray-300 py-3 px-6 " +
        "rounded-2xl flex items-center font-normal hover:bg-gray-300 hover:text-black shadow-lg"
    const {error} = useRouter().query;
    const {data: session, status} = useSession();

    if (status === "authenticated") {
        router.push("/");
        return <div>Authenticated</div>
    }

    return (
        <div className="flex flex-col max-w-6xl mx-auto items-center min-h-screen">
            <Head>
                <title>TurnToPic</title>
            </Head>
            <Header session={session} status={status}/>
            <main
                className="flex flex-1 w-full flex-col items-center justify-center text-center sm:mb-0 mb-auto">
                <h1
                    className="mx-auto font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-5xl mb-5"
                    style={{fontFamily: "ABC"}}
                >
                    <span className="animate-text bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300
                        bg-clip-text text-transparent font-black">
                        Creating Amazing Pictures of Dota 2 Heroes
                    </span>
                </h1>
                <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[750px] mt-4 mb-80">
                    <div className="max-w-xl text-slate-400 text-xl">
                        Sign in below to create a free account and make stunning images today.
                    </div>
                    {error && <SignInError error={error}/>}
                    <button
                        onClick={() => signIn("google", {callbackUrl: "/"})}
                        className={buttonStyle}
                    >
                        <Image
                            src="/google.png"
                            width={25}
                            height={25}
                            alt="google's logo"
                            className="mr-1"
                        />
                        <span>Sign in with Google</span>
                    </button>
                </div>
                <Footer/>
            </main>
        </div>
    )
}

const errors = {
    Signin: 'Try signing with a different account.',
    OAuthSignin: 'Try signing with a different account.',
    OAuthCallback: 'Try signing with a different account.',
    OAuthCreateAccount: 'Try signing with a different account.',
    EmailCreateAccount: 'Try signing with a different account.',
    Callback: 'Try signing with a different account.',
    OAuthAccountNotLinked:
        'To confirm your identity, sign in with the same account you used originally.',
    EmailSignin: 'Check your email address.',
    CredentialsSignin:
        'Sign in failed. Check the details you provided are correct.',
    default: 'Unable to sign in.',
};

const SignInError = ({error}: { error: string | string[] | undefined }) => {
    const errorMessage = error && (errors[error as keyof typeof errors] ?? errors.default);
    return (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
            {errorMessage}
        </div>
    )
};
