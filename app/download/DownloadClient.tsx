"use client";
import { DropMenuLinux } from "@/components/DropMenuLinux";
import { DropMenuMacOS } from "@/components/DropMenuMac";
import { DropMenuWindows } from "@/components/DropMenuWindows";


export default function DownloadClient() {
    return (
        <div className="flex flex-col mt-10 mb-15">
            <h2 className="text-center text-4xl font-semibold text-white ">
                Download version for your system
            </h2>
            <div className="flex justify-center mt-15 gap-10">
                <DropMenuWindows />
                <DropMenuLinux/>
                <DropMenuMacOS/>
            </div>
        </div>
    );
}