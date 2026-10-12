"use client";
import { handleScroll } from "@/helpers/HandleScroll";
import { ChevronDown } from "lucide-react";

interface IArrowTarget {
    target: string;
}

export function ArrowDown({ target }: IArrowTarget) {

    return (
        <div className="flex justify-center">
            <a className="cursor-pointer" onClick={(e) => handleScroll(e, target)}>
                <ChevronDown className="h-6 w-6 animate-bounce" color="white" />
            </a>
        </div>
    );
}