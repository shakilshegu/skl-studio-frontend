"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { MoreVertical, Plus, ImageIcon, Pencil, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addEquipment,
  deleteEquipment,
  fetchEquipments,
  updateEquipment,
} from "@/services/Equipment/equipment.service";
import { showToast } from "@/components/Toast/Toast";


const AddEquipment = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [equipmentData, setEquipmentData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  


  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Function to handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size should not exceed 5MB","error");
      return;
    }

    // Revoke previous object URL if exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setEquipmentData({ ...equipmentData, imageFile: file });
  };

  // Fetch equipment with TanStack Query
  const {
    data: equipments,
    isLoading: isLoadingEquipment,
    error: fetchError,
  } = useQuery({
    queryKey: ["equipment"],
    queryFn: fetchEquipments,
  });

  const equipmentList = equipments?.data
  

  // Add equipment mutation
  const addMutation = useMutation({
    mutationFn: addEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });

      closeModal();
    },
    onError: (error) => {

    },
  });

  // Update equipment mutation
  const updateMutation = useMutation({
    mutationFn: updateEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });

      closeModal();
    },
    onError: (error) => {

    },
  });

  // Delete equipment mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });

    },
    onError: (error) => {

    },
  });

  // Reset form and close modal
  const closeModal = () => {
    setEquipmentData({
      id: null,
      name: "",
      price: "",
      description: "",
      imageFile: null,
    });
    setImagePreview(null);
    setShowModal(false);
  };

  // Open modal in "add" mode
  const openAddModal = () => {
    setModalMode("add");
    setEquipmentData({
      id: null,
      name: "",
      price: "",
      description: "", // This was previously "desc", changing to "description" for consistency
      imageFile: null,
    });
    setImagePreview(null);
    setShowModal(true);
  };

  // Open modal in "edit" mode
  const openEditModal = (item) => {
    setModalMode("edit");
    setEquipmentData({
      id: item?._id || item?._id,
      name: item?.name,
      description: item?.description || item?.desc, // Handle both field names
      price: item?.price,
      imageFile: null,
    });
    setImagePreview(item?.photo || item?.img);
    setShowModal(true);
    setShowMenu(null);
  };

  // Handle saving equipment (add or update)
  const handleSaveEquipment = () => {
    // Validate required fields
    if (
      !equipmentData.name ||
      !equipmentData.price
    ) {

      return;
    }

    const formData = new FormData();

    // Append text data
    if (modalMode === "edit") {
      formData.append("id", equipmentData._id);
    }
    
    formData.append("name", equipmentData.name);
    formData.append("price", equipmentData.price);
    formData.append("desc", equipmentData.description); // Make sure this matches the field name expected by the backend

    // Append image if exists
    if (equipmentData.imageFile) {
      formData.append("image", equipmentData.imageFile);
    }

    if (modalMode === "edit") {
      
      updateMutation.mutate({id:equipmentData.id,data:formData});
    } else {
      addMutation.mutate(formData);
    }
  };

  // Delete equipment
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      deleteMutation.mutate(id);
    }
  };

  // Handle dropdown toggle with stop propagation
  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setShowMenu(showMenu === id ? null : id);
  };

  // Check if any mutation is loading
  const isMutating =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipmentData({ ...equipmentData, [name]: value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-6">
        <h1 className="text-xl font-bold">Equipments</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 text-[#892580] px-4 font-semibold py-2 rounded-xl hover:bg-gray-100 transition"
          disabled={isMutating}
        >
          <Plus className="w-5 h-5" /> Add Equipment
        </button>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          Failed to load equipment. Please try refreshing the page.
        </div>
      )}


      {/* Loading and error handling */}
      {isLoadingEquipment ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-[#892580] animate-spin" />
        </div>
      ) : fetchError ? (
        <div className="text-center text-red-500 py-4">
          Failed to load services. Please try again later.
        </div>
      ) : (
        <>
          {/* Equipment grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList?.map((item) => (
              <div
                key={item?._id || item?._id}
                className="bg-white shadow rounded-xl overflow-hidden relative"
              >
                <img
                  src={item?.photo || item?.img}
                  alt={item?.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-[#150513] font-medium mb-2 line-clamp-2">
                    {item?.name}
                  </div>
                  <p className="text-gray-500 mb-2 text-sm line-clamp-2">
                    {item?.description || item?.desc}
                  </p>
                  <p className="text-[#892580] font-bold">₹ {item?.price}/hr</p>
                </div>
                <div className="absolute top-3 right-0 mr-2">
                  <button onClick={(e) => toggleDropdown(e, item?._id || item?._id)}>
                    <MoreVertical className="bg-white border p-1 rounded-full shadow w-6 h-6" />
                  </button>
                  {showMenu === (item?._id || item?._id) && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow w-28 z-10">
                      <button
                        onClick={() => openEditModal(item)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item?._id || item?._id)}
                        disabled={deleteMutation.isPending}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg w-full text-left"
                      >
                        {deleteMutation.isPending &&
                        deleteMutation.variables === (item?._id || item?._id)
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {!isLoadingEquipment && !isMutating && equipmentList?.length === 0 && (
            <div className="text-center py-10">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No equipment found
              </h3>
              <p className="mt-1 text-gray-500">
                Get started by adding some equipment.
              </p>
              <div className="mt-6">
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#892580] hover:bg-[#6d1d66]"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Equipment
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Unified Modal for Add and Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[90%] max-w-5xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <IoClose
              onClick={closeModal}
              className="absolute top-5 right-5 text-3xl cursor-pointer text-gray-500 hover:text-red-500"
              style={{ right: "20px", left: "auto" }}
            />
            <h2 className="text-2xl font-bold text-center mb-1">
              {modalMode === "edit" ? "Edit Equipment" : "Add Equipment"}
            </h2>
            <p className="text-center text-gray-400 mb-6">
              {modalMode === "edit"
                ? "Modify the details below to update the equipment"
                : "Please fill below fields to add new equipment"}
            </p>

            {/* Image upload */}
            <div className="mb-6">
              <p className="text-semibold text-gray-700 mb-2">Image</p>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-gray-500 cursor-pointer mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <ImageIcon className="w-12 h-12 mb-2 text-[#892580]" />
                <p className="text-sm">
                  Drop your files here or{" "}
                  <span className="text-[#892580]">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Maximum size: 5MB</p>
              </label>
              {imagePreview && (
                <div className="relative mb-3">
                  <div className="flex items-center justify-center h-32 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Equipment preview"
                      className="h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/*  Equipment Name, Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="font-medium text-gray-700 mb-1">
                  Equipment Name<span className="text-red-500">*</span>
                </p>
                <input
                  type="text"
                  name="name"
                  value={equipmentData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="border p-3 rounded-xl w-full"
                  required
                />
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">
                  Price<span className="text-red-500">*</span>
                </p>
                <div className="flex items-center border p-3 rounded-xl">
                  <span className="text-gray-500 mr-1">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={equipmentData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="outline-none w-full"
                    required
                  />
                  <span className="text-gray-400 text-sm ml-1">/hr</span>
                </div>
              </div>
            </div>

            {/* Description - Fixed to make it work properly */}
            <div className="mb-6">
              <p className="font-medium text-gray-700 mb-1">Description</p>
              <div className="border rounded-xl p-3">
                <div className="flex gap-2 mb-2 items-center text-gray-600 border-b pb-2">
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
                  name="description"
                  value={equipmentData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full outline-none h-28 pt-2 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={closeModal}
                className="w-full md:w-1/2 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEquipment}
                className="w-full md:w-1/2 py-3 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66]"
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                {addMutation.isPending || updateMutation.isPending
                  ? modalMode === "edit"
                    ? "Saving..."
                    : "Adding..."
                  : modalMode === "edit"
                  ? "Save Changes"
                  : "Add Equipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEquipment;