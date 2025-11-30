'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAPI, ProductMetadata } from '@/lib/api';

interface FileWithMetadata {
  file: File;
  metadata: ProductMetadata;
  preview?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');
    if (!token) {
      router.push('/auth/login');
    } else {
      setUsername(user || '');
    }
  }, [router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (files: File[]) => {
    const newFilesWithMetadata: FileWithMetadata[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      metadata: {
        name: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        price: 0,
        category: 'Electronics',
        sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        brand: '',
        weight: 0,
        stockQuantity: 0,
      },
    }));
    setFilesWithMetadata(prev => [...prev, ...newFilesWithMetadata]);
  };

  const removeFile = (index: number) => {
    setFilesWithMetadata(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].preview) {
        URL.revokeObjectURL(prev[index].preview!);
      }
      return updated;
    });
  };

  const updateMetadata = (index: number, field: keyof ProductMetadata, value: any) => {
    setFilesWithMetadata(prev => {
      const updated = [...prev];
      updated[index].metadata = { ...updated[index].metadata, [field]: value };
      return updated;
    });
  };

  const handleUpload = async () => {
    if (filesWithMetadata.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const files = filesWithMetadata.map(f => f.file);
    const metadata = filesWithMetadata.map(f => f.metadata);

    try {
      const result = await productAPI.bulkUpload(files, metadata, (progress) => {
        setUploadProgress(progress);
      });
      setUploadResult(result);
      
      // Clean up previews
      filesWithMetadata.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFilesWithMetadata([]);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Upload System</h1>
            <p className="text-gray-600">Upload multiple products with detailed information</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, <span className="font-semibold text-gray-900">{username}</span></span>
            <Link
              href="/products"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              View Products
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-xl p-12 text-center transition ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Drop your product images here
            </h3>
            <p className="text-gray-600 mb-4">or click to browse files</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-blue-700 transition"
            >
              Choose Files
            </label>
          </div>

          {/* Product Details Form */}
          {filesWithMetadata.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Product Details ({filesWithMetadata.length} {filesWithMetadata.length === 1 ? 'item' : 'items'})
              </h4>
              
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {filesWithMetadata.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition"
                      title="Remove"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Image Preview */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                        <img
                          src={item.preview}
                          alt={item.file.name}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-2 truncate">{item.file.name}</p>
                      </div>

                      {/* Product Details Grid */}
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.metadata.name}
                            onChange={(e) => updateMetadata(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="Enter product name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.metadata.price}
                            onChange={(e) => updateMetadata(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={item.metadata.category}
                            onChange={(e) => updateMetadata(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          >
                            <option>Electronics</option>
                            <option>Clothing</option>
                            <option>Home & Garden</option>
                            <option>Sports</option>
                            <option>Books</option>
                            <option>Toys</option>
                            <option>Food & Beverage</option>
                            <option>Beauty</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.metadata.sku}
                            onChange={(e) => updateMetadata(index, 'sku', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="SKU-XXX"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand
                          </label>
                          <input
                            type="text"
                            value={item.metadata.brand || ''}
                            onChange={(e) => updateMetadata(index, 'brand', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="Brand name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            value={item.metadata.stockQuantity || 0}
                            onChange={(e) => updateMetadata(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="0"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={item.metadata.description}
                            onChange={(e) => updateMetadata(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 resize-none"
                            placeholder="Product description..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : `Upload ${filesWithMetadata.length} Product${filesWithMetadata.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between text-gray-900 mb-2">
                <span>Upload Progress</span>
                <span className="font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="mt-6 space-y-4">
              {uploadResult.successCount > 0 && (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-emerald-900 mb-1">
                        Upload Complete! 🎉
                      </h4>
                      <p className="text-emerald-800 text-sm">
                        Successfully uploaded {uploadResult.successCount} of {uploadResult.totalUploaded} products
                      </p>
                      <Link
                        href="/products"
                        className="inline-block mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {uploadResult.failureCount > 0 && uploadResult.errors && (
                <div className="p-6 bg-red-50 border-2 border-red-500 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-red-900 mb-1">
                        {uploadResult.failureCount} Upload{uploadResult.failureCount > 1 ? 's' : ''} Failed
                      </h4>
                      <p className="text-red-800 text-sm mb-3">
                        The following files encountered errors:
                      </p>
                      
                      <div className="space-y-2">
                        {uploadResult.errors.map((error: any, index: number) => (
                          <div key={index} className="bg-red-100 border border-red-300 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-red-900 font-medium text-sm truncate">
                                  {error.filename}
                                </p>
                                <p className="text-red-800 text-xs mt-1">
                                  {error.errorMessage}
                                </p>
                              </div>
                              <span className="px-2 py-1 bg-red-200 text-red-900 rounded text-xs font-mono flex-shrink-0">
                                {error.errorCode}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
