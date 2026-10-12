import SeverusFlow from "./SeverusFlow";

export function FeaturesSection() {
    return (
        <div className="flex flex-col justify-center mx-2">
            <h3 className="text-2xl md:text-4xl text-center mb-2 md:mb-4 text-[#4ADE80] font-semibold">
                How severus secure your data
            </h3>
            <h4 className="text-lg md:text-2xl text-center mb-2.5 md:mb-5 text-white">
                Two encrypted layers between you and the network
            </h4>
            <SeverusFlow />
        </div>
    );
}