"use client";
import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Users, 
  Phone, 
  Mail, 
  Briefcase,
  Search,
  Filter,
  Download,
  MoreVertical,
  UserPlus
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../services/TeamMembers/teamMember.service";
import { showToast } from "@/components/Toast/Toast";

const MemberPlaceholder = "/Assets/partner/TeamMumber.svg";

const TeamMembersTable = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [viewMember, setViewMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    mobile: "",
    email: "",
    description: "",
  });
  const fileInputRef = useRef(null);

  // Fetch team members data
  const {
    data: teamMembersData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });

  const teamMembers = teamMembersData?.data || [];

  // Filter team members based on search and role
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.mobile?.includes(searchTerm);
    const matchesRole = roleFilter === "" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Add team member mutation
  const addMutation = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      resetForm();
    },
    onError: (error) => {
      console.error("Error adding team member:", error);
      showToast("Failed to add team member. Please try again.","error");
    },
  });

  // Update team member mutation
  const updateMutation = useMutation({
    mutationFn: updateTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating team member:", error);
      showToast("Failed to update team member. Please try again.","error");
    },
  });

  // Delete team member mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error) => {
      console.error("Error deleting team member:", error);
      showToast("Failed to delete team member. Please try again.","error");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB","error");
        return;
      }
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", role: "", mobile: "", email: "", description: "" });
    setSelectedImage(null);
    setImageFile(null);
    setEditingIndex(null);
    setIsModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddOrUpdateMember = () => {
    if (!formData.name || !formData.role || !formData.mobile || !formData.email) {
      showToast("Please fill all required fields!","error");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (imageFile) {
      formDataToSend.append("photo", imageFile);
    }

    if (editingIndex !== null) {
      const memberToUpdate = teamMembers[editingIndex];
      updateMutation.mutate({
        id: memberToUpdate.id,
        data: formDataToSend,
      });
    } else {
      addMutation.mutate(formDataToSend);
    }
  };

  const handleEdit = (index) => {
    const member = teamMembers[index];
    setFormData({
      name: member.name,
      role: member.role,
      mobile: member.mobile,
      email: member.email,
      description: member.description || "",
    });
    setSelectedImage(member.image);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleView = (member) => {
    setViewMember(member);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      const memberToDelete = teamMembers[index];
      deleteMutation.mutate(memberToDelete._id);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'Cameraman': 'bg-blue-100 text-blue-800 border-blue-200',
      'Videographer': 'bg-purple-100 text-purple-800 border-purple-200',
      'Editor': 'bg-green-100 text-green-800 border-green-200',
      'Helper': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'Cameraman': return '📷';
      case 'Videographer': return '🎥';
      case 'Editor': return '✂️';
      case 'Helper': return '🤝';
      default: return '👤';
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-8 rounded-xl bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-8 rounded-xl bg-white shadow-sm">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Team Members</h3>
          <p className="text-gray-600 mb-4">There was an error loading your team members.</p>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["teamMembers"] })}
            className="bg-[#892580] text-white px-6 py-2 rounded-lg hover:bg-[#a32d96] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#892580] text-white px-6 py-2.5 rounded-lg hover:bg-[#a32d96] transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
            >
              <UserPlus size={18} />
              Add Team Member
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        {teamMembers.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent min-w-[150px]"
              >
                <option value="">All Roles</option>
                <option value="Cameraman">Cameraman</option>
                <option value="Videographer">Videographer</option>
                <option value="Editor">Editor</option>
                <option value="Helper">Helper</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {teamMembers.length === 0 ? (
        // No Data State
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-[#892580] to-[#a32d96] rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Team Members Yet</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start building your dream team! Add team members to collaborate and manage your projects effectively.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#892580] to-[#a32d96] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto font-medium"
            >
              <UserPlus size={20} />
              Add Your First Team Member
            </button>
          </div>
        </div>
      ) : filteredMembers.length === 0 ? (
        // No Search Results
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">
              No team members match your search criteria. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("");
              }}
              className="text-[#892580] hover:text-[#a32d96] font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        // Table Content
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member, index) => (
                  <tr
                    key={member.id || index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={member.image || MemberPlaceholder}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                        <span>{getRoleIcon(member.role)}</span>
                        {member.role}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {member.mobile}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          {member.email}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {member.description || "No description provided"}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleView(member)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="Edit Member"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingIndex !== null ? "Update Team Member" : "Add Team Member"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Please fill in the details below
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <label className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#892580] transition-colors group">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Plus className="text-gray-400 group-hover:text-[#892580] transition-colors" size={24} />
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      accept="image/*"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Profile Photo</h3>
                  <p className="text-sm text-gray-600 mb-3">Upload a photo for this team member</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#a32d96] transition-colors text-sm"
                  >
                    Choose Photo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Cameraman">📷 Cameraman</option>
                    <option value="Videographer">🎥 Videographer</option>
                    <option value="Editor">✂️ Editor</option>
                    <option value="Helper">🤝 Helper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter description or additional notes..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateMember}
                  className="px-6 py-2.5 bg-[#892580] text-white rounded-lg hover:bg-[#a32d96] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  {addMutation.isPending || updateMutation.isPending
                    ? "Processing..."
                    : editingIndex !== null
                    ? "Update Member"
                    : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
                <button
                  onClick={() => setViewMember(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <img
                  src={viewMember.image || MemberPlaceholder}
                  alt={viewMember.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-semibold text-gray-900 mt-4">{viewMember.name}</h3>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getRoleColor(viewMember.role)}`}>
                  <span>{getRoleIcon(viewMember.role)}</span>
                  {viewMember.role}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-[#892580]" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-medium text-gray-900">{viewMember.mobile}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-[#892580]" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{viewMember.email}</p>
                  </div>
                </div>
                
                {viewMember.description && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-900">{viewMember.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersTable;