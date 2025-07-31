"use client";
import { useState, useEffect } from "react";
import Initiation from "../../../../partner-pages/Book-Id-Partner/Initiation";
import Content from "../../../../partner-pages/Book-Id-Partner/Content";
import Editing from "../../../../partner-pages/Book-Id-Partner/Editing";
import Closure from "../../../../partner-pages/Book-Id-Partner/Closure";
import Printing from "../../../../partner-pages/Book-Id-Partner/Printing";
import { 
    ArrowLeft, 
    HelpCircle, 
    CheckCircle, 
    Circle, 
    Clock,
    Loader2,
    AlertCircle,
    Workflow,
    Star,
    Camera,
    Edit3,
    Printer,
    Archive
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getBookingById } from "@/services/Booking/partner.bookings.service";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function OrderTracking() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    let role;
    const userRole = useSelector(state => state?.auth?.role);
    if (userRole === "user") {
        role = "user";
    } else if (userRole === "studio" || userRole === "freelancer") {
        role = "partner";
    }


    // Function to get step number from workflow status
    const getStepFromWorkflowStatus = (workFlowStatus) => {
        const statusToStep = {
            'initiation': 1,
            'content': 2,
            'editing': 3,
            'printing': 4,
            'closure': 5
        };
        return statusToStep[workFlowStatus] || 1;
    };

    // Function to get localStorage key for this booking
    const getStorageKey = () => `orderTracking_activeStep_${id}`;

    // Initialize activeStep with smart logic
    const [activeStep, setActiveStep] = useState(() => {
        // First try to get from localStorage
        if (typeof window !== 'undefined') {
            const savedStep = localStorage.getItem(getStorageKey());
            if (savedStep) {
                return parseInt(savedStep, 10);
            }
        }
        return 1; // Default fallback
    });

    const { data: bookingData, isLoading, isError, error } = useQuery({
        queryFn: () => getBookingById(id),
        queryKey: ["bookingById", id],
        enabled: !!id,
        select: (data) => data?.data,
    });

    // Update activeStep when booking data loads or changes
    useEffect(() => {
        if (bookingData?.workFlowStatus) {
            // Get saved step from localStorage
            const savedStep = typeof window !== 'undefined' 
                ? parseInt(localStorage.getItem(getStorageKey()) || '0', 10)
                : 0;

            const workflowStep = getStepFromWorkflowStatus(bookingData.workFlowStatus);


            if (savedStep > 0) {
                // If we have a saved step, use it (user's navigation takes priority)
                if (savedStep !== activeStep) {
                    setActiveStep(savedStep);
                }
            } else {
                // Only use workflow step if no saved step exists
                if (workflowStep !== activeStep) {
                    setActiveStep(workflowStep);
                }
            }
        }
    }, [bookingData?.workFlowStatus, id]);

    // Enhanced setActiveStep that persists to localStorage
    const handleSetActiveStep = (step) => {
        setActiveStep(step);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(getStorageKey(), step.toString());
            

        }
    };

    // Clean up localStorage when component unmounts or booking changes
    useEffect(() => {
        return () => {
            // Optional: Clean up old localStorage entries
            if (typeof window !== 'undefined') {
                // You could implement cleanup logic here if needed
            }
        };
    }, [id]);

    // Get step icon
    const getStepIcon = (stepId, isActive, isCompleted) => {
        const iconProps = {
            size: isActive ? 24 : 20,
            className: isCompleted ? "text-white" : isActive ? "text-white" : "text-gray-400"
        };

        switch (stepId) {
            case 1: return <Star {...iconProps} />;
            case 2: return <Camera {...iconProps} />;
            case 3: return <Edit3 {...iconProps} />;
            case 4: return <Printer {...iconProps} />;
            case 5: return <Archive {...iconProps} />;
            default: return <Circle {...iconProps} />;
        }
    };

    const steps = [
        {
            id: 1,
            title: "Initiation",
            description: "Project kickoff and planning",
            content: <Initiation role={role} bookingData={bookingData} setActiveStep={handleSetActiveStep} />,
        },
        {
            id: 2,
            title: "Content",
            description: "Media upload and organization",
            content: <Content role={role} bookingData={bookingData} setActiveStep={handleSetActiveStep} />,
        },
        {
            id: 3,
            title: "Editing",
            description: "Review and edit content",
            content: <Editing role={role} bookingData={bookingData} setActiveStep={handleSetActiveStep} />,
        },
        {
            id: 4,
            title: "Printing",
            description: "Final selection and approval",
            content: <Printing role={role} bookingData={bookingData} setActiveStep={handleSetActiveStep} />,
        },
        {
            id: 5,
            title: "Closure",
            description: "Project completion",
            content: <Closure role={role} bookingData={bookingData} setActiveStep={handleSetActiveStep} />,
        },
    ];

    // Enhanced step validation - user can only go to available steps
    const isStepAccessible = (stepId) => {
        if (!bookingData?.workFlowStatus) return stepId === 1;
        
        const currentWorkflowStep = getStepFromWorkflowStatus(bookingData.workFlowStatus);
        
        // Get saved step from localStorage
        const savedStep = typeof window !== 'undefined' 
            ? parseInt(localStorage.getItem(getStorageKey()) || '0', 10)
            : 0;
        
        // User can access up to the highest of: workflow step or previously saved step
        const maxAccessibleStep = Math.max(currentWorkflowStep, savedStep || 1);
        
        return stepId <= maxAccessibleStep;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
                <div className=" mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-[#892580]" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading booking details...</h3>
                            <p className="text-gray-500">Please wait while we fetch your project information</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 p-6">
                <div className=" mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 mx-auto mb-6 text-red-500" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading booking data</h3>
                            <p className="text-gray-500 mb-4">Please try again or contact support if the issue persists.</p>
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 max-w-md mx-auto">
                                    {error.message}
                                </div>
                            )}
                            <button 
                                onClick={() => router.back()}
                                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
            <div className=" mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-white px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    className="bg-[#892580] p-2 rounded-lg transition-colors"
                                    onClick={() => router.back()}
                                >
                                    <ArrowLeft size={20} className="text-white" />
                                </button>
                  
                                <div>
                                    <h1 className="text-lg font-bold text-[#892580]">
                                        {bookingData?.customBookingId || 'Project Workflow'}
                                    </h1>
                                    <p className="text-gray-500 text-xs">
                                        Track your project progress through each stage
                                    </p>

                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="bg-[#892580] border border-white/30 rounded-xl px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-white font-medium">Ongoing</span>
                                    </div>
                                </div>
                                
                                <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-white font-medium transition-colors">
                                    <HelpCircle size={18} />
                                    <span>Support</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="bg-transparent px-8 pt-3">
                    {/* Desktop Stepper */}
                    <div className="hidden md:block">
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>
                            <div 
                                className="absolute top-6 left-0 h-0.5 bg-[#892580] transition-all duration-500"
                                style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            <div className="relative flex justify-between">
                                {steps.map((step, index) => {
                                    const isActive = step.id === activeStep;
                                    const isCompleted = step.id < activeStep;
                                    const isAccessible = isStepAccessible(step.id);
                                    
                                    return (
                                        <div 
                                            key={step.id} 
                                            className={`flex flex-col items-center group ${
                                                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                                            }`}
                                            onClick={() => isAccessible && handleSetActiveStep(step.id)}
                                        >
                                            {/* Step Circle */}
                                            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                isCompleted 
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-md' 
                                                    : isActive 
                                                        ? 'bg-[#892580] shadow-lg' 
                                                        : isAccessible
                                                            ? 'bg-gray-200 group-hover:bg-gray-300'
                                                            : 'bg-gray-100'
                                            }`}>
                                                {isCompleted ? (
                                                    <CheckCircle size={18} className="text-white" />
                                                ) : (
                                                    getStepIcon(step.id, isActive, isCompleted)
                                                )}
                                            </div>

                                            {/* Step Title */}
                                            <div className="mt-3 text-center">
                                                <h3 className={`text-sm font-medium transition-colors ${
                                                    isCompleted 
                                                        ? 'text-green-600' 
                                                        : isActive 
                                                            ? 'text-[#892580]' 
                                                            : isAccessible
                                                                ? 'text-gray-500'
                                                                : 'text-gray-400'
                                                }`}>
                                                    {step.title}
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Stepper */}
                    <div className="md:hidden space-y-4">
                        {steps.map((step, index) => {
                            const isActive = step.id === activeStep;
                            const isCompleted = step.id < activeStep;
                            const isAccessible = isStepAccessible(step.id);
                            
                            return (
                                <div 
                                    key={step.id}
                                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200' 
                                            : isCompleted 
                                                ? 'bg-green-50 border-2 border-green-200'
                                                : isAccessible
                                                    ? 'bg-gray-50 border border-gray-200'
                                                    : 'bg-gray-50 border border-gray-200 opacity-60'
                                    } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    onClick={() => isAccessible && handleSetActiveStep(step.id)}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        isCompleted 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                            : isActive 
                                                ? 'bg-[#892580]' 
                                                : isAccessible
                                                    ? 'bg-gray-200'
                                                    : 'bg-gray-100'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle size={20} className="text-white" />
                                        ) : (
                                            getStepIcon(step.id, isActive, isCompleted)
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${
                                            isCompleted 
                                                ? 'text-green-600' 
                                                : isActive 
                                                    ? 'text-[#892580]' 
                                                    : isAccessible
                                                        ? 'text-gray-600'
                                                        : 'text-gray-400'
                                        }`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{step.description}</p>
                                    </div>
                                    
                                    {isActive && (
                                        <div className="px-3 py-1 bg-[#892580] text-white rounded-full text-xs font-medium">
                                            Current
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Section */}
                <div>
                    {steps.find((step) => step.id === activeStep)?.content}
                </div>
            </div>
        </div>
    );
}