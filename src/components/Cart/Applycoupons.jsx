import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CouponPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");

    const handleCouponClick = (code) => {
        setCouponCode(code);
        toast.success(`Coupon "${code}" applied successfully!`);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-grey-50 mt-4 w-full">
            {/* Coupon Box */}
            <div className="border rounded-lg mt-2 w-full">
                <div className="bg-gray-100 text-center font-semibold text-sm uppercase tracking-wider border-b rounded-t w-full">
                    Coupons
                </div>

                {/* Coupon Input Section */}
                <div className="flex items-center m-3 border rounded-full px-3 py-2 bg-white">
                    <input
                        type="text"
                        placeholder="Apply Coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 text-gray-600 text-sm focus:outline-none border-none"
                    />
                    <button
                        className="text-[#892580] font-semibold text-sm"
                        onClick={() => setIsOpen(true)}
                    >
                        APPLY
                    </button>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-end"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white w-full md:w-1/3 max-h-full overflow-y-auto p-6 shadow-lg rounded-l-lg transform transition-transform duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Promo Coupons</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-black-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Input showing selected coupon */}
                        <div className="flex mb-4 border rounded-lg overflow-hidden">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full px-3 py-2 border-none focus:outline-none"
                            />
                        </div>

                        {/* Coupon List */}
                        <div className="space-y-4">
                            {["ALOKA500", "SAVE20", "DISCOUNT10", "NEWUSER100", "FESTIVE30"].map((code, i) => (
                                <div key={i} className="border-b pb-2">
                                    <p className="text-xs font-semibold">{code}</p>
                                    <p className="text-sm font-medium">
                                        Get amazing cashback with {code}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Cashback will be credited to your wallet.
                                    </p>
                                    <button
                                        className="mt-2 px-3 py-1 border border-[#892580] text-[#892580] rounded-lg hover:bg-purple-100"
                                        onClick={() => handleCouponClick(code)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default CouponPopup;
