"use client";
import { handleScroll } from "@/helpers/HandleScroll";

export default function Hero() {
    return (
        <div className="flex flex-col text-center items-center">
            <h1 className="font-sans font-semibold tracking-widest text-white text-5xl px-2 mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                SEVERUS
            </h1>
            <h2 className="font-sans font-medium text-white text-2xl px-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                Peer-to-peer chat, with end-to-end and TLS. No accounts, no cloud, no message history
            </h2>
            <a href="#Severus-Demo" key="#Severus-Demo" onClick={(e) => handleScroll(e, "#Severus-Demo")} className="text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 shadow-lg shadow-green-800/60 font-medium rounded-xl text-2xl px-4 py-2.5 text-center leading-5 mt-10 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                Try web client
            </a>
        </div>
    )
}