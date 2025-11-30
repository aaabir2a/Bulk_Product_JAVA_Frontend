import apiClient from './api-client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface ProductMetadata {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  brand?: string;
  weight?: number;
  stockQuantity?: number;
}

export interface ProductResponse {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  brand?: string;
  weight?: number;
  stockQuantity?: number;
  imageUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProductListResponse {
  products: ProductResponse[];
  totalProducts: number;
}

export interface BulkUploadResponse {
  totalUploaded: number;
  successCount: number;
  failureCount: number;
  products: ProductResponse[];
  errors: UploadError[];
  success: boolean;
  message: string;
}

export interface UploadError {
  index: number;
  filename: string;
  errorMessage: string;
  errorCode: string;
}

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
};

// Product API
export const productAPI = {
  bulkUpload: async (
    files: File[],
    metadata: ProductMetadata[],
    onProgress?: (progress: number) => void
  ): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    
    // Add files
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Add metadata as JSON string
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await apiClient.post('/products/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  },

  getAll: async (): Promise<ProductListResponse> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getImageUrl: (productId: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    return `${baseUrl}/products/${productId}/image`;
  },
};
