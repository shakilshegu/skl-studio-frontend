"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { X, MoreVertical, Edit2, Trash2, Loader2, ImageIcon, Plus, PenLine } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Assuming you have these service functions
import { fetchHelpers, addHelper, updateHelper, deleteHelper } from "../../services/Helper/helper.service";
import { showToast } from "@/components/Toast/Toast";

const AddHelpers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [newHelper, setNewHelper] = useState({
        name: "",
        price: "",
        description: "",
    });

    // Get the query client for invalidating queries after mutation
    const queryClient = useQueryClient();

    // Fetch helpers with useQuery
    const { 
        data: helpers = [], 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: ['helpers'],
        queryFn: fetchHelpers,
        select: (data) => data?.data, 
    });
    // Add helper mutation
    const {
        mutate: addHelperMutate,
        isPending: isAdding,
        isError: isAddError,
        error: addError
    } = useMutation({
        mutationFn: addHelper,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['helpers'] });
            // Reset form and close modal
            resetForm();
        },
        onError: (error) => {
            console.error("Failed to add helper:", error);
        }
    });

    // Update helper mutation
    const {
        mutate: updateHelperMutate,
        isPending: isUpdating,
        isError: isUpdateError,
        error: updateError
    } = useMutation({
        mutationFn: (helperData) => updateHelper(helperData),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['helpers'] });
            // Reset form and close modal
            resetForm();
        },
        onError: (error) => {
            console.error("Failed to update helper:", error);
        }
    });

    // Delete helper mutation
    const {
        mutate: deleteHelperMutate,
        isPending: isDeleting,
        isError: isDeleteError,
        error: deleteError,
        variables: deleteId
    } = useMutation({
        mutationFn: (helperId) => deleteHelper(helperId),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['helpers'] });
        },
        onError: (error) => {
            console.error("Failed to delete helper:", error);
        }
    });

    const resetForm = () => {
        setNewHelper({ name: "", price: "", description: "" });
        setIsOpen(false);
        setIsEditMode(false);
    };

    const handleAddHelper = () => {
        // Validate inputs
        if (!newHelper.name || !newHelper.price || !newHelper.description) {
            showToast("Please fill all fields","error");
            return;
        }
        
        if (isEditMode && newHelper._id) {
            // Update existing helper
            updateHelperMutate(newHelper);
        } else {
            // Add new helper
            addHelperMutate(newHelper);
        }
    };

    const handleEdit = (helper) => {
        setNewHelper({ ...helper });
        setIsEditMode(true);
        setIsOpen(true);
        setActiveMenu(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this helper?")) {
            deleteHelperMutate(id);
        }
        setActiveMenu(null);
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setActiveMenu(activeMenu === id ? null : id);
    };

    // Check if any mutation is loading
    const isMutating = isAdding || isUpdating || isDeleting;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only run if there's an active menu
            if (activeMenu !== null) {
                // Check if the click is outside any dropdown menu
                const isOutsideClick = !event.target.closest('.menu-dropdown');
                if (isOutsideClick) {
                    setActiveMenu(null);
                }
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenu]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-6">
                <h2 className="font-bold text-xl">Helpers</h2>
                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setNewHelper({ name: "", price: "", description: "" });
                        setIsOpen(true);
                    }}
                    className="flex items-center gap-2 text-[#892580] px-4 font-semibold py-2 rounded-xl hover:bg-gray-100 transition"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Helper
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center mx-auto">          
                    <Loader2 className="w-8 h-8 text-[#892580] animate-spin" />
                </div>
            ) : isError ? (
                <></>
                // <div className="p-4 text-center text-red-600">Error: {error.message}</div>
            ) : (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                    {helpers?.map((helper) => (
                        <div
                            key={helper?._id}
                            className="border rounded-xl p-4 shadow hover:shadow-md transition relative"
                        >
                            <div className="absolute top-3 right-0 mr-2 menu-dropdown">
                                <button 
                                    onClick={(e) => toggleMenu(e, helper?._id)}
                                    className="relative z-10" // Ensure button is above other elements
                                >
                                    <MoreVertical className="bg-white border p-1 rounded-full shadow w-6 h-6" />
                                </button>
                                {activeMenu === helper?._id && (
                                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow w-28 z-20">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(helper);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(helper?._id);
                                            }}
                                            disabled={isDeleting}
                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                        >
                                            {isDeleting && deleteId === helper?._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-[#892580] font-semibold text-lg mb-2">
                                {helper?.name}
                            </h3>
                            <div className="text-gray-500 text-sm mb-3 line-clamp-2">
                                {helper?.description}
                            </div>
                            <div className="text-[#892580] font-bold">
                                ₹ {helper?.price}{" "}
                                <span className="text-gray-500 font-medium">/hr</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state - FIXED HERE */}
            {!isLoading && !isMutating && helpers?.length === 0 && (
                <div className="text-center py-10 ">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No helpers found
                    </h3>
                    <p className="mt-1 text-gray-500">
                        Get started by adding helpers.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#892580] hover:bg-[#6d1d66]"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Helper
                        </button>
                    </div>
                </div>
            )}

            <Dialog
                open={isOpen}
                onClose={() => resetForm()}
                className="relative z-50"
            >
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 "
                    aria-hidden="true"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white w-full max-w-5xl rounded-2xl p-6 shadow-xl relative">
                        <button
                            onClick={() => resetForm()}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            <X />
                        </button>

                        <Dialog.Title className="text-center text-xl font-semibold">
                            {isEditMode ? "Edit Helper" : "Add Helper"}
                        </Dialog.Title>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Please fill in the fields below to {isEditMode ? "update" : "add"} a helper
                        </p>
                        <hr className="mb-6" />

                        {(isAdding || isUpdating) && (
                            <div className="text-center text-purple-600 mb-4">
                                {isEditMode ? "Updating" : "Adding"} helper...
                            </div>
                        )}
                        
                        {(isAddError || isUpdateError) && (
                            <div className="text-center text-red-600 mb-4">
                                Error: {(addError || updateError)?.message || "Failed to process helper"}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newHelper.name}
                                    onChange={(e) =>
                                        setNewHelper({ ...newHelper, name: e.target.value })
                                    }
                                    placeholder="Enter name"
                                    className="w-full border rounded-xl p-3 focus:outline-purple-600"
                                    disabled={isAdding || isUpdating}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Price</label>
                                <div className="flex items-center border rounded-xl p-3">
                                    <span className="mr-2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        value={newHelper.price}
                                        onChange={(e) =>
                                            setNewHelper({ ...newHelper, price: e.target.value })
                                        }
                                        placeholder="0.00"
                                        className="w-full outline-none"
                                        disabled={isAdding || isUpdating}
                                    />
                                    <span className="ml-2 text-gray-500">/hr</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-1">
                                Description
                            </label>
                            <div className="border rounded-xl p-3">
                                <div className="flex gap-2 mb-2 items-center text-gray-600">
                                    <select className="border rounded px-2 py-1 text-sm" 
                                        disabled={isAdding || isUpdating}>
                                        <option>Arial</option>
                                        <option>Roboto</option>
                                        <option>Times</option>
                                    </select>
                                    <button className="text-xl font-bold" 
                                        disabled={isAdding || isUpdating}>B</button>
                                    <button className="text-xl italic" 
                                        disabled={isAdding || isUpdating}>I</button>
                                    <button className="underline text-xl" 
                                        disabled={isAdding || isUpdating}>U</button>
                                    <span className="w-4 h-4 bg-[#892580] rounded border"></span>
                                </div>
                                <textarea
                                    value={newHelper.description}
                                    onChange={(e) =>
                                        setNewHelper({ ...newHelper, description: e.target.value })
                                    }
                                    placeholder="Enter description"
                                    className="w-full border rounded-xl p-3 h-28 focus:outline-purple-600"
                                    disabled={isAdding || isUpdating}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => resetForm()}
                                className="w-full md:w-1/2 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                                disabled={isAdding || isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddHelper}
                                className={`w-full md:w-1/2 py-3 rounded-xl ${
                                    (isAdding || isUpdating)
                                        ? "bg-purple-300" 
                                        : "bg-[#892580] hover:bg-[#6d1d66]"
                                } text-white`}
                                disabled={isAdding || isUpdating}
                            >
                                {isAdding || isUpdating 
                                    ? (isEditMode ? "Updating..." : "Adding...") 
                                    : (isEditMode ? "Update Helper" : "Add Helper")}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default AddHelpers;