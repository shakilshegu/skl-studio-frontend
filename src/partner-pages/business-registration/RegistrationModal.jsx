// import React, { useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { MapPin, Calendar, Instagram, Award, Camera } from "lucide-react";
// import { stateCityData } from "@/utils/BusinessFormData";

// const BusinessForm = ({ onClose, onSave }) => {
//   const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [formData, setFormData] = useState({
//     vendorName: "",
//     vendorType: "",
//     teamSize: 0,
//     country: "",
//     state: "",
//     city: "",
//     instagramHandle: "",
//  
//     listOfEquipment: "",
//     avgBookingDays: 0,
//     inHouseDesigner: "",
//     traveledOutsideCountry: false,
//     countriesTraveled: [],
//     traveledOutsideCity: false,
//     citiesTraveled: [],
//     openToTravel: true,
//     eventsOutsideCity: ["Wedding", "Couple", "Pre-Wedding"],
//     eventsOutsideCountry: ["Wedding", "Couple", "Pre-Wedding"],
//   });
//   const [newCountry, setNewCountry] = useState("");
//   const [newCity, setNewCity] = useState("");

//   const handleAttemptClose = () => {
//     setShowCloseConfirmation(true);
//   };

//   const handleCancelClose = () => {
//     setShowCloseConfirmation(false);
//   };

//   const handleConfirmClose = () => {
//     setShowCloseConfirmation(false);
//     onClose();
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });

//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleTeamSizeChange = (increment) => {
//     setFormData({
//       ...formData,
//       teamSize: Math.max(1, formData?.teamSize + increment),
//     });
//   };

//   const handleAvgDaysChange = (increment) => {
//     setFormData({
//       ...formData,
//       avgBookingDays: Math.max(0, formData?.avgBookingDays + increment),
//     });
//   };

//   const handleSave = () => {
//     const newErrors = {};

//     if (!formData?.vendorName) {
//       newErrors.vendorName = "vendor name is required";
//     }
//     if (!formData?.vendorType) {
//       newErrors.vendorType = "vendorType is required";
//     }
//     if (!formData?.teamSize) {
//       newErrors.teamSize = "team size is required";
//     }
//     if (!formData?.country) {
//       newErrors.country = "country is required";
//     }
//     if (!formData?.state) {
//       newErrors.state = "state is required";
//     }
//     if (!formData?.city) {
//       newErrors.city = "city is required";
//     }

//     setErrors(newErrors);

//     // Don't save if there are errors
//     if (Object.keys(newErrors).length > 0) return;

//     if (onSave) {
//       onSave(formData);
//     }
//   };

//   const cities = stateCityData[formData?.state] || [];

//   return (
//     <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
//       <div
//         className={`bg-white  max-w-5xl mx-auto rounded-xl p-4 sm:p-6 w-full shadow-xl relative overflow-y-auto max-h-[90vh]  `}
//       >
//         <button
//           onClick={handleAttemptClose}
//           className="absolute top-4 right-4 text-xl cursor-pointer hover:text-red-700"
//           aria-label="Close"
//         >
//           <IoClose />
//         </button>

//         {showCloseConfirmation && (
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
//             <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
//               <h3 className="text-lg font-bold mb-3">Don't leave!</h3>
//               <p className="mb-4">
//                 If you leave now, your business registration will be cancelled
//                 and you'll be registered as a regular user.
//               </p>
//               <div className="flex gap-3 justify-center">
//                 <button
//                   onClick={handleCancelClose}
//                   className="px-4 py-2 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66] text-sm"
//                 >
//                   Continue Registration
//                 </button>
//                 <button
//                   onClick={handleConfirmClose}
//                   className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
//                 >
//                   Leave Anyway
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <h2 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4">
//           Business Information
//         </h2>
//         <p className="text-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
//           Please fill the fields below to complete your registration
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
//           {/* Vendor Name */}
//           <div>
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               Vendor name
//             </label>
//             <input
//               type="text"
//               name="vendorName"
//               placeholder="Mohit Prajapati"
//               value={formData?.vendorName}
//               onChange={handleChange}
//               className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
//             />
//             {errors.vendorName && (
//               <span className="error text-xs" style={{ color: "red" }}>
//                 {errors.vendorName}
//               </span>
//             )}
//           </div>

//           {/* Register As */}
//           <div>
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               Register as
//             </label>
//             <div>
//               <select
//                 name="vendorType"
//                 value={formData?.vendorType}
//                 onChange={handleChange}
//                 className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 pr-8"
//               >
//                 <option value="studio">Studio</option>
//                 <option value="freelancer">Freelancer</option>
//               </select>
//               <div className="absolute inset-y-0 bottom-4 right-2 flex items-center pr-3 pointer-events-none text-gray-400">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </div>
//               {errors.vendorType && (
//                 <span className="error text-xs" style={{ color: "red" }}>
//                   {errors.vendorType}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Team Size */}
//           <div>
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               Team Size
//             </label>
//             <div className="flex items-center">
//               <button
//                 type="button"
//                 onClick={() => handleTeamSizeChange(-1)}
//                 className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
//                 aria-label="Decrease team size"
//               >
//                 <span className="text-lg">−</span>
//               </button>
//               <input
//                 type="text"
//                 name="teamSize"
//                 value={formData?.teamSize}
//                 onChange={handleChange}
//                 className="border p-2 rounded-lg mx-2 w-full text-center text-sm"
//                 readOnly
//               />
//               <button
//                 type="button"
//                 onClick={() => handleTeamSizeChange(1)}
//                 className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
//                 aria-label="Increase team size"
//               >
//                 <span className="text-lg">+</span>
//               </button>
//             </div>
//             {errors.teamSize && (
//               <span className="error text-xs" style={{ color: "red" }}>
//                 {errors.teamSize}
//               </span>
//             )}
//           </div>

//           {/* Instagram Handle */}
//           <div>
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               <span className="flex items-center">
//                 <Instagram className="w-4 h-4 mr-1" /> Instagram Handle
//               </span>
//             </label>
//             <div className="flex w-full">
//               <div className="bg-gray-100 p-2 rounded-l-xl text-gray-500 border border-r-0 text-sm whitespace-nowrap">
//                 https://
//               </div>
//               <input
//                 type="text"
//                 name="instagramHandle"
//                 placeholder="instagram.com/example"
//                 value={formData?.instagramHandle}
//                 onChange={handleChange}
//                 className="border p-2 rounded-r-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//             </div>
//           </div>

//           {/* Location Group */}
//           <div className="md:col-span-2">
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               <span className="flex items-center">
//                 <MapPin className="w-4 h-4 mr-1" /> Location
//               </span>
//             </label>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//               {/* Country */}
//               <div>
//                 <div className="flex items-center border p-2 rounded-xl">
//                   <span className="mr-2">🇮🇳</span>
//                   <input
//                     type="text"
//                     name="country"
//                     placeholder="India"
//                     value={formData?.country}
//                     onChange={handleChange}
//                     className="w-full outline-none text-sm"
//                   />
//                 </div>
//                 {errors.country && (
//                   <span className="error text-xs" style={{ color: "red" }}>
//                     {errors.country}
//                   </span>
//                 )}
//               </div>

//               <div>
//                 <select
//                   name="state"
//                   value={formData?.state}
//                   onChange={handleChange}
//                   className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 pr-8"
//                 >
//                   <option value="">Select State</option>
//                   {Object.keys(stateCityData).map((state) => (
//                     <option key={state} value={state}>
//                       {state}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 bottom-4 right-2 flex items-center pr-3 pointer-events-none text-gray-400">
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </div>
//                 {errors.state && (
//                   <span className="error text-xs" style={{ color: "red" }}>
//                     {errors.state}
//                   </span>
//                 )}
//               </div>

