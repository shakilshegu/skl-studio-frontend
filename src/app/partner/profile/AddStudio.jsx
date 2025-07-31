// "use client";
// import React, { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import Cookies from "js-cookie";
// import "react-toastify/dist/ReactToastify.css";
// import Freelancer from "../../../partner-pages/freelancer-form/FreelancerDetails";
// import {
//   addPartnerStudio,
//   fetchStudioCategories,
// } from "@/services/PartnerService/studio.service";
// import { countries, indianStates } from "@/utils/EnumUtils";
// // import MapSection from "./MapSection";
// import LocationSearchSelector from "./MapSection";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Building, User, MapPin, Image as ImageIcon } from "lucide-react";
// import { 
//   InputField, 
//   SelectField, 
//   TextareaField, 
//   FileUpload, 
//   SectionHeader,
//   SubmitButton 
// } from "@/components/partner/InputFields/FormFields";

// const ProfileForm = ({ userRole }) => {
//   const queryClient = useQueryClient();
  
//   // Initial Form Data
//   const initialFormData = {
//     studioName: "",
//     studioEmail: "",
//     studioMobileNumber: "",
//     studioStartedDate: "",
//     gstNumber: "",
//     pricePerHour:"",
//     addressLineOne: "",
//     addressLineTwo: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     country: "",
//     lat: "",
//     lng: "",
//     studioDescription: "",
//     category: "",
//     ownerName: "",
//     ownerEmail: "",
//     ownerPhoneNumber: "",
//     ownerGender: "",
//     ownerDateOfBirth: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [files, setFiles] = useState([]);
//   const [logo, setLogo] = useState(null);
//   const [logoProgress, setLogoProgress] = useState(0);
//   const [showForm, setShowForm] = useState("studioOwner");

//   // Fetch studio types using TanStack Query
//   const { data: studioCategories, isLoading: isLoadingStudioCategories } =
//     useQuery({
//       queryKey: ["studio-categories"],
//       queryFn: fetchStudioCategories,
//       select: (data) => data?.data?.categories,
//     });

//   // Create mutation for submitting form data
//   const submitMutation = useMutation({
//     mutationFn: addPartnerStudio,
//     onSuccess: (response) => {
//       if (response.data?.studioId) {
//         localStorage.setItem("StudioId", response.data.studioId);
//         Cookies.set("studioId", response.data.studioId, { expires: 7 });
//       }
//       queryClient.invalidateQueries(["profile"]);
//       toast.success("Studio created successfully!");
//     },
//     onError: (error) => {
//       console.error("Error submitting form:", error);
//       toast.error(error.response?.data?.message || "Failed to create studio");
//     },
//   });

//   // Transform data for select components
//   const countryOptions = countries.map(country => ({
//     value: country.name,
//     label: country.name
//   }));

//   const stateOptions = indianStates.map(state => ({
//     value: state,
//     label: state
//   }));

//   const studioCategoryOptions = Array.isArray(studioCategories) 
//     ? studioCategories.map(category => ({
//         value: category._id,
//         label: category.name
//       }))
//     : [];

//   const genderOptions = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//     { value: "Other", label: "Other" }
//   ];

//   // Form field configurations
//   const studioInfoFields = [
//     {
//       component: InputField,
//       props: {
//         label: "Studio Name",
//         name: "studioName",
//         placeholder: "Enter studio name",
//         required: true,
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Studio Email Address",
//         name: "studioEmail",
//         type: "email",
//         placeholder: "Enter email address",
//         required: true,
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Studio Mobile Number",
//         name: "studioMobileNumber",
//         type: "tel",
//         placeholder: "Enter mobile number",
//         required: true,
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Studio Started Date",
//         name: "studioStartedDate",
//         type: "date",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Price/Hour ",
//         name: "pricePerHour",
//         placeholder: "₹",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "GST Number",
//         name: "gstNumber",
//         placeholder: "Enter GST number",
//         className: ""
//       }
//     },
//     {
//       component: SelectField,
//       props: {
//         label: "Type of Studio",
//         name: "category",
//         options: studioCategoryOptions,
//         placeholder: "Select Studio Type",
//         loading: isLoadingStudioCategories,
//         className: ""
//       }
//     }
//   ];

