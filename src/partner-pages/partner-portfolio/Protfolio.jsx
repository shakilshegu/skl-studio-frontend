"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPortfolios } from "../../services/Portfolio/portfolio.service";
import PortfolioGrid from "./PortfolioGrid";
import PortfolioForm from "./PortfolioForm";
import { Plus, FolderOpen } from "lucide-react";

const PortfolioPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const queryClient = useQueryClient();

  // Fetch portfolios
  const { data, isLoading } = useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
  });
  const portfolios = data?.data || [];

  const handleOpenModal = (index = null) => {
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Fixed Header Section with Proper Justify-Between */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FolderOpen className="text-[#892580]" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#892580]">
                Portfolio
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Showcase your best work and attract potential clients
              </p>
            </div>
          </div>
          
          {/* Always show Add Portfolio button when there are portfolios */}
          {portfolios.length > 0 && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#892580] text-white px-6 py-2.5 rounded-lg hover:bg-[#711f68] transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
            >
              <Plus size={18} />
              Add Portfolio
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#892580]"></div>
              Loading portfolios...
            </div>
          </div>
        </div>
      ) : portfolios.length === 0 ? (
        // No Data State
        <div className="bg-white p-12">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Portfolio Yet
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Create your first portfolio to display your best projects and
              attract potential clients.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-[#892580] to-[#a32d96] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto font-medium"
            >
              <Plus size={20} />
              Add Your First Portfolio
            </button>

            {/* Additional info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[#892580] rounded-full"></div>
                  Upload images
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[#892580] rounded-full"></div>
                  Add descriptions
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[#892580] rounded-full"></div>
                  Attract clients
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Portfolio Grid
        <div className="bg-white p-6">
          <PortfolioGrid portfolios={portfolios} onEdit={handleOpenModal} />
        </div>
      )}

      {/* Portfolio Form Modal */}
      {isOpen && (
        <PortfolioForm
          isOpen={isOpen}
          onClose={handleCloseModal}
          editingIndex={editingIndex}
          portfolio={editingIndex !== null ? portfolios[editingIndex] : null}
        />
      )}
    </div>
  );
};

export default PortfolioPage;