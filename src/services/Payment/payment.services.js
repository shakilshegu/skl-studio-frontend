import axiosInstance from "../../config/axios.js";


export const createOrderService = async (data) => {
    try {
      
 const response = await axiosInstance.post('/user/payment/create-order',data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching studio details');
    }
  }
export const createCustomOrderService = async (data) => {
    try {
      
      const response = await axiosInstance.post('/user/payment/create-custom-order',data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching studio details');
    }
  }

  export const verifyPaymentService = async (paymentData) => {
    try {
      const response = await axiosInstance.post('/user/payment/verify', paymentData);
      return response.data;
    } catch (error) {
      throw new Error('Error verifying payment');
    }
  };
  export const verifyCustomPaymentService = async (paymentData) => {
    try {
      const response = await axiosInstance.post('/user/payment/custom-verify', paymentData);
      return response.data;
    } catch (error) {
      throw  error;
    } 
  };

  export const declineRequest = async (requestId) => {
    try {
      const response = await axiosInstance.patch(`/user/payment/decline/${requestId}`);
      return response.data;
    } catch (error) {
      throw  error;
    }
  };


export const downloadInvoicePDF = async (bookingId,customBookingId) => {
  try {
    const response = await axiosInstance.get(`/user/payment/invoices/download/${bookingId}`, {
      responseType: 'blob', // Important: This tells axios to expect binary data
      headers: {
        'Accept': 'application/pdf',
      },
    });

    // Create a blob from the response data
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Get filename from response headers if available
    const contentDisposition = response.headers['content-disposition'];
    let filename = `Invoice_${customBookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: 'Invoice downloaded successfully',
      filename: filename
    };

  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    
    throw error
    // Handle different error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error('Booking or invoices not found');
        case 403:
          throw new Error('You are not authorized to download this invoice');
        case 500:
          throw new Error('Server error while generating PDF. Please try again later.');
        default:
          throw new Error(`Failed to download invoice: ${error.response.status}`);
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('Failed to initiate download. Please try again.');
    }
  }
};