//   const addressFields = [
//     {
//       component: InputField,
//       props: {
//         label: "Address Line 1",
//         name: "addressLineOne",
//         placeholder: "Enter address",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Address Line 2",
//         name: "addressLineTwo",
//         placeholder: "Enter address",
//         className: ""
//       }
//     },
//     {
//       component: SelectField,
//       props: {
//         label: "Country",
//         name: "country",
//         options: countryOptions,
//         placeholder: "Select Country",
//         className: ""
//       }
//     },
//     {
//       component: SelectField,
//       props: {
//         label: "State",
//         name: "state",
//         options: stateOptions,
//         placeholder: "Select State",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "City",
//         name: "city",
//         placeholder: "Enter city",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Pin Code",
//         name: "pinCode",
//         placeholder: "Enter pin code",
//         className: ""
//       }
//     }
//   ];

//   const ownerInfoFields = [
//     {
//       component: InputField,
//       props: {
//         label: "Owner Name",
//         name: "ownerName",
//         placeholder: "Enter owner name",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Owner Email Address",
//         name: "ownerEmail",
//         type: "email",
//         placeholder: "Enter email address",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Owner Mobile Number",
//         name: "ownerPhoneNumber",
//         type: "tel",
//         placeholder: "Enter mobile number",
//         className: ""
//       }
//     },
//     {
//       component: SelectField,
//       props: {
//         label: "Gender",
//         name: "ownerGender",
//         options: genderOptions,
//         placeholder: "Select gender",
//         className: ""
//       }
//     },
//     {
//       component: InputField,
//       props: {
//         label: "Date of Birth",
//         name: "ownerDateOfBirth",
//         type: "date",
//         className: ""
//       }
//     }
//   ];

//   const handleLocationChange = (position) => {
//     setFormData((prev) => ({
//       ...prev,
//       lat: position.lat,
//       lng: position.lng,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size should be less than 5MB");
//       return;
//     }

//     const logoData = {
//       name: file.name,
//       size: file.size,
//       file: file,
//       preview: URL.createObjectURL(file),
//     };

//     setLogo(logoData);
//     simulateLogoUploadProgress();
//   };

//   const simulateLogoUploadProgress = () => {
//     setLogoProgress(0);
//     const interval = setInterval(() => {
//       setLogoProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 200);
//   };

//   const handleRemoveLogo = () => {
//     setLogo(null);
//     setLogoProgress(0);
//   };

//   const handleFileUpload = (event) => {
//     const uploadedFiles = Array.from(event.target.files);
    
//     uploadedFiles.forEach(file => {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`${file.name} is too large. Maximum size is 5MB`);
//         return;
//       }
//     });

//     const validFiles = uploadedFiles.filter(file => file.size <= 5 * 1024 * 1024);

//     const fileDataArray = validFiles.map((file) => {
//       const reader = new FileReader();
//       const fileData = {
//         name: file.name,
//         size: file.size,
//         file: file,
//         preview: "",
//         progress: 0,
//       };

//       reader.onload = (e) => {
//         fileData.preview = e.target.result;

//         setFiles((prevFiles) => {
//           const updatedFiles = [...prevFiles, fileData];
//           return updatedFiles;
//         });

//         simulateUploadProgress(fileData);
//       };

//       reader.readAsDataURL(file);
//       return fileData;
//     });
//   };

//   const simulateUploadProgress = (file) => {
//     const interval = setInterval(() => {
//       setFiles((prevFiles) =>
//         prevFiles.map((f) =>
//           f.name === file.name && f.progress < 100
//             ? { ...f, progress: f.progress + 10 }
//             : f
//         )
//       );
//     }, 200);

//     setTimeout(() => clearInterval(interval), 2000);
//   };

//   const handleRemoveFile = (fileName) => {
//     setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
//   };

//   const handleSubmit = async () => {
//     try {
//       const requiredFields = {
//         studioName: "Studio Name",
//         studioEmail: "Studio Email",
//         studioMobileNumber: "Studio Mobile Number",
//       };

//       // Check required fields
//       const missingFields = Object.entries(requiredFields)
//         .filter(([key]) => !formData[key])
//         .map(([_, label]) => label);

//       if (missingFields.length > 0) {
//         toast.error(`Please fill in: ${missingFields.join(", ")}`);
//         return;
//       }

//       const formDataToSend = new FormData();

