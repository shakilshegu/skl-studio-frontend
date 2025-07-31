import { useState } from "react";
import {
  Calendar,
  Clock,
  Camera,
  Phone,
  Mail,
  Package,
  Wrench,
  Users,
  Star,
  User,
  Briefcase,
} from "lucide-react";
import moment from "moment";

export default function UserInitiation({ role, bookingData, setActiveStep }) {
  const dates = bookingData?.bookingDates || "";
  const packages = bookingData?.packages || [];
  const services = bookingData?.services || [];
  const equipments = bookingData?.equipments || [];
  const helpers = bookingData?.helpers || [];

  const adminPackage = bookingData?.adminPackage;
  const adminPackageData = bookingData?.adminPackageBookingId?.packageId;

  const [activeTab, setActiveTab] = useState(
    adminPackage ? "Aloka Package" : "Services"
  );

  const tabs = adminPackage
    ? ["Aloka Package"]
    : ["Services", "Packages", "Equipments", "Helpers"];

  // Safe destructuring with fallbacks
  const entityData = bookingData?.entityDetails || {};
  const { name, mobileNumber, email, image } = entityData;

  // Get tab icon
  const getTabIcon = (tabName) => {
    switch (tabName) {
      case "Services":
        return <Briefcase size={16} />;
      case "Packages":
        return <Package size={16} />;
      case "Equipments":
        return <Wrench size={16} />;
      case "Helpers":
        return <Users size={16} />;
      default:
        return null;
    }
  };

  // Get tab count
  const getTabCount = (tabName) => {
    switch (tabName) {
      case "Services":
        return services?.length || 0;
      case "Packages":
        return packages?.length || 0;
      case "Equipments":
        return equipments?.length || 0;
      case "Helpers":
        return helpers?.length || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 ">
      <div className=" mx-auto space-y-6">
        {/* Header Section */}
        {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-[#892580] px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 p-3 rounded-xl">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1">
                                        Booking Overview
                                    </h1>
                                    <p className="text-green-100">
                                        Review your booking details and selected services
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 rounded-xl px-4 py-2">
                                    <div className="text-lg font-bold text-white">{bookingData?.customBookingId || 'N/A'}</div>
                                    <div className="text-green-100 text-sm">Booking ID</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

        {/* Partner Information Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Camera className="text-white" />
              Service Provider Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Partner Profile */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                {image ? (
                  <img
                    src={image}
                    alt="Service Provider"
                    className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {name || "N/A"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} className="text-[#892580]" />
                    <span className="text-sm">{mobileNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={16} className="text-[#892580]" />
                    <span className="text-sm">{email || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Dates */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="text-[#892580]" size={20} />
                Scheduled Dates
              </h4>
              <div className="space-y-3">
                {Array.isArray(dates) &&
                  [...dates] // clone to avoid mutating original
                    .sort((a, b) => new Date(a.date) - new Date(b.date)) // ascending sort
                    .map((dateObj, index) => {
                      const formattedDate = moment(dateObj.date).format(
                        "MMMM Do YYYY, dddd"
                      );
                      const start = moment({ hour: dateObj.startTime }).format(
                        "hh:mm A"
                      );
                      const end = moment({ hour: dateObj.endTime }).format(
                        "hh:mm A"
                      );
                      const duration = dateObj.endTime - dateObj.startTime;
                      const hoursText = `${duration}hr${
                        duration > 1 ? "s" : ""
                      }`;

                      return (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100"
                        >
                          <div className="flex items-center gap-3 text-sm text-gray-700 mb-2">
                            <div className="bg-green-100 p-1 rounded-lg">
                              <Calendar size={14} className="text-[#892580]" />
                            </div>
                            <span className="font-medium">{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <div className="bg-blue-100 p-1 rounded-lg">
                              <Clock size={14} className="text-blue-600" />
                            </div>
                            {dateObj.isWholeDay ? (
                              <span className="font-medium">Whole Day</span>
                            ) : (
                              <span className="font-medium">{`${start} - ${end} (${hoursText})`}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>

        {/* Services/Items Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs Header */}
          <div className="bg-gray-50 px-8 py-4 border-b">
            <div className="flex justify-center">
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                {tabs.map((tab) => {
                  const count = getTabCount(tab);
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-[#892580] text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {getTabIcon(tab)}
                      <span>{tab}</span>
                      {!adminPackage && (
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            activeTab === tab
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/*Admin package Tab Content */}
          {adminPackage && (
            <div className="p-8">
              {activeTab === "Aloka Package" && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {adminPackageData ? (
                    <div
                      key={adminPackageData?._id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                    >
                      <div className="relative">
                        <img
                          src={adminPackageData.photo}
                          alt={adminPackageData.name}
                          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#892580] transition-colors">
                          {adminPackageData?.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {adminPackageData?.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="bg-[#892580] text-white px-4 py-2 rounded-lg font-bold">
                            ₹{adminPackageData.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                        <Briefcase className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Services
                      </h3>
                      <p className="text-gray-500">
                        No services have been added to this booking.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!adminPackage && (
            <div className="p-8">
              {activeTab === "Services" && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {services?.length > 0 ? (
                    services?.map((service) => (
                      <div
                        key={service?._id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                      >
                        <div className="relative">
                          <img
                            src={service?.serviceId?.photo}
                            alt={service?.serviceId?.name}
                            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-[#892580] text-white px-3 py-1 rounded-full text-sm font-bold">
                            x{service?.count}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#892580] transition-colors">
                            {service?.serviceId?.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {service?.serviceId?.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="bg-[#892580] text-white px-4 py-2 rounded-lg font-bold">
                              ₹{service?.serviceId?.price}
                            </div>
                            <div className="text-gray-600 text-sm font-medium">
                              Qty: {service?.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                        <Briefcase className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Services
                      </h3>
                      <p className="text-gray-500">
                        No services have been added to this booking.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Packages" && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {packages.length > 0 ? (
                    packages.map((packageItem) => (
                      <div
                        key={packageItem._id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                      >
                        <div className="relative">
                          <img
                            src={packageItem?.packageId?.photo}
                            alt={packageItem?.packageId?.name}
                            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            x{packageItem?.count}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#892580] transition-colors">
                            {packageItem?.packageId?.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {packageItem?.packageId?.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="bg-[#892580] text-white px-4 py-2 rounded-lg font-bold">
                              ₹{packageItem?.packageId?.price}
                            </div>
                            <div className="text-gray-600 text-sm font-medium">
                              Qty: {packageItem?.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Packages
                      </h3>
                      <p className="text-gray-500">
                        No packages have been added to this booking.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Equipments" && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {equipments.length > 0 ? (
                    equipments?.map((equipment) => (
                      <div
                        key={equipment?._id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                      >
                        <div className="relative">
                          <img
                            src={equipment?.equipmentId?.photo}
                            alt={equipment?.equipmentId?.name}
                            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            x{equipment?.count}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#892580] transition-colors">
                            {equipment?.equipmentId?.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {equipment?.equipmentId?.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="bg-[#892580] text-white px-4 py-2 rounded-lg font-bold">
                              ₹{equipment?.equipmentId?.price}
                            </div>
                            <div className="text-gray-600 text-sm font-medium">
                              Qty: {equipment?.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                        <Wrench className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Equipment
                      </h3>
                      <p className="text-gray-500">
                        No equipment has been added to this booking.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Helpers" && (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {helpers.length > 0 ? (
                    helpers.map((helper) => (
                      <div
                        key={helper._id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                      >
                        <div className="p-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
                            <Users className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#892580] transition-colors">
                            {helper?.helperId?.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {helper?.helperId?.description}
                          </p>
                          <div className="bg-[#892580] text-white px-4 py-2 rounded-lg font-bold inline-block">
                            ₹{helper?.helperId?.price}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Helpers
                      </h3>
                      <p className="text-gray-500">
                        No helpers have been added to this booking.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            className="px-8 py-3 bg-[#892580] text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-medium shadow-lg"
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
