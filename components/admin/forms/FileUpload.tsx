"use client";

import { forwardRef, InputHTMLAttributes, useState, useRef } from "react";

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  preview?: boolean;
  fullWidth?: boolean;
  onFileSelect?: (file: File | null) => void;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      helperText,
      maxSize = 5, // 5MB default
      acceptedFormats = [],
      preview = false,
      fullWidth = true,
      className = "",
      disabled,
      required,
      onFileSelect,
      ...props
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (file: File | null) => {
      if (!file) {
        setSelectedFile(null);
        setPreviewUrl(null);
        onFileSelect?.(null);
        return;
      }

      // Validate file size
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Validate file type
      if (acceptedFormats.length > 0) {
        const fileExtension = `.${file.name.split(".").pop()}`;
        const mimeType = file.type;
        const isValid =
          acceptedFormats.some((format) => format === fileExtension) ||
          acceptedFormats.some((format) => format === mimeType);

        if (!isValid) {
          alert(`File type not accepted. Allowed: ${acceptedFormats.join(", ")}`);
          return;
        }
      }

      setSelectedFile(file);
      onFileSelect?.(file);

      // Create preview for images
      if (preview && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFile(file);
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0] || null;
      handleFile(file);
    };

    const handleClear = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onFileSelect?.(null);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          className={`
            relative
            border-2
            border-dashed
            rounded-lg
            transition-all
            duration-200
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${error ? "border-red-500" : ""}
            ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-blue-400"}
            ${className}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="file"
            className="hidden"
            disabled={disabled}
            required={required}
            accept={acceptedFormats.join(",")}
            onChange={handleChange}
            {...props}
          />

          {!selectedFile ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold text-blue-600">Click to upload</span> or
                drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedFormats.length > 0
                  ? `Accepted formats: ${acceptedFormats.join(", ")}`
                  : "Any file type"}
                {maxSize && ` (Max ${maxSize}MB)`}
              </p>
            </div>
          ) : (
            <div className="p-4">
              {previewUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
