"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const payloads = [
    { href: "https://github.com/gwill1337/Severus/releases/download/app-v2.0.0/Severus_2.0.0_x64-setup.exe", text: "Windows x64 .exe" },
    { href: "https://github.com/gwill1337/Severus/releases/download/app-v2.0.0/Severus_2.0.0_x64_en-US.msi", text: " Windows x64 .msi" },
]

export function DropMenuWindows() {
    return (
        <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger openOnHover delay={0} closeDelay={100} render={<Button>Download for Windows</Button>} className="text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 shadow-lg shadow-green-800/60 font-medium rounded-xl text-2xl text-center leading-5 mt-10 py-7.5 px-5 cursor-pointer" />
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {payloads.map((p) => (
                            <DropdownMenuItem className="hover:bg-gray-600/30" key={p.text}
                                render={
                                    <a
                                        key={p.text}
                                        href={p.href}
                                        rel="noopener noreferrer"
                                        className="text-xl py-1 px-2.5 cursor-pointer"
                                    >
                                        {p.text}
                                    </a>
                                }
                            />
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
