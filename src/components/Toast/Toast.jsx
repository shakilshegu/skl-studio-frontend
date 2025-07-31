// components/Toast/Toast.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

export const showToast = (message, type = "success") => {
  if (type === "success") {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (type === "error") {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

// Toast component to render the ToastContainer globally (to show toast messages)
const Toast = () => {
  return <ToastContainer/>;
};

export default Toast;