//               {/* City */}
//               <div>
//                 <select
//                   name="city"
//                   value={formData?.city}
//                   onChange={handleChange}
//                   disabled={!formData?.state}
//                   className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 pr-8"
//                 >
//                   <option value="">Select City</option>
//                   {cities.map((city) => (
//                     <option key={city} value={city}>
//                       {city}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 bottom-4 right-2 flex items-center pr-3 pointer-events-none text-gray-400">
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </div>
//                 {errors.city && (
//                   <span className="error text-xs" style={{ color: "red" }}>
//                     {errors.city}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Professional Info Group */}
//           <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//             {/* Avg days in month you are booked */}
//             <div>
//               <label className="block text-gray-600 mb-1 text-sm font-medium">
//                 <span className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" /> Avg booking days/month
//                 </span>
//               </label>
//               <div className="flex items-center">
//                 <button
//                   type="button"
//                   onClick={() => handleAvgDaysChange(-1)}
//                   className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
//                   aria-label="Decrease booking days"
//                 >
//                   <span className="text-lg">−</span>
//                 </button>
//                 <input
//                   type="text"
//                   name="avgBookingDays"
//                   value={formData?.avgBookingDays}
//                   onChange={handleChange}
//                   className="border p-2 rounded-lg mx-2 w-full text-center text-sm"
//                   readOnly
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleAvgDaysChange(1)}
//                   className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
//                   aria-label="Increase booking days"
//                 >
//                   <span className="text-lg">+</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Do you have an in house designer? */}
//           <div className="md:col-span-2">
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               Do you have an in house designer?
//             </label>
//             <div>
//               <select
//                 name="inHouseDesigner"
//                 value={formData?.inHouseDesigner}
//                 onChange={handleChange}
//                 className="border p-2 rounded-xl w-full text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 pr-8"
//               >
//                 <option value="I outsource">I outsource</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//               <div className="absolute inset-y-0 bottom-4 right-2 flex items-center pr-3 pointer-events-none text-gray-400">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Travel Information Section */}
//         <div className="mt-4 sm:mt-6 border-t pt-4">
//           <h3 className="font-medium text-base sm:text-md mb-3">
//             Travel Information
//           </h3>
//           <div className="flex w-[100%] justify-between gap-[16px]">
//             {/* Outside country travel section */}
//             <div className="mb-3 sm:mb-4 w-[50%]">
//               <div className="flex items-start mb-2">
//                 <input
//                   type="checkbox"
//                   name="traveledOutsideCountry"
//                   checked={formData?.traveledOutsideCountry}
//                   onChange={handleChange}
//                   className="mt-1 mr-2"
//                   id="traveledOutsideCountry"
//                 />
//                 <label
//                   htmlFor="traveledOutsideCountry"
//                   className="block text-gray-600 text-sm font-medium"
//                 >
//                   Did you travel outside the country for any shoot?
//                 </label>
//               </div>

//               {formData?.traveledOutsideCountry && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 pl-6">
//                   <div>
//                     <label className="block text-gray-600 mb-1 text-xs">
//                       Country
//                     </label>
//                     {formData?.countriesTraveled?.length > 0 && (
//                       <div className="border p-2 rounded-lg flex flex-wrap gap-1 min-h-10 mb-2">
//                         {formData?.countriesTraveled.map((country, index) => (
//                           <div
//                             key={index}
//                             className="bg-gray-100 rounded-lg px-2 py-1 flex items-center text-xs"
//                           >
//                             {country}
//                             <button
//                               type="button"
//                               className="ml-1 text-gray-500 hover:text-gray-700"
//                               onClick={() => {
//                                 const newCountries = [
//                                   ...formData?.countriesTraveled,
//                                 ];
//                                 newCountries.splice(index, 1);
//                                 setFormData({
//                                   ...formData,
//                                   countriesTraveled: newCountries,
//                                 });
//                               }}
//                               aria-label={`Remove ${country}`}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={newCountry}
//                         onChange={(e) => setNewCountry(e.target.value)}
//                         placeholder="Enter country"
//                         className="border p-2 rounded-lg w-full text-sm"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (newCountry.trim() !== "") {
//                             setFormData({
//                               ...formData,
//                               countriesTraveled: [
//                                 ...formData?.countriesTraveled,
//                                 newCountry.trim(),
//                               ],
//                             });
//                             setNewCountry("");
//                           }
//                         }}
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Outside city travel section */}
//             <div className="mb-3 sm:mb-4 w-[50%]">
//               <div className="flex items-start mb-2">
//                 <input
//                   type="checkbox"
//                   name="traveledOutsideCity"
//                   checked={formData?.traveledOutsideCity}
//                   onChange={handleChange}
//                   className="mt-1 mr-2"
//                   id="traveledOutsideCity"
//                 />
//                 <label
//                   htmlFor="traveledOutsideCity"
//                   className="block text-gray-600 text-sm font-medium"
//                 >
//                   Did you travel outside the city for any shoot?
//                 </label>
//               </div>

