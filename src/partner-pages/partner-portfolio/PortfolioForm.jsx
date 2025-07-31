import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, ImageIcon, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPortfolio,
  updatePortfolio,
} from "../../services/Portfolio/portfolio.service";
import GooglePlacesAutocomplete from "../../components/GooglePlacesAutocomplete/GooglePlacesAutocomplete";
import { 
  InputField, 
  SelectField, 
  TextareaField, 
  FileUpload, 
  SubmitButton 
} from "@/components/partner/InputFields/FormFields";
import { showToast } from "@/components/Toast/Toast";

const PortfolioForm = ({ isOpen, onClose, editingIndex, portfolio }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    images: [],
    removedImageUrls: [], // To track removed image URLs
  });

  useEffect(() => {
    // If editing, populate form with portfolio data
    if (portfolio) {
      setFormData({
        title: portfolio.title || "",
        category: portfolio.category || "",
        location: portfolio.location || "",
        description: portfolio.description || "",
        images: portfolio.images || [],
        removedImageUrls: [], // Reset removed URLs when form opens
      });
    } else {
      // Reset form when adding new
      resetForm();
    }
  }, [portfolio]);

  // Add portfolio mutation
  const addMutation = useMutation({
    mutationFn: (formDataToSend) => {
      return addPortfolio(formDataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error("Failed to add portfolio:", error);
      showToast("Failed to add portfolio. Please try again.","error");
    },
  });

  // Update portfolio mutation
  const updateMutation = useMutation({
    mutationFn: (data) => {
      // data is an object with id and formData
      console.log("Inside mutationFn:", data.id);
      return updatePortfolio(data.id, data.formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error("Failed to update portfolio:", error);
      showToast("Failed to update portfolio. Please try again.","error");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploadedFiles = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    const imageToRemove = formData.images[index];
    
    setFormData((prev) => {
      // If it's an existing image with a URL, track it for removal
      if (typeof imageToRemove === 'string') {
        return {
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
          removedImageUrls: [...prev.removedImageUrls, imageToRemove]
        };
      }
      
      // For new file uploads
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      };
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      location: "",
      description: "",
      images: [],
      removedImageUrls: [],
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.location) {
      showToast("Please fill in all required fields.","error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("description", formData.description);

    formData.images.forEach((image) => {
        if (image instanceof File) {
          console.log({
            name: image.name,
            type: image.type,
            size: image.size,
            lastModified: image.lastModified
          });
          formDataToSend.append("images", image);
        } else if (typeof image === 'string') {
          formDataToSend.append("existingImages", image);
        }
      });
    
    // Add removed image URLs to form data for backend to process deletions
    formData.removedImageUrls.forEach(url => {
      formDataToSend.append("removedImageUrls", url);
    });

    if (portfolio) {


      updateMutation.mutate({
        id: portfolio._id,
        formData: formDataToSend
      });
    } else {
      // Adding new portfolio
      addMutation.mutate(formDataToSend);
    }
  };

  // Category options for the select field
  const categoryOptions = [
    { value: "Wedding", label: "Wedding" },
    { value: "Event", label: "Event" }
  ];

  // Convert images to uploadedFiles format for the FileUpload component
  const uploadedFiles = formData.images.map((img, index) => ({
    name: img instanceof File ? img.name : `Image ${index + 1}`,
    size: img instanceof File ? img.size : 0,
    preview: img instanceof File ? URL.createObjectURL(img) : img
  }));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">
            {portfolio ? "Edit Portfolio" : "Add Portfolio"}
          </h2>
          <p className="text-sm text-gray-500">
            Please fill below fields to{" "}
            {portfolio ? "update" : "add"} portfolio
          </p>
        </div>

        <div className="space-y-6">
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Title"
              name="title"
              placeholder="Enter name"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            
            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categoryOptions}
              placeholder="Select category"
              required
            />
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location<span className="text-red-500 ml-1">*</span>
            </label>
            <GooglePlacesAutocomplete
              value={formData.location}
              onChange={(newLocation) => {
                setFormData((prev) => ({
                  ...prev,
                  location: newLocation,
                }));
              }}
              placeholder="Search for a city"
              debounceTime={400}
            />
          </div>

          {/* Description Field */}
          <TextareaField
            label="Description"
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />

          {/* File Upload Component */}
          <FileUpload
            label="Images"
            accept="image/*"
            multiple
            onFileChange={handleFileUpload}
            placeholder="Drop your files here or Browse"
            maxSize="5MB"
            uploadedFiles={uploadedFiles}
            onRemoveFile={(fileNameOrIndex) => {
              // Find the index based on file name or use the index directly
              const index = typeof fileNameOrIndex === 'string' 
                ? uploadedFiles.findIndex(file => file.name === fileNameOrIndex)
                : fileNameOrIndex;
              removeImage(index);
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 gap-4 border-t pt-6">
          <button
            className="w-full py-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            onClick={onClose}
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </button>
          
          <SubmitButton
            loading={addMutation.isPending || updateMutation.isPending}
            loadingText="Processing..."
            onClick={handleSubmit}
            className="w-full"
          >
            {portfolio ? "Update Portfolio" : "Add Portfolio"}
          </SubmitButton>
        </div>
      </div>
    </Dialog>
  );
};

export default PortfolioForm;