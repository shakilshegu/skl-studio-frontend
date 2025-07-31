// components/Confirmation/Confirmation.js
'use client'
import React, { useState } from 'react';

let confirmationState = {
  isOpen: false,
  message: '',
  resolve: null
};

let setConfirmationState = null;

export const showConfirm = (message,type="green") => {
  return new Promise((resolve) => {
    confirmationState = {
      isOpen: true,
      message,
      type,
      resolve
    };
    if (setConfirmationState) {
      setConfirmationState({ ...confirmationState });
    }
  });
};

const Confirmation = () => {
  const [state, setState] = useState(confirmationState);
  
  React.useEffect(() => {
    setConfirmationState = setState;
  }, []);

  const handleConfirm = () => {
    state.resolve(true);
    setState({ isOpen: false, message: '', resolve: null });
  };

  const handleCancel = () => {
    state.resolve(false);
    setState({ isOpen: false, message: '', resolve: null });
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Action</h3>
          <p className="text-gray-600 mb-6">{state.message}</p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleCancel}
              className="flex-1 py-2 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
<button 
  onClick={handleConfirm}
  className={`flex-1 py-2 px-4 ${
    state.type === "green"
      ? "bg-green-500 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700"
  } text-white rounded-md font-medium transition-colors`}
>
  Confirm
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;