//               {formData?.traveledOutsideCity && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 pl-6">
//                   <div>
//                     <label className="block text-gray-600 mb-1 text-xs">
//                       City
//                     </label>
//                     {formData?.citiesTraveled?.length > 0 && (
//                       <div className="border p-2 rounded-lg flex flex-wrap gap-1 min-h-10 mb-2">
//                         {formData?.citiesTraveled.map((city, index) => (
//                           <div
//                             key={index}
//                             className="bg-gray-100 rounded-lg px-2 py-1 flex items-center text-xs"
//                           >
//                             {city}
//                             <button
//                               type="button"
//                               className="ml-1 text-gray-500 hover:text-gray-700"
//                               onClick={() => {
//                                 const newCities = [...formData?.citiesTraveled];
//                                 newCities.splice(index, 1);
//                                 setFormData({
//                                   ...formData,
//                                   citiesTraveled: newCities,
//                                 });
//                               }}
//                               aria-label={`Remove ${city}`}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={newCity}
//                         onChange={(e) => setNewCity(e.target.value)}
//                         placeholder="Enter city"
//                         className="border p-2 rounded-lg w-full text-sm"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (newCity.trim() !== "") {
//                             setFormData({
//                               ...formData,
//                               citiesTraveled: [
//                                 ...formData?.citiesTraveled,
//                                 newCity.trim(),
//                               ],
//                             });
//                             setNewCity("");
//                           }
//                         }}
//                       >
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Open to travel for work */}
//           <div className="mb-2">
//             <label className="block text-gray-600 mb-1 text-sm font-medium">
//               Are you open to travel outside the city for work?
//             </label>
//             <div className="flex gap-4">
//               <label className="inline-flex items-center text-sm">
//                 <input
//                   type="radio"
//                   name="openToTravel"
//                   value="yes"
//                   checked={formData?.openToTravel === true}
//                   onChange={() =>
//                     setFormData({ ...formData, openToTravel: true })
//                   }
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="inline-flex items-center text-sm">
//                 <input
//                   type="radio"
//                   name="openToTravel"
//                   value="no"
//                   checked={formData?.openToTravel === false}
//                   onChange={() =>
//                     setFormData({ ...formData, openToTravel: false })
//                   }
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
//           <button
//             onClick={handleAttemptClose}
//             className="w-full py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="w-full py-2 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
//           >
//             Save Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusinessForm;




import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MapPin, Calendar, Instagram, Award, Camera } from "lucide-react";
import { stateCityData } from "@/utils/BusinessFormData";

