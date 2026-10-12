import SeverusDemo from "./SeverusDemo";

export function SeverusDemoSection() {
    return (
        <div className="flex flex-col justify-center mx-2">
            <h3 className="text-3xl md:text-4xl text-center mb-5 text-[#4ADE80] font-semibold">
                Try web client
            </h3>
            <SeverusDemo/>
        </div>
    );
}