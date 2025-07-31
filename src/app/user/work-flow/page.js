"use client";
import { useState } from "react";
import Initiation from "../../../components/BookIduser/Initiation";
// import Content from "../../../components/BookIduser/Content";
// import Editing from "../../../components/BookIduser/Editing";
import Closure from "../../../components/BookIduser/Closure"
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
    { id: 1, title: "Initiation", content: <Initiation /> },
    // { id: 2, title: "Content", content: <Content /> },
    // { id: 3, title: "Editing", content: <Editing /> },
    { id: 4, title: "Printing", content: <Editing /> },
    { id: 5, title: "Closure", content: <Closure /> }
];

export default function OrderTracking() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);

    return (
        <div className=" p-6">
            <div className="py-4 p-5 flex items-center justify-between mb-4 shadow-md rounded-2xl">
                <button className="flex items-center gap-2 text-[#892580] text-sm font-semibold"
                    onClick={() => router.back()} >
                    <ArrowLeft size={18} /> #123456790
                </button>
                <div className="flex items-center gap-4">
                    <div className="flex items-center p-1 rounded-full border-4 border-pink text-white bg-[#892580] text-sm">

                        Ongoing
                    </div>

                    <div className=" flex gap-4 text-[#F48003] font-semibold items-center border-l border-gray-300 pl-4">
                        <HelpCircle size={20} className="text-white-500 bg-Orange cursor-pointer " />
                        Support
                    </div>

                </div>
            </div>
            <div className="mt-5 w-full bg-white-100 rounded-lg shadow">
                <div className="relative flex items-center  w-full ">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative flex flex-col items-center cursor-pointer  w-full mt-5">
                            {index > 0 && (
                                <div className={`absolute top-5 left-0 right-0 h-1 transform -translate-x-1/2 ${activeStep >= step.id ? "bg-600 bg-[#892580]" : "bg-gray-300"}`} />
                            )}
                            <div
                                className={`z-10 w-10 h-10 flex items-center justify-center rounded-full text-white text-sm font-semibold ${activeStep >= step.id ? "bg-600 bg-[#892580]" : "bg-gray-300"
                                    }`}
                                onClick={() => setActiveStep(step.id)}
                            >
                                {step.id}
                            </div>
                            <span
                                className={`mt-2 text-sm ${activeStep >= step.id ? "text-600 text-[#892580] font-bold" : "text-gray-500"
                                    }`}
                            >
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-gray-700">{steps.find((step) => step.id === activeStep)?.content}</p>
            </div>
        </div>
    );
}
