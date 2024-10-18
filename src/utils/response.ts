interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown; // Use 'unknown' instead of 'any'
}

// Utility function for success response
export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

// Utility function for error response
export const errorResponse = (message: string, error?: unknown): ApiResponse<null> => {
  return {
    success: false,
    message,
    error,
  };
};
