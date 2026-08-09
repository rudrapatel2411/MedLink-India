// MedLink India — Standardized API Response Utility

export class ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  meta?: any;

  constructor(statusCode: number, message: string, data: any = null, meta?: any) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}

export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: any[];

  constructor(statusCode: number, message: string, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Async handler wrapper to catch errors in controllers
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
