import Link from "next/link";

export function Download() {
    return (
        <div className="flex flex-col justify-center pb-60 mt-10">
            <h2 className="text-center text-4xl text-white">
                Try Severus now
            </h2>
            <div className="flex justify-center gap-5 mt-2 items-center">
                <Link href="/download" className="text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 shadow-lg shadow-green-800/60 font-medium rounded-xl text-2xl text-center leading-5 mt-10 py-5.5 px-5">
                    Download
                </Link>
                <a
                    href="https://github.com/gwill1337/Severus/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 shadow-lg shadow-green-800/60 font-medium rounded-xl text-2xl text-center leading-5 mt-10 py-5.5 px-5"
                >
                    GitHub
                </a>
            </div>
        </div>
    );
}