const BusinessForm = ({ onClose, onSave }) => {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    vendorName: "",
    vendorType: "",
    freelancerCategory: "", // Added new field for freelancer category
    teamSize: 0,
    country: "",
    state: "",
    city: "",
    instagramHandle: "",
    avgBookingDays: 0,
    inHouseDesigner: "",
    traveledOutsideCountry: false,
    countriesTraveled: [],
    traveledOutsideCity: false,
    citiesTraveled: [],
    openToTravel: true,
    eventsOutsideCity: ["Wedding", "Couple", "Pre-Wedding"],
    eventsOutsideCountry: ["Wedding", "Couple", "Pre-Wedding"],
  });
  const [newCountry, setNewCountry] = useState("");
  const [newCity, setNewCity] = useState("");

  const handleAttemptClose = () => {
    setShowCloseConfirmation(true);
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false);
  };

  const handleConfirmClose = () => {
    setShowCloseConfirmation(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear freelancerCategory if vendor type changes to studio
    if (name === "vendorType" && value === "studio") {
      setFormData(prev => ({
        ...prev,
        freelancerCategory: ""
      }));
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleTeamSizeChange = (increment) => {
    setFormData({
      ...formData,
      teamSize: Math.max(1, formData?.teamSize + increment),
    });
  };

  const handleAvgDaysChange = (increment) => {
    setFormData({
      ...formData,
      avgBookingDays: Math.max(0, formData?.avgBookingDays + increment),
    });
  };

  const handleSave = () => {
    const newErrors = {};

    if (!formData?.vendorName) {
      newErrors.vendorName = "vendor name is required";
    }
    if (!formData?.vendorType) {
      newErrors.vendorType = "vendorType is required";
    }
    // Validate freelancer category only if vendor type is freelancer
    if (formData?.vendorType === "freelancer" && !formData?.freelancerCategory) {
      newErrors.freelancerCategory = "category is required";
    }
    if (!formData?.teamSize) {
      newErrors.teamSize = "team size is required";
    }
    if (!formData?.country) {
      newErrors.country = "country is required";
    }
    if (!formData?.state) {
      newErrors.state = "state is required";
    }
    if (!formData?.city) {
      newErrors.city = "city is required";
    }

    setErrors(newErrors);

    // Don't save if there are errors
    if (Object.keys(newErrors).length > 0) return;

    if (onSave) {
      onSave(formData);
    }
  };

  const cities = stateCityData[formData?.state] || [];

  return (
    <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
      <div className="bg-white max-w-5xl mx-auto rounded-xl p-4 sm:p-6 w-full shadow-xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={handleAttemptClose}
          className="absolute top-4 right-4 text-xl cursor-pointer hover:text-red-700"
          aria-label="Close"
        >
          <IoClose />
        </button>

        {showCloseConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
              <h3 className="text-lg font-bold mb-3">Don't leave!</h3>
              <p className="mb-4">
                If you leave now, your business registration will be cancelled
                and you'll be registered as a regular user.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelClose}
                  className="px-4 py-2 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66] text-sm"
                >
                  Continue Registration
                </button>
                <button
                  onClick={handleConfirmClose}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                >
                  Leave Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4">
          Business Information
        </h2>
        <p className="text-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
          Please fill the fields below to complete your registration
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Vendor Name */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Vendor name
            </label>
            <input
              type="text"
              name="vendorName"
              placeholder="Mohit Prajapati"
              value={formData?.vendorName}
              onChange={handleChange}
              className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.vendorName && (
              <span className="error text-xs" style={{ color: "red" }}>
                {errors.vendorName}
              </span>
            )}
          </div>

          {/* Register As */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Register as
            </label>
            <div className="relative">
              <select
                name="vendorType"
                value={formData?.vendorType}
                onChange={handleChange}
                className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
              >
                <option value="">Select Type</option>
                <option value="studio">Studio</option>
                <option value="freelancer">Freelancer</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              {errors.vendorType && (
                <span className="error text-xs" style={{ color: "red" }}>
                  {errors.vendorType}
                </span>
              )}
            </div>
          </div>

          {/* Freelancer Category (only shown when vendorType is freelancer) */}
          {formData.vendorType === "freelancer" && (
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">
                Category
              </label>
              <div className="relative">
                <select
                  name="freelancerCategory"
                  value={formData?.freelancerCategory}
                  onChange={handleChange}
                  className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="photographer">Photographer</option>
                  <option value="videographer">Videographer</option>
                  <option value="designer">Designer</option>
                  <option value="editor">Editor</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                {errors.freelancerCategory && (
                  <span className="error text-xs" style={{ color: "red" }}>
                    {errors.freelancerCategory}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Team Size */}
          <div className={formData.vendorType === "freelancer" ? "md:col-start-1" : ""}>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Team Size
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleTeamSizeChange(-1)}
                className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                aria-label="Decrease team size"
              >
                <span className="text-lg">−</span>
              </button>
              <input
                type="text"
                name="teamSize"
                value={formData?.teamSize}
                onChange={handleChange}
                className="border p-2 rounded-lg mx-2 w-full text-center text-sm"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleTeamSizeChange(1)}
                className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                aria-label="Increase team size"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
            {errors.teamSize && (
              <span className="error text-xs" style={{ color: "red" }}>
                {errors.teamSize}
              </span>
            )}
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              <span className="flex items-center">
                <Instagram className="w-4 h-4 mr-1" /> Instagram Handle
              </span>
            </label>
            <div className="flex w-full">
              <div className="bg-gray-100 p-2 rounded-l-xl text-gray-500 border border-r-0 text-sm whitespace-nowrap">
                https://
              </div>
              <input
                type="text"
                name="instagramHandle"
                placeholder="instagram.com/example"
                value={formData?.instagramHandle}
                onChange={handleChange}
                className="border p-2 rounded-r-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Location Group */}
          <div className="md:col-span-2 xl:col-span-1">
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> Location
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {/* Country */}
              <div>
                <div className="flex items-center border p-2 rounded-xl">
                  <span className="mr-2">🇮🇳</span>
                  <input
                    type="text"
                    name="country"
                    placeholder="India"
                    value={formData?.country}
                    onChange={handleChange}
                    className="w-full outline-none text-sm"
                  />
                </div>
                {errors.country && (
                  <span className="error text-xs" style={{ color: "red" }}>
                    {errors.country}
                  </span>
                )}
              </div>

              {/* State */}
              <div className="relative">
                <select
                  name="state"
                  value={formData?.state}
                  onChange={handleChange}
                  className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
                >
                  <option value="">Select State</option>
                  {Object.keys(stateCityData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.state && (
                  <span className="error text-xs" style={{ color: "red" }}>
                    {errors.state}
                  </span>
                )}
              </div>

              {/* City */}
              <div className="relative">
                <select
                  name="city"
                  value={formData?.city}
                  onChange={handleChange}
                  disabled={!formData?.state}
                  className="border p-2 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.city && (
                  <span className="error text-xs" style={{ color: "red" }}>
                    {errors.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Professional Info Group */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Avg booking days/month
              </span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleAvgDaysChange(-1)}
                className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                aria-label="Decrease booking days"
              >
                <span className="text-lg">−</span>
              </button>
              <input
                type="text"
                name="avgBookingDays"
                value={formData?.avgBookingDays}
                onChange={handleChange}
                className="border p-2 rounded-lg mx-2 w-full text-center text-sm"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleAvgDaysChange(1)}
                className="border p-1 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                aria-label="Increase booking days"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>

          {/* Do you have an in house designer? */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Do you have an in house designer?
            </label>
            <div className="relative">
              <select
                name="inHouseDesigner"
                value={formData?.inHouseDesigner}
                onChange={handleChange}
                className="border p-2 rounded-xl w-full text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select Option</option>
                <option value="I outsource">I outsource</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Information Section */}
        <div className="mt-4 sm:mt-6 border-t pt-4">
          <h3 className="font-medium text-base sm:text-md mb-3">
            Travel Information
          </h3>
          <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
            {/* Outside country travel section */}
            <div className="mb-3 sm:mb-4 w-full sm:w-1/2">
              <div className="flex items-start mb-2">
                <input
                  type="checkbox"
                  name="traveledOutsideCountry"
                  checked={formData?.traveledOutsideCountry}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                  id="traveledOutsideCountry"
                />
                <label
                  htmlFor="traveledOutsideCountry"
                  className="block text-gray-600 text-sm font-medium"
                >
                  Did you travel outside the country for any shoot?
                </label>
              </div>

              {formData?.traveledOutsideCountry && (
                <div className="mt-2 pl-6">
                  <label className="block text-gray-600 mb-1 text-xs">
                    Country
                  </label>
                  {formData?.countriesTraveled?.length > 0 && (
                    <div className="border p-2 rounded-lg flex flex-wrap gap-1 min-h-10 mb-2">
                      {formData?.countriesTraveled.map((country, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 rounded-lg px-2 py-1 flex items-center text-xs"
                        >
                          {country}
                          <button
                            type="button"
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              const newCountries = [
                                ...formData?.countriesTraveled,
                              ];
                              newCountries.splice(index, 1);
                              setFormData({
                                ...formData,
                                countriesTraveled: newCountries,
                              });
                            }}
                            aria-label={`Remove ${country}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      placeholder="Enter country"
                      className="border p-2 rounded-lg w-full text-sm"
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
                      onClick={() => {
                        if (newCountry.trim() !== "") {
                          setFormData({
                            ...formData,
                            countriesTraveled: [
                              ...formData?.countriesTraveled,
                              newCountry.trim(),
                            ],
                          });
                          setNewCountry("");
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Outside city travel section */}
            <div className="mb-3 sm:mb-4 w-full sm:w-1/2">
              <div className="flex items-start mb-2">
                <input
                  type="checkbox"
                  name="traveledOutsideCity"
                  checked={formData?.traveledOutsideCity}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                  id="traveledOutsideCity"
                />
                <label
                  htmlFor="traveledOutsideCity"
                  className="block text-gray-600 text-sm font-medium"
                >
                  Did you travel outside the city for any shoot?
                </label>
              </div>

              {formData?.traveledOutsideCity && (
                <div className="mt-2 pl-6">
                  <label className="block text-gray-600 mb-1 text-xs">
                    City
                  </label>
                  {formData?.citiesTraveled?.length > 0 && (
                    <div className="border p-2 rounded-lg flex flex-wrap gap-1 min-h-10 mb-2">
                      {formData?.citiesTraveled.map((city, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 rounded-lg px-2 py-1 flex items-center text-xs"
                        >
                          {city}
                          <button
                            type="button"
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              const newCities = [...formData?.citiesTraveled];
                              newCities.splice(index, 1);
                              setFormData({
                                ...formData,
                                citiesTraveled: newCities,
                              });
                            }}
                            aria-label={`Remove ${city}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Enter city"
                      className="border p-2 rounded-lg w-full text-sm"
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-gray-100 rounded-lg text-sm"
                      onClick={() => {
                        if (newCity.trim() !== "") {
                          setFormData({
                            ...formData,
                            citiesTraveled: [
                              ...formData?.citiesTraveled,
                              newCity.trim(),
                            ],
                          });
                          setNewCity("");
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Open to travel for work */}
          <div className="mb-2">
            <label className="block text-gray-600 mb-1 text-sm font-medium">
              Are you open to travel outside the city for work?
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  name="openToTravel"
                  value="yes"
                  checked={formData?.openToTravel === true}
                  onChange={() =>
                    setFormData({ ...formData, openToTravel: true })
                  }
                  className="mr-2"
                />
                Yes
              </label>
              <label className="inline-flex items-center text-sm">
                <input
                  type="radio"
                  name="openToTravel"
                  value="no"
                  checked={formData?.openToTravel === false}
                  onChange={() =>
                    setFormData({ ...formData, openToTravel: false })
                  }
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={handleAttemptClose}
            className="w-full py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full py-2 rounded-xl bg-[#892580] text-white hover:bg-[#6d1d66] text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;