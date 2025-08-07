"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addFreelancer, fetchEventCategories, fetchFreelancerById, updateFreelancer } from "@/services/Freelancer/freelancer.service";
import GooglePlacesAutocomplete from "../../components/GooglePlacesAutocomplete/GooglePlacesAutocomplete";

const image12 = "/Assets/partner/image12.png";

const FreelancerDetails = ({ setIsEditing, isEditing }) => {
  const queryClient = useQueryClient();

  // Initial Form Data - Updated to include lat/lng
  const initialFormData = {
    name: "",
    age: "",
    description: "",
    categories: [], // Array for multiple selection
    location: "",
    lat: "", // Added latitude
    lng: "", // Added longitude
    experience: "",
    pricePerHour: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [profileImage, setProfileImage] = useState(null);
  const [imageProgress, setImageProgress] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Fetch freelancer data if logged in
  const {
    data: freelancerData,
    isLoading: isLoadingFreelancer,
    error: freelancerError
  } = useQuery({
    queryKey: ['freelancer', isEditing],
    queryFn: () => fetchFreelancerById(),
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error("Error fetching freelancer data:", error);
      toast.error("Failed to load freelancer profile");
    }
  });

  // Fetch categories from API
  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    error: categoryError
  } = useQuery({
    queryKey: ['event-category'],
    queryFn: fetchEventCategories,
    select: (data) => data?.categories,
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error("Error fetching category data:", error);
      toast.error("Failed to load category data");
    }
  });

  // Update form data when freelancerData changes - Updated to include lat/lng
  useEffect(() => {
    if (freelancerData && freelancerData.freelancer) {
      const fetchedData = freelancerData.freelancer;

      // Extract category IDs from populated category objects
      let categoryIds = [];
      if (fetchedData.categories) {
        if (Array.isArray(fetchedData.categories)) {
          categoryIds = fetchedData.categories.map(cat =>
            typeof cat === 'object' && cat._id ? cat._id : cat
          );
        } else if (typeof fetchedData.categories === 'object' && fetchedData.categories._id) {
          categoryIds = [fetchedData.categories._id];
        } else {
          categoryIds = [fetchedData.categories];
        }
      }

      // Populate form with fetched data
      setFormData({
        name: fetchedData.name || "",
        age: fetchedData.age || "",
        description: fetchedData.description || "",
        categories: categoryIds,
        location: fetchedData.location || "",
        lat: fetchedData.lat || "", // Added latitude
        lng: fetchedData.lng || "", // Added longitude
        experience: fetchedData.experience || "",
        pricePerHour: fetchedData.pricePerHour || "",
      });

      // Set profile image if exists
      if (fetchedData.profileImage) {
        setProfileImage({
          preview: fetchedData.profileImage,
          name: "profile-image.jpg",
          size: 0,
        });
        setImageProgress(100);
      }
    }
  }, [freelancerData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create freelancer mutation
  const createMutation = useMutation({
    mutationFn: addFreelancer,
    onSuccess: (data) => {
      const freelancerId = data?.data?.freelancerId;

      if (freelancerId) {
        localStorage.setItem("FreelancerId", freelancerId);
        Cookies.set("freelancerId", freelancerId, { expires: 7 });
        toast.success("Freelancer profile created successfully!");
        queryClient.invalidateQueries({ queryKey: ['freelancer'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        setIsEditing(false);
        resetForm();
      } else {
        toast.error("Failed to create freelancer profile. Invalid response.");
      }
    },
    onError: (error) => {
      console.error("Error creating freelancer:", error);
      toast.error(error.response?.data?.message || "Failed to create freelancer profile");
    }
  });

  // Update freelancer mutation
  const updateMutation = useMutation({
    mutationFn: updateFreelancer,
    onSuccess: (data) => {
      toast.success("Freelancer profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['freelancer'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating freelancer:", error);
      toast.error(error.response?.data?.message || "Failed to update freelancer profile");
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Toggle category selection with a single click
  const toggleCategory = (categoryId) => {
    setFormData(prev => {
      if (prev.categories.includes(categoryId)) {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      }
    });

    if (fieldErrors.categories) {
      setFieldErrors(prev => ({
        ...prev,
        categories: ""
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF and WEBP images are allowed");
      return;
    }

    const imageData = {
      name: file.name,
      size: file.size,
      file: file,
      preview: URL.createObjectURL(file),
    };

    setProfileImage(imageData);
    setImageError("");
    simulateImageUploadProgress();
  };

  const simulateImageUploadProgress = () => {
    setImageProgress(0);
    const interval = setInterval(() => {
      setImageProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageProgress(0);
  };

  // Updated validation to include lat/lng
  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      name: "Name is required",
      experience: "Experience is required",
      pricePerHour: "Price Per Hour is required",
      age: "Age is required",
      location: "Location is required",
      lat: "Location coordinates are required",
      lng: "Location coordinates are required"
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) {
        errors[field] = message;
      }
    });

    if (!formData.categories.length) {
      errors.categories = "At least one category must be selected";
    }

    if (!isEditing && !profileImage) {
      setImageError("Profile image is required");
    } else {
      setImageError("");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 && (!imageError || isEditing);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'categories' && value !== "" && value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    formDataToSend.append("categories", JSON.stringify(formData.categories));

    if (profileImage && profileImage.file) {
      formDataToSend.append("profileImage", profileImage.file);
    }

    if (isEditing) {
      updateMutation.mutate(formDataToSend);
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setProfileImage(null);
    setImageProgress(0);
    setFieldErrors({});
    setImageError("");
  };

  const handleReset = () => {
    if (isEditing) {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } else {
      resetForm();
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isProfileImageRequired = !isEditing;

  return (
    <>
      <div className="bg-white shadow-md w-full p-6 rounded-xl border">
        <ToastContainer />
        <h5 className="fw-bold">
          {isEditing ? "Edit Freelancer Profile" : "Create Freelancer Profile"}
        </h5>

        {isLoadingFreelancer ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your profile...</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <p className="heading-text">
                Profile Image{isProfileImageRequired ? "*" : ""}
              </p>
              <label
                htmlFor="profile-upload"
                className={`image-upload ${imageError ? 'border border-danger' : ''}`}
              >
                <div className="image-placeholder" style={{ height: "100px" }}>
                  <img src={image12} alt="Placeholder" />
                  <div>
                    <p>
                      Drop your file here or{" "}
                      <label className="browse-link" htmlFor="profileImageInput">
                        <span>Browse</span>
                      </label>
                    </p>
                    <p className="file-size">Maximum size: 5MB</p>
                  </div>
                </div>
                <input
                  key={profileImage ? "has-image" : "no-image"}
                  id="profileImageInput"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </label>
              {imageError && (
                <div className="text-danger mt-1">{imageError}</div>
              )}

              {profileImage && (
                <div className="mt-4">
                  <div className="d-flex align-items-center border rounded p-3 mb-3">
                    <img
                      src={profileImage.preview}
                      alt="Uploaded Profile"
                      className="rounded me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-0">
                        <strong>{profileImage.name}</strong>
                      </p>
                      {profileImage.size > 0 && (
                        <p className="mb-1 text-muted">
                          {(profileImage.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                      {imageProgress < 100 && (
                        <div className="progress" style={{ height: "5px" }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${imageProgress}%` }}
                            aria-valuenow={imageProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      )}
                      <small className="text-muted">
                        {imageProgress}% uploaded
                      </small>
                    </div>
                    <button
                      className="btn btn-danger btn-sm ms-3"
                      onClick={handleRemoveImage}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name*</label>
                <input
                  type="text"
                  className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {fieldErrors.name && (
                  <div className="invalid-feedback">{fieldErrors.name}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Age*</label>
                <input
                  type="number"
                  className={`form-control ${fieldErrors.age ? 'is-invalid' : ''}`}
                  placeholder="Enter age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
                {fieldErrors.age && (
                  <div className="invalid-feedback">{fieldErrors.age}</div>
                )}
              </div>
              <div className="col-md-6 mb-3 category-dropdown">
                <label className="form-label">Categories*</label>
                <div className={`position-relative ${fieldErrors.categories ? 'is-invalid' : ''}`}>
                  <div
                    className="form-control d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <span>
                      {formData.categories.length > 0
                        ? `${formData.categories.length} categories selected`
                        : "Select categories"}
                    </span>
                    <i className={`bi bi-chevron-${showCategoryDropdown ? 'up' : 'down'}`}></i>
                  </div>

                  {showCategoryDropdown && (
                    <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm z-3"
                      style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {isLoadingCategory ? (
                        <div className="p-3 text-center">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="ms-2">Loading categories...</span>
                        </div>
                      ) : categoryData && categoryData.length > 0 ? (
                        categoryData.map(category => (
                          <div
                            key={category._id}
                            className={`p-2 border-bottom ${formData.categories.includes(category._id) ? 'bg-light' : ''}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleCategory(category._id)}
                          >
                            <div className="form-check mb-0">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.categories.includes(category._id)}
                                onChange={() => { }}
                                onClick={(e) => e.stopPropagation()}
                                id={`category-${category._id}`}
                              />
                              <label
                                className="form-check-label w-100"
                                htmlFor={`category-${category._id}`}
                                style={{ cursor: "pointer" }}
                              >
                                {category.name}
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-muted">No categories available</div>
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.categories && (
                  <div className="invalid-feedback d-block">{fieldErrors.categories}</div>
                )}

                {formData.categories.length > 0 && categoryData && (
                  <div className="mt-2">
                    <div className="d-flex flex-wrap gap-2">
                      {formData.categories.map(categoryId => {
                        const category = categoryData.find(cat => cat._id === categoryId);
                        return category ? (
                          <span key={categoryId} className="badge bg-primary rounded-pill py-2 px-3">
                            {category.name}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              style={{ fontSize: "0.5rem" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(categoryId);
                              }}
                              aria-label="Remove"
                            ></button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Location Input with Lat/Lng */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Location*</label>
                <GooglePlacesAutocomplete
                  className={`form-control ${fieldErrors.location ? 'is-invalid' : ''}`}
                  value={formData.location}
                  onChange={(locationString) => {
                    console.log("Location typing:", locationString);
                    
                    // Handle manual typing - update location and clear coordinates
                    setFormData((prev) => ({
                      ...prev,
                      location: locationString || "",
                      lat: "", // Clear coordinates when typing manually
                      lng: "",
                    }));
                    
                    // Clear location error when user types
                    if (fieldErrors.location) {
                      setFieldErrors(prev => ({
                        ...prev,
                        location: ""
                      }));
                    }
                  }}
                  onCoordinates={(coordinates) => {
                    console.log("Coordinates received:", coordinates);
                    
                    // Handle coordinates from place selection
                    setFormData((prev) => ({
                      ...prev,
                      lat: coordinates.lat || "",
                      lng: coordinates.lng || "",
                    }));
                    
                    // Clear coordinate errors
                    setFieldErrors(prev => ({
                      ...prev,
                      lat: "",
                      lng: ""
                    }));
                  }}
                  placeholder="Search for a city"
                  debounceTime={400}
                />
                {fieldErrors.location && (
                  <div className="invalid-feedback">{fieldErrors.location}</div>
                )}
                {(fieldErrors.lat || fieldErrors.lng) && (
                  <div className="invalid-feedback d-block">
                    Please select a location from the dropdown to get coordinates
                  </div>
                )}
                
                {/* Display coordinates when available */}
                {formData.lat && formData.lng && (
                  <small className="text-muted">
                    📍 Coordinates: {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}
                  </small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Experience (years)*</label>
                <input
                  type="number"
                  className={`form-control ${fieldErrors.experience ? 'is-invalid' : ''}`}
                  placeholder="Enter years of experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
                {fieldErrors.experience && (
                  <div className="invalid-feedback">{fieldErrors.experience}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Price Per Hour (₹)*</label>
                <input
                  type="number"
                  className={`form-control ${fieldErrors.pricePerHour ? 'is-invalid' : ''}`}
                  placeholder="Enter hourly rate"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleInputChange}
                  required
                />
                {fieldErrors.pricePerHour && (
                  <div className="invalid-feedback">{fieldErrors.pricePerHour}</div>
                )}
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Enter description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-4 mb-4">
              <button
                className="btn px-5 py-2 me-2"
                style={{ backgroundColor: "#f5f5f5", color: "#333" }}
                onClick={handleReset}
                type="button"
                disabled={isLoading}
              >
                {isEditing ? "CANCEL" : "RESET"}
              </button>
              <button
                className="btn px-5 py-2"
                style={{ backgroundColor: "#892580", color: "white" }}
                onClick={handleSubmit}
                type="button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? "UPDATING..." : "SUBMITTING..."}
                  </>
                ) : (
                  isEditing ? "UPDATE PROFILE" : "SUBMIT PROFILE"
                )}
              </button>
            </div>

            {/* Show error feedback from queries/mutations */}
            {(createMutation.isError || updateMutation.isError || freelancerError) && (
              <div className="alert alert-danger mt-3" role="alert">
                {createMutation.error?.message ||
                  updateMutation.error?.message ||
                  freelancerError?.message ||
                  "An error occurred during the operation."}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FreelancerDetails;