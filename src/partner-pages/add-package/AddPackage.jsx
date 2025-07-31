"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { ImageIcon, Loader2, MoreVertical, Plus } from "lucide-react";
import { RefreshCw, X, ChevronDown, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPackages, createPackage, updatePackage, deletePackage as deletePackageService } from "../../services/Packages/packageService";
import { fetchEquipments } from "@/services/Equipment/equipment.service";
import { fetchPartnerServices } from "@/services/PartnerService/studio.service";
import { showToast } from "@/components/Toast/Toast";
const AddPackages = () => {
    const queryClient = useQueryClient();
    // Query to fetch services with error handling
    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: fetchPartnerServices,
        // select: (data) => data?.data || [],
    });
    // Fetch equipment with TanStack Query
    const {
        data: equipmentList = [],
        isLoading: isLoadingEquipment,
    } = useQuery({
        queryKey: ["equipment"],
        queryFn: fetchEquipments,
        select: (data) => data?.data || [],
    });

    
    // Query for fetching packages
    const { data: packagesData = [], isLoading, isError } = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages
    });

    // Mutation for creating a new package
    const createPackageMutation = useMutation({
        mutationFn: createPackage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            setIsModalOpen(false);
            setModalData({
                selectedEquipments: [],
                selectedServices: []
            });
            setNewPackageImagePreview(null);
        }
    });

    // Mutation for updating an existing package
    const updatePackageMutation = useMutation({
        mutationFn: updatePackage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            setIsModalOpen(false);
            setModalData({
                selectedEquipments: [],
                selectedServices: []
            });
            setEditPackageImagePreview(null);
        }
    });

    // Mutation for deleting a package
    const deletePackageMutation = useMutation({
        mutationFn: deletePackageService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        }
    });

    const isMutating =
        createPackageMutation.isPending ||
        updatePackageMutation.isPending ||
        deletePackageMutation.isPending;

    const [showMenu, setShowMenu] = useState(null);
    const [modalData, setModalData] = useState({
        selectedEquipments: [],
        selectedServices: []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editPackageImagePreview, setEditPackageImagePreview] = useState(null);
    const [newPackageImagePreview, setNewPackageImagePreview] = useState(null);
    
    // States for dropdown toggles
    const [equipmentDropdownOpen, setEquipmentDropdownOpen] = useState(false);
    const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
    
    // Refs for closing dropdowns when clicking outside
    const equipmentDropdownRef = useRef(null);
    const serviceDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (equipmentDropdownRef.current && !equipmentDropdownRef.current.contains(event.target)) {
                setEquipmentDropdownOpen(false);
            }
            if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
                setServiceDropdownOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const openEditModal = (pkg) => {
        // Map the equipment IDs for the multi-select
        const selectedEquipmentIds = pkg?.equipments?.map(equip => equip?._id) || [];
        
        // Map the service IDs for the multi-select
        const selectedServiceIds = pkg?.services?.map(service => service?._id) || [];

        setModalData({ 
            ...pkg, 
            selectedEquipments: selectedEquipmentIds,
            selectedServices: selectedServiceIds 
        });
        
        // Set the image preview if the package has an image
     
        if (pkg?.photo) {
            
            setEditPackageImagePreview(pkg?.photo);
        } else {
            setEditPackageImagePreview(null);
        }
        
        setIsEditMode(true);
        setIsModalOpen(true);
        setShowMenu(null);
    };

    const deletePackage = (id) => {
        deletePackageMutation.mutate(id);
        setShowMenu(null);
    };

    const handleAddOrEditPackage = () => {
        // Prepare form data for API
        const formData = new FormData();
        
        // Add all text fields
        Object.keys(modalData).forEach(key => {
            if (key !== 'imageFile' && key !== 'equipments' && key !== 'selectedEquipments' && key !== 'selectedServices') {
                formData?.append(key, modalData[key]);
            }
        });
        
        // Add image file if exists
        if (modalData?.imageFile) {
            formData?.append('image', modalData?.imageFile);
        }
        
        // Add selected equipments
        if (modalData?.selectedEquipments && modalData?.selectedEquipments?.length > 0) {
            formData?.append('equipments', JSON.stringify(modalData?.selectedEquipments));
        }
        
        // Add selected services
        if (modalData?.selectedServices && modalData?.selectedServices?.length > 0) {
            formData?.append('services', JSON.stringify(modalData?.selectedServices));
        }
        
        if (isEditMode) {
            updatePackageMutation.mutate({ id: modalData?._id, data: formData });
        } else {
            createPackageMutation.mutate(formData);
        }
    };

    // Toggle equipment selection
    const handleEquipmentToggle = (equipmentId) => {
        const currentEquipments = modalData?.selectedEquipments || [];
        let updatedEquipments;
        
        if (currentEquipments?.includes(equipmentId)) {
            // Remove if already selected
            updatedEquipments = currentEquipments?.filter(id => id !== equipmentId);
        } else {
            // Add if not selected
            updatedEquipments = [...currentEquipments, equipmentId];
        }
        
        setModalData({ ...modalData, selectedEquipments: updatedEquipments });
    };

    // Toggle service selection
    const handleServiceToggle = (serviceId) => {
        const currentServices = modalData?.selectedServices || [];
        let updatedServices;
        
        if (currentServices.includes(serviceId)) {
            // Remove if already selected
            updatedServices = currentServices.filter(id => id !== serviceId);
        } else {
            // Add if not selected
            updatedServices = [...currentServices, serviceId];
        }
        
        setModalData({ ...modalData, selectedServices: updatedServices });
    };

    // Remove equipment by ID
    const removeEquipment = (equipmentId) => {
        setModalData({
            ...modalData,
            selectedEquipments: modalData?.selectedEquipments?.filter(id => id !== equipmentId)
        });
    };

    // Remove service by ID
    const removeService = (serviceId) => {
        setModalData({
            ...modalData,
            selectedServices: modalData?.selectedServices.filter(id => id !== serviceId)
        });
    };

    // Clean up object URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (newPackageImagePreview && newPackageImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(newPackageImagePreview);
            }
            if (editPackageImagePreview && editPackageImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(editPackageImagePreview);
            }
        };
    }, [newPackageImagePreview, editPackageImagePreview]);

    const handleImageChange = (e, isEdit) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showToast("File size should not exceed 5MB","error");
            return;
        }
        
        // Revoke previous object URL if exists
        if (isEdit && editPackageImagePreview && editPackageImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editPackageImagePreview);
        } else if (!isEdit && newPackageImagePreview && newPackageImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(newPackageImagePreview);
        }
        
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        
        if (isEdit) {
            setEditPackageImagePreview(previewUrl);
            setModalData({ ...modalData, imageFile: file });
        } else {
            setNewPackageImagePreview(previewUrl);
            setModalData({ ...modalData, imageFile: file });
        }
    };

    // Reset form when opening a new package modal
    const openNewPackageModal = () => {
        setModalData({
            selectedEquipments: [],
            selectedServices: []
        });
        setIsEditMode(false);
        setIsModalOpen(true);
        setNewPackageImagePreview(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4 mt-6">
                <h2 className="text-xl font-bold">Packages</h2>
                <button
                    onClick={openNewPackageModal}
                    className="flex items-center gap-2 text-[#892580] px-4 font-semibold py-2 rounded-xl hover:bg-gray-100 transition"
                    >
                    <Plus className="w-5 h-5" />   Add Packages
                </button>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center items-center mx-auto">     
                    <Loader2 className="w-8 h-8 text-[#892580] animate-spin" />
                </div>
            ) : isError && !packagesData?.data ? (
                <div className="text-center py-10 text-red-500">Error loading packages</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {packagesData?.data?.map((pkg) => (
                        <div
                            key={pkg?._id}
                            className="border rounded-xl p-4 shadow hover:shadow-md transition relative"
                        >
                            <div className="absolute right-4 top-4 cursor-pointer">
                                <MoreVertical 
                                    onClick={() => setShowMenu(showMenu === pkg?._id ? null : pkg?._id)} 
                                    className="bg-white border p-1 rounded-full shadow w-6 h-6" 
                                />

                                {showMenu === pkg?._id && (
                                    <div className="absolute bg-white shadow rounded-lg right-0 mt-2 z-10 p-2 w-28">
                                        <p
                                            onClick={() => openEditModal(pkg)}
                                            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            Edit
                                        </p>
                                        <p
                                            onClick={() => deletePackage(pkg?._id)}
                                            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg text-red-500"
                                        >
                                            Delete
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Package Image */}
                            {pkg?.image && (
                                <div className="mb-3">
                                    <img 
                                        src={pkg?.image} 
                                        alt={pkg?.name}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            
                            <div className="text-[#892580] text-lg font-bold">₹ {pkg?.price}</div>
                            <h4 className="font-semibold mt-1">{pkg?.name}</h4>
                            <div className="text-gray-500 text-sm mt-2">{pkg?.description}</div>
                            
                            {/* Equipment section */}
                            {pkg?.equipments && pkg?.equipments?.length > 0 && (
                                <div>
                                    <div className="mt-3 text-gray-700 font-semibold">Equipments</div>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {pkg?.equipments?.map((equip, i) => (
                                            <div key={i} className="flex items-center bg-gray-100 rounded-lg p-1">
                                                <img
                                                    src={equip?.photo}
                                                    alt={equip?.name || "equipment"}
                                                    className="w-8 h-8 object-cover rounded-lg"
                                                />
                                                {/* <span className="text-xs ml-1 mr-1">{equip?.name || "Equipment"}</span> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Services section */}
                            {/* {pkg?.services && pkg?.services.length > 0 && (
                                <div>
                                    <div className="mt-3 text-gray-700 font-semibold">Services</div>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {pkg?.services.map((service, i) => (
                                            <div key={i} className="bg-gray-100 rounded-lg py-1 px-2 text-sm">
                                                {service.name || "Service"}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Empty state */}
            {!isLoading && !isMutating && packagesData?.data?.length === 0 && (
                <div className="text-center py-10">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No packages found
                    </h3>
                    <p className="mt-1 text-gray-500">
                        Get started by adding some packages.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={openNewPackageModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#892580] hover:bg-[#6d1d66]"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Packages
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-[90%] max-w-5xl shadow-xl relative overflow-y-auto" style={{ height: "90%" }}>
                        <IoClose
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-2xl cursor-pointer text-red-500"
                        />
                        <h2 className="text-2xl font-bold text-center mb-1">
                            {isEditMode ? "Edit Package" : "New Package"}
                        </h2>
                        <p className="text-center text-gray-400 mb-4">
                            Please fill the fields below
                        </p>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <p className="text-semibold text-gray-700 mb-2">Image</p>
                            {(isEditMode ? editPackageImagePreview : newPackageImagePreview) ? (
                                <div className="relative mb-3">
                                    <div className="flex items-center justify-center h-32 bg-gray-100 rounded-xl overflow-hidden">
                                        <img 
                                            src={isEditMode ? editPackageImagePreview : newPackageImagePreview} 
                                            alt="Package preview" 
                                            className="h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex mt-2 gap-2 justify-end">
                                        <button
                                            onClick={() => {
                                                document.getElementById(isEditMode ? 'edit-image-input' : 'new-image-input').click();
                                            }}
                                            className="bg-gray-200 text-gray-700 rounded-full p-1 hover:bg-gray-300"
                                            title="Change image"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (isEditMode) {
                                                    if (editPackageImagePreview && editPackageImagePreview.startsWith('blob:')) {
                                                        URL.revokeObjectURL(editPackageImagePreview);
                                                    }
                                                    setEditPackageImagePreview(null);
                                                } else {
                                                    if (newPackageImagePreview && newPackageImagePreview.startsWith('blob:')) {
                                                        URL.revokeObjectURL(newPackageImagePreview);
                                                    }
                                                    setNewPackageImagePreview(null);
                                                }
                                                setModalData({ ...modalData, imageFile: null });
                                            }}
                                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            title="Remove image"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <input
                                        id={isEditMode ? 'edit-image-input' : 'new-image-input'}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, isEditMode)}
                                    />
                                </div>
                            ) : (
                                <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-gray-500 cursor-pointer mb-4">
                                    <ImageIcon className="w-12 h-12 mb-2 text-[#892580]" />
                                    <p className="text-sm">Drop your files here or <span className="text-[#892580]">browse</span></p>
                                    <p className="text-xs text-gray-400 mt-1">Maximum size: 5MB</p>
                                    <input
                                        id={isEditMode ? 'edit-image-input' : 'new-image-input'}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, isEditMode)}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Name and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter package name"
                                    value={modalData?.name || ""}
                                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                    className="border p-3 rounded-xl w-full mb-4"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-1 font-medium">Price</label>
                                <input
                                    type="text"
                                    placeholder="₹ 0.00"
                                    value={modalData?.price || ""}
                                    onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                                    className="border p-3 rounded-xl w-full"
                                />
                            </div>
                        </div>

                        {/* Multi-select dropdown for Equipment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div ref={equipmentDropdownRef} className="relative">
                                <label className="block text-gray-600 mb-1 font-medium">Select Equipment (Multiple)</label>
                                <div 
                                    className="border p-3 rounded-xl flex justify-between items-center cursor-pointer"
                                    onClick={() => setEquipmentDropdownOpen(!equipmentDropdownOpen)}
                                >
                                    <span className={`${modalData?.selectedEquipments?.length ? 'text-black' : 'text-gray-400'}`}>
                                        {modalData?.selectedEquipments?.length 
                                            ? `${modalData?.selectedEquipments?.length} equipment${modalData?.selectedEquipments?.length !== 1 ? 's' : ''} selected` 
                                            : "Select equipment"}
                                    </span>
                                    <ChevronDown />
                                </div>
                                
                                {equipmentDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
                                        {isLoadingEquipment ? (
                                            <div className="p-3 text-center">
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                                <p className="text-sm text-gray-500 mt-1">Loading equipment...</p>
                                            </div>
                                        ) : equipmentList?.length === 0 ? (
                                            <div className="p-3 text-center text-gray-500">No equipment available</div>
                                        ) : (
                                            equipmentList?.map(equipment => (
                                                <div 
                                                    key={equipment?._id} 
                                                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleEquipmentToggle(equipment?._id)}
                                                >
                                                    <div className="flex items-center flex-grow">
                                                        <img 
                                                            src={equipment?.photo} 
                                                            alt={equipment?.name} 
                                                            className="w-8 h-8 object-cover rounded-lg mr-2" 
                                                        />
                                                        <span>{equipment?.name}</span>
                                                    </div>
                                                    {modalData?.selectedEquipments?.includes(equipment?._id) && (
                                                        <Check className="text-[#892580] w-5 h-5" />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Multi-select dropdown for Services */}
                            <div ref={serviceDropdownRef} className="relative">
                                <label className="block text-gray-600 mb-1 font-medium">Select Services (Multiple)</label>
                                <div 
                                    className="border p-3 rounded-xl flex justify-between items-center cursor-pointer"
                                    onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                                >
                                    <span className={`${modalData?.selectedServices?.length ? 'text-black' : 'text-gray-400'}`}>
                                        {modalData?.selectedServices?.length 
                                            ? `${modalData?.selectedServices.length} service${modalData?.selectedServices.length !== 1 ? 's' : ''} selected` 
                                            : "Select service"}
                                    </span>
                                    <ChevronDown />
                                </div>
                                
                                {serviceDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
                                        {!services?.data ? (
                                            <div className="p-3 text-center">
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                                <p className="text-sm text-gray-500 mt-1">Loading services...</p>
                                            </div>
                                        ) : services.data?.length === 0 ? (
                                            <div className="p-3 text-center text-gray-500">No services available</div>
                                        ) : (
                                            services.data?.map(service => (
                                                <div 
                                                    key={service._id} 
                                                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleServiceToggle(service._id)}
                                                >
                                                    <span className="flex-grow">{service.name}</span>
                                                    {modalData?.selectedServices?.includes(service._id) && (
                                                        <Check className="text-[#892580] w-5 h-5" />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected equipments display */}
                        {modalData?.selectedEquipments?.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-gray-600 mb-2 font-medium">Selected Equipments</label>
                                <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-gray-50">
                                    {modalData?.selectedEquipments?.map(eqId => {
                                        const equipment = equipmentList.find(e => e._id === eqId);
                                        return equipment ? (
                                            <div key={eqId} className="flex items-center bg-white rounded-lg p-1 pr-2 border shadow-sm">
                                                <img src={equipment.photo} alt={equipment.name} className="w-6 h-6 object-cover rounded-md mr-1" />
                                                <span className="text-sm">{equipment.name}</span>
                                                <button
                                                    onClick={() => removeEquipment(eqId)}
                                                    className="ml-1 text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Selected services display */}
                        {modalData?.selectedServices?.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-gray-600 mb-2 font-medium">Selected Services</label>
                                <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-gray-50">
                                    {modalData?.selectedServices.map(svcId => {
                                        const service = services?.data?.find(s => s._id === svcId);
                                        return service ? (
                                            <div key={svcId} className="flex items-center bg-white rounded-lg p-1 pr-2 border shadow-sm">
                                                <span className="text-sm">{service.name}</span>
                                                <button
                                                    onClick={() => removeService(svcId)}
                                                    className="ml-1 text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mt-4">
                            <label className="block text-gray-600 mb-2 font-medium">Description</label>
                            <div className="border rounded-xl p-3">
                                <div className="flex gap-2 mb-2 items-center text-gray-600">
                                    <select className="border rounded px-2 py-1 text-sm">
                                        <option>Arial</option>
                                        <option>Roboto</option>
                                        <option>Times</option>
                                    </select>
                                    <button className="text-xl font-bold">B</button>
                                    <button className="text-xl italic">I</button>
                                    <button className="underline text-xl">U</button>
                                    <span className="w-4 h-4 bg-[#892580] rounded border"></span>
                                </div>
                                <textarea
                                    placeholder="Enter description"
                                    value={modalData?.description || ""}
                                    onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                    className="w-full border p-3 rounded-xl h-28 resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full md:w-1/2 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                                disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrEditPackage}
                                className="w-full md:w-1/2 py-3 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66]"
                                disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                            >
                                {(createPackageMutation.isPending || updatePackageMutation.isPending) ? 
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </div> : 
                                    (isEditMode ? "Update Package" : "Add Package")
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPackages;