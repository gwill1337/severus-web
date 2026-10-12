import Link from "next/link";

export function Header() {
    return (
        <header className="py-1 sticky top-0 z-50 w-full bg-[#050505]/40 backdrop-blur-md shadow-md">
            <div className="flex items-center py-1">
                <Link href="/" className="font-sans font-semibold tracking-widest text-white  text-xl sm:text-3xl px-2 ml-10">
                    Severus
                </Link>
                <div className="absolute right-10 flex gap-7">
                    <Link href="/download" className="font-semibold text-base hover text-white/80 hover:text-[#4ADE80] transition-colors duration-300 cursor-pointer relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ADE80]  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out  hover:after:scale-x-100">
                        Download
                    </Link>
                    <Link href="/docs" className="font-semibold text-base hover text-white/80 hover:text-[#4ADE80] transition-colors duration-300 cursor-pointer relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ADE80]  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out  hover:after:scale-x-100">
                        Docs
                    </Link>
                    <Link href="/security" className="font-semibold text-base hover text-white/80 hover:text-[#4ADE80] transition-colors duration-300 cursor-pointer relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ADE80]  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out  hover:after:scale-x-100">
                        Security
                    </Link>
                    <a
                        href="https://github.com/gwill1337/Severus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-base hover text-white/80 hover:text-[#4ADE80] transition-colors duration-300 cursor-pointer relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ADE80]  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out  hover:after:scale-x-100"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </header>
    );
}