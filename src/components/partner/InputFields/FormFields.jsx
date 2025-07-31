import React from 'react';
import { X, Upload } from 'lucide-react';

// Base Input Component
export const InputField = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
};

// Select Component
export const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option", 
  required = false, 
  disabled = false,
  loading = false,
  className = "",
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled || loading}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && (
        <p className="text-sm text-gray-500 mt-1">Loading options...</p>
      )}
    </div>
  );
};

// Textarea Component
export const TextareaField = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  rows = 4, 
  required = false, 
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
};

// File Upload Component
export const FileUpload = ({ 
  label, 
  accept = "image/*", 
  multiple = false, 
  onFileChange, 
  placeholder = "Drop your files here or Browse", 
  maxSize = "5MB",
  uploadedFiles = [],
  onRemoveFile,
  className = "",
  uploadImage = "/Assets/partner/image12.png"
}) => {
  const inputId = `file-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#892580] transition-colors">
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onFileChange}
        />
        <label htmlFor={inputId} className="cursor-pointer">
          <div className="flex flex-col items-center">
            <img src={uploadImage} alt="Upload" className="w-16 h-16 mb-4" />
            <p className="text-gray-600">
              {placeholder.split('Browse')[0]}
              <span className="text-[#892580] font-medium hover:underline">
                Browse
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Maximum size: {maxSize}</p>
          </div>
        </label>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <img
                src={file.preview}
                alt="Preview"
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                {file.progress !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-[#892580] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {file.progress}% uploaded
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => onRemoveFile(file.name || index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Section Header Component
export const SectionHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Icon size={20} className="text-[#892580]" />
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};

// Submit Button Component
export const SubmitButton = ({ 
  children, 
  loading = false, 
  loadingText = "Loading...", 
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={`bg-[#892580] hover:bg-[#711f68] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#892580] focus:ring-offset-2 ${className}`}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
};