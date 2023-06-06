
export default function Footer() {
    return (
        <footer className="text-center w-full border-t border-slate-500 mt-3 pt-3 flex
        sm:flex-row flex-col justify-between items-center px-3 space-y-3 mb-3">
            <div>
                Powered by{" "}
                <a
                    href="https://https://replicate.com/"
                    target="_blank"
                    className="font-bold transition hover:text-black/50"
                >
                    Replicate{" "}
                </a>
                and{" "}
                <a
                    href="https://vercel.com/"
                    target="_blank"
                    className="font-bold transition hover:text-black/50"
                >
                    Vercel.
                </a>
                <span className="ml-2">Developed by{" "}</span>
                <a
                    href="https://www.linkedin.com/in/wenzhuo-yang-23bb7122/"
                    target="_blank"
                    className="font-bold transition hover:text-black/50"
                >
                    YWZ.
                </a>
            </div>
        </footer>
    );
}
