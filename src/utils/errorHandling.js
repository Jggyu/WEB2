import { toast } from 'react-toastify';

export const handleError = (error, customMessage = '') => {
  console.error(error);
  
  let message = customMessage || '오류가 발생했습니다.';
  
  if (error.response) {
    // API 에러 응답
    message = error.response.data.message || message;
  } else if (error.message) {
    // 일반 에러 메시지
    message = error.message;
  }

  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,
  });
};