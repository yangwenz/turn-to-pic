import { type ReactNode } from "react";
import Head from "next/head";
import clsx from "clsx";

interface LayoutProps {
    children: ReactNode;
    className?: string;
    centered?: boolean;
}

export default function DefaultLayout(props: LayoutProps) {
    return (
        <div className="flex flex-row">
            <Head>
                <title>Turn2Pic</title>
            </Head>
            {props.children}
        </div>
    );
};