//       // Append all form data using Object.entries
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== "" && value !== null && value !== undefined) {
//           formDataToSend.append(key, value);
//         }
//       });

//       // Append logo if exists
//       if (logo) {
//         formDataToSend.append("studioLogo", logo.file);
//       }

//       // Append photos
//       files.forEach((file) => {
//         formDataToSend.append("photos", file.file);
//       });

//       // Submit form with mutation
//       submitMutation.mutate(formDataToSend);
//     } catch (error) {
//       console.error("Error preparing form submission:", error);
//       toast.error("Error preparing form submission");
//     }
//   };

//   // Render field helper function
//   const renderFields = (fieldsConfig, gridCols = "grid-cols-1 md:grid-cols-2") => {
//     return (
//       <div className={`grid ${gridCols} gap-6`}>
//         {fieldsConfig.map((field, index) => {
//           const Component = field.component;
//           return (
//             <Component
//               key={index}
//               {...field.props}
//               value={formData[field.props.name] || ""}
//               onChange={handleInputChange}
//             />
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white shadow-md w-full p-6 rounded-xl border">
//       <ToastContainer />
      
//       {/* Header */}
//       <div className="border-b border-gray-200 pb-4 mb-6">
//         <div className="flex items-center gap-3">
//           <Building className="text-[#892580]" size={24} />
//           <h1 className="text-xl font-semibold text-[#892580]">
//             Studio Profile
//           </h1>
//         </div>
//         <p className="text-gray-600 text-sm mt-1">Add your studio details</p>
//       </div>

//       {showForm === "freelancer" && <Freelancer />}
//       {showForm !== "freelancer" && (
//         <div className="space-y-8">
          
//           {/* Logo Upload Section */}
//           <FileUpload
//             label="Studio Logo"
//             accept="image/*"
//             onFileChange={handleLogoUpload}
//             placeholder="Drop your file here or "
//             maxSize="5MB"
//             uploadedFiles={logo ? [{...logo, progress: logoProgress}] : []}
//             onRemoveFile={handleRemoveLogo}
//           />

//           {/* Studio Information */}
//           <div>
//             <SectionHeader 
//               icon={Building} 
//               title="Studio Information" 
//               subtitle="Basic details about your studio"
//             />
//             {renderFields(studioInfoFields)}
//           </div>

//           {/* Address Information */}
//           <div>
//             <SectionHeader 
//               icon={MapPin} 
//               title="Address Information" 
//               subtitle="Studio location and contact details"
//             />
//             {renderFields(addressFields)}
//           </div>

//           {/* Location Search and Map Section */}
//           <div>
//             <SectionHeader 
//               icon={MapPin} 
//               title="Location Selection" 
//               subtitle="Search and set your studio's exact location"
//             />
            
//             {/* Location Search Component */}
//             <div className="">
//               <LocationSearchSelector
//                 initialPosition={{ lat: formData?.lat || "", lng: formData?.lng ||"" }}
//                 onPositionChange={handleLocationChange}
//               />
//             </div>
            
//             {/* Map Display
//             <div className="border border-gray-300 rounded-lg overflow-hidden">
//               <MapSection
//                 initialPosition={{ lat: formData.lat, lng: formData.lng }}
//                 onPositionChange={handleLocationChange}
//               />
//             </div> */}
//           </div>

//           {/* Studio Description */}
//           <TextareaField
//             label="Studio Description"
//             name="studioDescription"
//             placeholder="Enter studio description..."
//             value={formData.studioDescription}
//             onChange={handleInputChange}
//             rows={5}
//           />

//           {/* Studio Images */}
//           <div>
//             <SectionHeader 
//               icon={ImageIcon} 
//               title="Studio Images" 
//               subtitle="Upload photos of your studio and work"
//             />
//             <FileUpload
//               accept="image/*"
//               multiple={true}
//               onFileChange={handleFileUpload}
//               placeholder="Drop your files here or "
//               maxSize="5MB per file"
//               uploadedFiles={files}
//               onRemoveFile={handleRemoveFile}
//             />
//           </div>

//           {/* Owner Information */}
//           <div>
//             <SectionHeader 
//               icon={User} 
//               title="Owner Information" 
//               subtitle="Details about the studio owner"
//             />
//             {renderFields(ownerInfoFields)}
//           </div>

//           {/* Submit Button */}
//           <div className="text-center pt-6">
//             <SubmitButton
//               loading={submitMutation.isPending}
//               loadingText="SUBMITTING..."
//               onClick={handleSubmit}
//             >
//               SUBMIT TO REVIEW
//             </SubmitButton>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileForm;

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import Freelancer from "../../../partner-pages/freelancer-form/FreelancerDetails";
import {
  addPartnerStudio,
  updatePartnerStudio,
  fetchStudioCategories,
} from "@/services/PartnerService/studio.service";
import { countries, indianStates } from "@/utils/EnumUtils";
import LocationSearchSelector from "./MapSection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building, User, MapPin, Image as ImageIcon } from "lucide-react";
import { 
  InputField, 
  SelectField, 
  TextareaField, 
  FileUpload, 
  SectionHeader,
  SubmitButton 
} from "@/components/partner/InputFields/FormFields";


const AddStudio = ({ 
  userRole, 
  isEditMode = false, 
  studioId = null, 
  studioData = null,
  setIsEditing = null,
  onSuccess = null 
}) => {
  const queryClient = useQueryClient();
  
  // Initial Form Data
  const initialFormData = {
    studioName: "",
    studioEmail: "",
    studioMobileNumber: "",
    studioStartedDate: "",
    gstNumber: "",
    pricePerHour: "",
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    lat: "",
    lng: "",
    studioDescription: "",
    category: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhoneNumber: "",
    ownerGender: "",
    ownerDateOfBirth: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState([]);
  const [logo, setLogo] = useState(null);
  const [logoProgress, setLogoProgress] = useState(0);
  const [showForm, setShowForm] = useState("studioOwner");
  const [existingImages, setExistingImages] = useState([]);
  const [existingLogo, setExistingLogo] = useState(null);
  const [removed,setRemoved]=useState([])

  // Pre-populate form data when studio data is provided (for edit mode)
  useEffect(() => {
    if (studioData && isEditMode) {
      const populatedFormData = {
        studioName: studioData.studioName || "",
        studioEmail: studioData.studioEmail || "",
        studioMobileNumber: studioData.studioMobileNumber || "",
        studioStartedDate: studioData.studioStartedDate ? 
          new Date(studioData.studioStartedDate).toISOString().split('T')[0] : "",
        gstNumber: studioData.gstNumber || "",
        pricePerHour: studioData.pricePerHour || "",
        addressLineOne: studioData.address?.addressLineOne || "",
        addressLineTwo: studioData.address?.addressLineTwo || "",
        city: studioData.address?.city || "",
        state: studioData.address?.state || "",
        pinCode: studioData.address?.pinCode || "",
        country: studioData.address?.country || "",
        lat: studioData.location?.lat || "",
        lng: studioData.location?.lng || "",
        studioDescription: studioData.studioDescription || "",
        category: studioData.category?._id || studioData.category || "",
        ownerName: studioData.owner?.name || "",
        ownerEmail: studioData.owner?.email || "",
        ownerPhoneNumber: studioData.owner?.mobileNumber || "",
        ownerGender: studioData.owner?.gender || "",
        ownerDateOfBirth: studioData.owner?.dateOfBirth ? 
          new Date(studioData.owner.dateOfBirth).toISOString().split('T')[0] : "",
      };

      setFormData(populatedFormData);

      // Set existing images
      if (studioData.images && studioData.images.length > 0) {
        setExistingImages(studioData.images.map((img, index) => ({
          id: index,
          url: img,
          name: `existing-image-${index}`,
          isExisting: true,
          progress: 100,
          preview: img
        })));
      }

      // Set existing logo
      if (studioData.studioLogo) {
        setExistingLogo({
          url: studioData.studioLogo,
          name: 'existing-logo',
          isExisting: true,
          progress: 100,
          preview: studioData.studioLogo
        });
      }
    }
  }, [studioData, isEditMode]);

  // Fetch studio categories
  const { data: studioCategories, isLoading: isLoadingStudioCategories } =
    useQuery({
      queryKey: ["studio-categories"],
      queryFn: fetchStudioCategories,
      select: (data) => data?.data?.categories,
    });

  // Create mutation for submitting form data
  const submitMutation = useMutation({
    mutationFn: (formDataToSend) => {
      if (isEditMode && studioId) {
        return updatePartnerStudio(studioId, formDataToSend);
      } else {
        return addPartnerStudio(formDataToSend);
      }
    },
    onSuccess: (response) => {
      if (!isEditMode && response.data?.studioId) {
        localStorage.setItem("StudioId", response.data.studioId);
        Cookies.set("studioId", response.data.studioId, { expires: 7 });
      }
      
      queryClient.invalidateQueries(["profile"]);
      toast.success(isEditMode ? "Studio updated successfully!" : "Studio created successfully!");
      
      // Call the onSuccess callback from parent if provided
      if (onSuccess) {
        onSuccess(response);
      }
      
      // Exit edit mode if setIsEditing is provided
      if (setIsEditing && isEditMode) {
        setIsEditing(false);
      }
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} studio`);
    },
  });

  // Handle cancel/back action (for edit mode)
  const handleCancelEdit = () => {
    if (setIsEditing && isEditMode) {
      setIsEditing(false);
    }
  };

  // Transform data for select components
  const countryOptions = countries.map(country => ({
    value: country.name,
    label: country.name
  }));

  const stateOptions = indianStates.map(state => ({
    value: state,
    label: state
  }));

  const studioCategoryOptions = Array.isArray(studioCategories) 
    ? studioCategories.map(category => ({
        value: category._id,
        label: category.name
      }))
    : [];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  // Form field configurations
  const studioInfoFields = [
    {
      component: InputField,
      props: {
        label: "Studio Name",
        name: "studioName",
        placeholder: "Enter studio name",
        required: true,
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Studio Email Address",
        name: "studioEmail",
        type: "email",
        placeholder: "Enter email address",
        required: true,
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Studio Mobile Number",
        name: "studioMobileNumber",
        type: "tel",
        placeholder: "Enter mobile number",
        required: true,
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Studio Started Date",
        name: "studioStartedDate",
        type: "date",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Price/Hour ",
        name: "pricePerHour",
        placeholder: "₹",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "GST Number",
        name: "gstNumber",
        placeholder: "Enter GST number",
        className: ""
      }
    },
    {
      component: SelectField,
      props: {
        label: "Type of Studio",
        name: "category",
        options: studioCategoryOptions,
        placeholder: "Select Studio Type",
        loading: isLoadingStudioCategories,
        className: ""
      }
    }
  ];

  const addressFields = [
    {
      component: InputField,
      props: {
        label: "Address Line 1",
        name: "addressLineOne",
        placeholder: "Enter address",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Address Line 2",
        name: "addressLineTwo",
        placeholder: "Enter address",
        className: ""
      }
    },
    {
      component: SelectField,
      props: {
        label: "Country",
        name: "country",
        options: countryOptions,
        placeholder: "Select Country",
        className: ""
      }
    },
    {
      component: SelectField,
      props: {
        label: "State",
        name: "state",
        options: stateOptions,
        placeholder: "Select State",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "City",
        name: "city",
        placeholder: "Enter city",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Pin Code",
        name: "pinCode",
        placeholder: "Enter pin code",
        className: ""
      }
    }
  ];

  const ownerInfoFields = [
    {
      component: InputField,
      props: {
        label: "Owner Name",
        name: "ownerName",
        placeholder: "Enter owner name",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Owner Email Address",
        name: "ownerEmail",
        type: "email",
        placeholder: "Enter email address",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Owner Mobile Number",
        name: "ownerPhoneNumber",
        type: "tel",
        placeholder: "Enter mobile number",
        className: ""
      }
    },
    {
      component: SelectField,
      props: {
        label: "Gender",
        name: "ownerGender",
        options: genderOptions,
        placeholder: "Select gender",
        className: ""
      }
    },
    {
      component: InputField,
      props: {
        label: "Date of Birth",
        name: "ownerDateOfBirth",
        type: "date",
        className: ""
      }
    }
  ];

  // const handleLocationChange = (position) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     lat: position.lat,
  //     lng: position.lng,
  //   }));
  // };
  const handleLocationChange = useCallback((position) => {
  console.log("Location changed:", position);
  const lat = typeof position.lat === 'number' ? position.lat : parseFloat(position.lat);
  const lng = typeof position.lng === 'number' ? position.lng : parseFloat(position.lng);
  
  setFormData((prev) => ({
    ...prev,
    lat: lat,
    lng: lng,
  }));
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const logoData = {
      name: file.name,
      size: file.size,
      file: file,
      preview: URL.createObjectURL(file),
      isExisting: false
    };

    setLogo(logoData);
    setExistingLogo(null); // Remove existing logo when new one is uploaded
    simulateLogoUploadProgress();
  };

  const simulateLogoUploadProgress = () => {
    setLogoProgress(0);
    const interval = setInterval(() => {
      setLogoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setExistingLogo(null);
    setLogoProgress(0);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    uploadedFiles.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }
    });

    const validFiles = uploadedFiles.filter(file => file.size <= 5 * 1024 * 1024);

    const fileDataArray = validFiles.map((file) => {
      const reader = new FileReader();
      const fileData = {
        name: file.name,
        size: file.size,
        file: file,
        preview: "",
        progress: 0,
        isExisting: false
      };

      reader.onload = (e) => {
        fileData.preview = e.target.result;

        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, fileData];
          return updatedFiles;
        });

        simulateUploadProgress(fileData);
      };

      reader.readAsDataURL(file);
      return fileData;
    });
  };

  const simulateUploadProgress = (file) => {
    const interval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === file.name && f.progress < 100
            ? { ...f, progress: f.progress + 10 }
            : f
        )
      );
    }, 200);

    setTimeout(() => clearInterval(interval), 2000);
  };

  const handleRemoveFile = (image) => {
    let fileName = image?.name
    if (fileName.startsWith('existing-image-')) {
      // Remove from existing images
      setExistingImages((prevImages) => 
        prevImages.filter((img) => img.name !== fileName)
      );
      setRemoved((prev)=>[...prev,image?.url])
    } else {
      // Remove from new files
      setFiles((prevFiles) => 
        prevFiles.filter((file) => file.name !== fileName)
      );
    }
  };
{console.log(removed,"---------------------")
}
  const handleSubmit = async () => {
    try {
      const requiredFields = {
        studioName: "Studio Name",
        studioEmail: "Studio Email",
        studioMobileNumber: "Studio Mobile Number",
      };

      // Check required fields
      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(", ")}`);
        return;
      }

      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });


            // Append new photos
      removed.forEach((file) => {
      
          formDataToSend.append("removed", file);
      
      });

      // Append new logo if exists
      if (logo && !logo.isExisting) {
        formDataToSend.append("studioLogo", logo.file);
      }

      // Append new photos
      files.forEach((file) => {
        if (!file.isExisting) {
          formDataToSend.append("photos", file.file);
        }
      });

      // Submit form with mutation
      submitMutation.mutate(formDataToSend);
    } catch (error) {
      console.error("Error preparing form submission:", error);
      toast.error("Error preparing form submission");
    }
  };

  // Render field helper function
  const renderFields = (fieldsConfig, gridCols = "grid-cols-1 md:grid-cols-2") => {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {fieldsConfig.map((field, index) => {
          const Component = field.component;
          return (
            <Component
              key={index}
              {...field.props}
              value={formData[field.props.name] || ""}
              onChange={handleInputChange}
            />
          );
        })}
      </div>
    );
  };

  // Prepare logo for display
  const displayLogo = logo || existingLogo;
  const logoDisplayData = displayLogo ? {
    ...displayLogo,
    progress: logo ? logoProgress : 100
  } : null;

  // Combine existing and new images for display
  const allImages = [...existingImages, ...files];

  return (
    <div>
      {/* Optional: Add a back button for edit mode */}
      {isEditMode && setIsEditing && (
        <div className="mb-4">
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to Profile
          </button>
        </div>
      )}

      <div className="bg-white shadow-md w-full p-6 rounded-xl border">
        <ToastContainer />
        
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Building className="text-[#892580]" size={24} />
            <h1 className="text-xl font-semibold text-[#892580]">
              {isEditMode ? "Edit Studio Profile" : "Studio Profile"}
            </h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {isEditMode ? "Update your studio details" : "Add your studio details"}
          </p>
        </div>

        {showForm === "freelancer" && <Freelancer />}
        {showForm !== "freelancer" && (
          <div className="space-y-8">
            
            {/* Logo Upload Section
            <FileUpload
              label="Studio Logo"
              accept="image/*"
              onFileChange={handleLogoUpload}
              placeholder="Drop your file here or "
              maxSize="5MB"
              uploadedFiles={logoDisplayData ? [logoDisplayData] : []}
              onRemoveFile={handleRemoveLogo}
            /> */}
            {/* Logo Upload Section - Replace existing logo section with this */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Studio Logo
  </label>
  
  {/* Display existing logo in edit mode */}
  {isEditMode && existingLogo && !logo && (
    <div className="mb-4">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
          <img
            src={existingLogo.url}
            alt="Current studio logo"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={handleRemoveLogo}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Current logo - click × to replace</p>
    </div>
  )}
  
  {/* File upload for logo (only show if no existing logo or new logo selected) */}
  {(!existingLogo || logo) && (
    <FileUpload
      label=""
      accept="image/*"
      onFileChange={handleLogoUpload}
      placeholder="Drop your file here or "
      maxSize="5MB"
      uploadedFiles={logo ? [{ ...logo, progress: logoProgress }] : []}
      onRemoveFile={handleRemoveLogo}
    />
  )}
</div>

            {/* Studio Information */}
            <div>
              <SectionHeader 
                icon={Building} 
                title="Studio Information" 
                subtitle="Basic details about your studio"
              />
              {renderFields(studioInfoFields)}
            </div>


            {/* Address Information */}
            <div>
              <SectionHeader 
                icon={MapPin} 
                title="Address Information" 
                subtitle="Studio location and contact details"
              />
              {renderFields(addressFields)}
            </div>

            {/* Location Search and Map Section */}
            <div>
              <SectionHeader 
                icon={MapPin} 
                title="Location Selection" 
                subtitle="Search and set your studio's exact location"
              />
              
              <div className="">
                {/* <LocationSearchSelector
                  initialPosition={{ 
                    lat: formData?.lat || "", 
                    lng: formData?.lng || "" 
                  }}
                  onPositionChange={handleLocationChange}
                /> */}
                <LocationSearchSelector
  initialPosition={{
    lat: formData?.lat && formData?.lat !== "" ? formData.lat : null,
    lng: formData?.lng && formData?.lng !== "" ? formData.lng : null
  }}
  onPositionChange={handleLocationChange}
/>
              </div>
            </div>

            {/* Studio Description */}
            <TextareaField
              label="Studio Description"
              name="studioDescription"
              placeholder="Enter studio description..."
              value={formData.studioDescription}
              onChange={handleInputChange}
              rows={5}
            />

            {/* Studio Images */}
            {/* <div>
              <SectionHeader 
                icon={ImageIcon} 
                title="Studio Images" 
                subtitle="Upload photos of your studio and work"
              />
              <FileUpload
                accept="image/*"
                multiple={true}
                onFileChange={handleFileUpload}
                placeholder="Drop your files here or "
                maxSize="5MB per file"
                uploadedFiles={allImages}
                onRemoveFile={handleRemoveFile}
              />
            </div> */}

            {/* Studio Images Section - Replace existing images section with this */}
<div>
  <SectionHeader 
    icon={ImageIcon} 
    title="Studio Images" 
    subtitle="Upload photos of your studio and work"
  />
  
  {/* Display existing images separately in edit mode */}
  {isEditMode && existingImages.length > 0 && (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Current Images</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {existingImages.map((image, index) => (
          <div key={image.name} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <img
                src={image.url}
                alt={`Studio image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {console.log(image,"================")
            }
            <button
              onClick={() => handleRemoveFile(image)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1   duration-200 hover:bg-red-600"
              type="button"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
  
  {/* File upload for new images */}
  <div>
    <h4 className="text-sm font-medium text-gray-700 mb-3">
      {isEditMode && existingImages.length > 0 ? "Add More Images" : "Upload Images"}
    </h4>
    <FileUpload
      accept="image/*"
      multiple={true}
      onFileChange={handleFileUpload}
      placeholder="Drop your files here or "
      maxSize="5MB per file"
      uploadedFiles={files} // Only show newly uploaded files here
      onRemoveFile={handleRemoveFile}
    />
  </div>
</div>

            {/* Owner Information */}
            <div>
              <SectionHeader 
                icon={User} 
                title="Owner Information" 
                subtitle="Details about the studio owner"
              />
              {renderFields(ownerInfoFields)}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <SubmitButton
                loading={submitMutation.isPending}
                loadingText={isEditMode ? "UPDATING..." : "SUBMITTING..."}
                onClick={handleSubmit}
              >
                {isEditMode ? "UPDATE STUDIO" : "SUBMIT TO REVIEW"}
              </SubmitButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudio;