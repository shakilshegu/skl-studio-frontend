import axiosInstance from "../../config/axios.js";


export const loginWithCredentials = async (username, password,   isPartnerLogin) => {
    try {  
      
      const response = await axiosInstance.post('/auth/login', { 
        username, 
        password ,
        isPartnerLogin
      });
      return response.data;
    } catch (error) {        
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to login';
      throw new Error(errorMessage);
    }
  };



export const sendOTP = async (phoneNumber) => {
    try {
        const response = await axiosInstance.post('/auth/send-otp', { mobileNumber: phoneNumber });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to login';
        console.error('Error sending OTP:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const verifyOTP = async (phoneNumber, otp) => {
    try {
        const response = await axiosInstance.post('/auth/verify-otp', { mobileNumber: phoneNumber, otpCode: otp });
        return response.data;

    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to login';
        console.error('Error sending OTP:', errorMessage);
        throw new Error(errorMessage);
    }
}

// 🎯 NEW: Password Reset Service Functions
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { 
      email 
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.msg || 
                        error.message || 
                        'Failed to send reset email';
    console.error('Error sending forgot password email:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const verifyResetToken = async (token) => {
  try {
    const response = await axiosInstance.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.msg || 
                        error.message || 
                        'Invalid or expired token';
    console.error('Error verifying reset token:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.msg || 
                        error.message || 
                        'Failed to reset password';
    console.error('Error resetting password:', errorMessage);
    throw new Error(errorMessage);
  }
};