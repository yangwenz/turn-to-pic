
export default function Footer() {
    return (
        <footer className="text-center w-full border-t border-slate-500 mt-3 pt-3 flex
        sm:flex-row flex-col justify-between items-center px-3 space-y-3 mb-3 text-gray-300">
            <div>
                Designed for {" "}
                <a
                    href="https://www.dota2.com/home"
                    target="_blank"
                    className="text-gray-300 font-bold transition hover:text-gray-300/50"
                >
                    Dota 2{" "}
                </a>
                Fans. For inquiries or bug reports, please contact {" "}
                <a
                    href="mailto: turn2pic@gmail.com"
                    className="text-gray-300 font-bold transition hover:text-gray-300/50"
                >
                    turn2pic@gmail.com
                </a>.
            </div>
        </footer>
    );
}
