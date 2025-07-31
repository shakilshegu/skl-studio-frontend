import { useState } from "react";
import PortfolioItem from "./PortfolioItem";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deletePortfolio } from "../../services/Portfolio/portfolio.service";
import { showToast } from "@/components/Toast/Toast";

const PortfolioGrid = ({ portfolios = [], onEdit }) => {
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const queryClient = useQueryClient();

  // Delete portfolio mutation
  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      setMenuOpenIndex(null);
    },
    onError: (error) => {
      console.error("Failed to delete portfolio:", error);
      showToast("Failed to delete portfolio. Please try again.","error");
    },
  });

  const handleToggleMenu = (index) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  const handleEdit = (portfolio) => {
    const portfolioIndex = portfolios.findIndex(p => p._id === portfolio._id);
    if (portfolioIndex !== -1) {
      onEdit(portfolioIndex);
    }
    setMenuOpenIndex(null);
  };

  const handleDelete = (portfolioId) => {
    const portfolio = portfolios.find(p => p._id === portfolioId);
    if (!portfolio) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${portfolio.title || 'this portfolio'}"? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      deleteMutation.mutate(portfolioId);
    }
    setMenuOpenIndex(null);
  };

  // Loading state
  if (deleteMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[#892580] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Deleting portfolio...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
        <p className="text-gray-500 mb-4">Start by creating your first portfolio to showcase your work.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Corrected Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-4">
        {portfolios.map((portfolio, index) => (
          <div key={portfolio._id || index} className="w-full">
            <PortfolioItem
              portfolio={portfolio}
              index={index}
              menuOpen={menuOpenIndex === index}
              onToggleMenu={handleToggleMenu}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {/* Error Message */}
      {deleteMutation.isError && (
        <div className="mt-4 mx-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">
              Failed to delete portfolio. Please try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;