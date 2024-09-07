interface CustomError extends Error {
    statusCode?: number;
    data?: any;
  }
  
  export const createError = (message: string, statusCode: number = 500, data?: any): CustomError => {
    const error = new Error(message) as CustomError;
    error.statusCode = statusCode;
    error.data = data;
    return error;
  };
  
  export const handleError = (error: any) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const data = error.data || null;
    
    console.error(`[ERROR] Status: ${statusCode}, Message: ${message}, Data: ${JSON.stringify(data)}`);
    
    return { statusCode, message, data };
  };
  