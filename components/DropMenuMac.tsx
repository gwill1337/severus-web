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
    { href: "https://github.com/gwill1337/Severus/releases/download/app-v1.0.0/Severus_1.0.0_aarch64.dmg", text: "MacOS Apple" },
    { href: "https://github.com/gwill1337/Severus/releases/download/app-v1.0.0/Severus_1.0.0_x64.dmg", text: "MacOS Intel" },
]

export function DropMenuMacOS() {
    return (
        <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger openOnHover delay={0} closeDelay={100} render={<Button>Download for MacOS</Button>} className="text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 shadow-lg shadow-green-800/60 font-medium rounded-xl text-2xl text-center leading-5 mt-10 py-7.5 px-5 cursor-pointer" />
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {payloads.map((p) => (
                            <DropdownMenuItem className="hover:bg-gray-600/30" key={p.text}
                                render={
                                    <a
                                        key={p.text}
                                        href={p.href}
                                        target="_blank"
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
