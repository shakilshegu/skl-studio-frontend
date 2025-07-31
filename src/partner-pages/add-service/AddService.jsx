"use client";
import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  X,
  Plus,
  ImageIcon,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addService,
  deleteService,
  fetchPartnerServices,
  updateService,
} from "../../services/PartnerService/studio.service";

const AddService = () => {
  const queryClient = useQueryClient();

  // Query to fetch services with error handling
  const {
    data: services ,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchPartnerServices,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setServiceModal({ isOpen: false });
      resetServiceForm();
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setServiceModal({ isOpen: false });
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowMenu(null);
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  // State management
  const [showMenu, setShowMenu] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [serviceModal, setServiceModal] = useState({
    isOpen: false,
    isEdit: false,
    service: {
      id: null,
      name: "",
      description: "",
      price: "",
      imageFile: null,
    },
    imagePreview: null,
  });

  // Helper function to extract error message
  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    } else if (error?.message) {
      return error.message;
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  };

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (
        serviceModal.imagePreview &&
        serviceModal.imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(serviceModal.imagePreview);
      }
    };
  }, [serviceModal.imagePreview]);

  // Function to handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size should not exceed 5MB");
      return;
    }

    // Revoke previous object URL if exists
    if (
      serviceModal.imagePreview &&
      serviceModal.imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(serviceModal.imagePreview);
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);

    setServiceModal({
      ...serviceModal,
      service: { ...serviceModal.service, imageFile: file },
      imagePreview: previewUrl,
    });
  };

  // Function to handle editing a service
  const handleEdit = (service) => {
    setServiceModal({
      isOpen: true,
      isEdit: true,
      service: {
        id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        imageFile: null,
      },
      imagePreview: service.photo,
    });
    setShowMenu(null);
  };

  // Function to open add modal
  const handleOpenAddModal = () => {
    setServiceModal({
      isOpen: true,
      isEdit: false,
      service: {
        id: null,
        name: "",
        description: "",
        price: "",
        imageFile: null,
      },
      imagePreview: null,
    });
  };

  // Function to handle deleting a service
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  // Reset service form
  const resetServiceForm = () => {
    // Revoke any blob URLs before resetting
    if (
      serviceModal.imagePreview &&
      serviceModal.imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(serviceModal.imagePreview);
    }

    setServiceModal({
      ...serviceModal,
      service: {
        id: null,
        name: "",
        description: "",
        price: "",
        imageFile: null,
      },
      imagePreview: null,
    });
  };

  // Handle service submission (add or update)
  const handleSubmitService = () => {
    const { isEdit, service } = serviceModal;

    if (service.name && service.description && service.price) {
      const formData = new FormData();

      // Append text data
      formData.append("name", service.name);
      formData.append("description", service.description);
      formData.append("price", service.price);

      // Append image file if exists
      if (service.imageFile) {
        formData.append("image", service.imageFile);
      }

      // If editing, include the ID
      if (isEdit) {
        formData.append("id", service.id);
        // updateMutation.mutate(formData);
        updateMutation.mutate({ id: service.id, data: formData });
      } else {
        addMutation.mutate(formData);
      }
    } else {
      setErrorMessage("Please fill all required fields");
    }
  };

  // Handle error display for the main services query
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-[#892580] animate-spin" />
        </div>
      );
    }

    if (services?.data?.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.data.map((service) => (
            <div
              key={service?._id}
              className="bg-white rounded-xl shadow transition relative"
            >
              <img
                src={service?.photo}
                alt="service"
                className="rounded-t-xl w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="font-semibold text-gray-700 truncate mb-2">
                  {service?.name}
                </div>
                <p className="text-gray-500 text-sm mb-2">
                  {service?.description}
                </p>
                <p className="text-[#892580] font-bold">₹ {service?.price}</p>
              </div>
              <div className="absolute top-3 right-2">
                <button
                  onClick={() =>
                    setShowMenu(showMenu === service?._id ? null : service?._id)
                  }
                >
                  <MoreVertical className="w-6 h-6 text-black border rounded-full bg-white p-1" />
                </button>
                {showMenu === service?._id && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow w-28 z-10">
                    <button
                      onClick={() => handleEdit(service)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service?._id)}
                      disabled={deleteMutation.isPending}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg w-full text-left"
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === service?._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Empty state - centered
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center  py-10 px-8 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No services found
          </h3>
          <p className="mt-1 text-gray-500">
            Get started by adding some services.
          </p>
          <div className="mt-6">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#892580] hover:bg-[#6d1d66]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Service
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Is either add or update mutation in progress
  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <div>
      {/* Error message toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center max-w-md animate-fade-in">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{errorMessage}</p>
          <button
            onClick={() => setErrorMessage("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold ">Services</h2>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 text-[#892580] px-4 font-semibold py-2 rounded-xl hover:bg-gray-100 transition"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {renderContent()}
      
      {/* Combined Add/Edit Modal */}
      {serviceModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div
            className="bg-white rounded-xl p-8 w-[90%] max-w-5xl shadow-xl relative overflow-y-auto"
            style={{ maxHeight: "90vh" }}
          >
            {/* Close Button */}
            <button
              onClick={() =>
                setServiceModal({ ...serviceModal, isOpen: false })
              }
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-center text-2xl font-bold text-[#892580] mt-2">
              {serviceModal.isEdit ? "Edit Service" : "New Service"}
            </h2>
            <p className="text-center text-gray-500 mt-1 mb-6 text-sm">
              {serviceModal.isEdit
                ? "Modify the details below to update the service."
                : "Please fill below fields to add new service"}
            </p>
            <div className="border-t mb-6"></div>

            {/* Image Upload */}
            <div className="mb-6">
              <p className="text-semibold text-gray-700 mb-2">Image</p>
              {serviceModal.imagePreview ? (
                <div className="relative mb-3">
                  <div className="flex items-center justify-center h-32 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={serviceModal.imagePreview}
                      alt="Service preview"
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="flex mt-2 gap-2 justify-end">
                    <button
                      onClick={() => {
                        // Just open the file dialog again
                        document.getElementById("service-image-input").click();
                      }}
                      className="bg-gray-200 text-gray-700 rounded-full p-1 hover:bg-gray-300"
                      title="Change image"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          serviceModal.imagePreview &&
                          serviceModal.imagePreview.startsWith("blob:")
                        ) {
                          URL.revokeObjectURL(serviceModal.imagePreview);
                        }
                        setServiceModal({
                          ...serviceModal,
                          imagePreview: null,
                          service: { ...serviceModal.service, imageFile: null },
                        });
                      }}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    id="service-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-gray-500 cursor-pointer mb-4">
                  <ImageIcon className="w-12 h-12 mb-2 text-[#892580]" />
                  <p className="text-sm">
                    Drop your file here or{" "}
                    <span className="text-[#892580]">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum size: 5MB
                  </p>
                  <input
                    id="service-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm mb-1 block text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={serviceModal.service.name}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      service: {
                        ...serviceModal.service,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full border rounded-xl p-3 shadow-sm focus:outline-[#892580]"
                />
              </div>
              <div>
                <label className="text-sm mb-1 block text-gray-700">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={serviceModal.service.price}
                    onChange={(e) =>
                      setServiceModal({
                        ...serviceModal,
                        service: {
                          ...serviceModal.service,
                          price: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded-xl p-3 pl-8 shadow-sm focus:outline-[#892580]"
                  />
                </div>
              </div>
            </div>

            {/* Description Area */}
            <div className="mb-8">
              <label className="text-sm mb-1 block text-gray-700">
                Description
              </label>
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
                  rows="4"
                  value={serviceModal.service.description}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      service: {
                        ...serviceModal.service,
                        description: e.target.value,
                      },
                    })
                  }
                  className="w-full border rounded p-3 text-sm focus:outline-[#892580]"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={() =>
                  setServiceModal({ ...serviceModal, isOpen: false })
                }
                className="w-full md:w-1/2 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitService}
                disabled={
                  isSubmitting ||
                  !serviceModal.service.name ||
                  !serviceModal.service.description ||
                  !serviceModal.service.price
                }
                className="w-full md:w-1/2 py-3 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66] flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {serviceModal.isEdit ? "Saving..." : "Adding..."}
                  </>
                ) : serviceModal.isEdit ? (
                  "Save Changes"
                ) : (
                  "Add Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddService;