import { useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { uploadAPI } from '../services/api';

export default function FileUpload({ onUploadComplete, accept = "image/*,application/pdf,.doc,.docx" }) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = selectedFiles.map(file => uploadAPI.uploadFile(file));
      const results = await Promise.all(uploadPromises);

      const uploadedFiles = results.map((res, idx) => ({
        name: selectedFiles[idx].name,
        url: res.data.url,
        filename: res.data.filename
      }));

      setFiles([...files, ...uploadedFiles]);
      onUploadComplete && onUploadComplete(uploadedFiles);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload des fichiers');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUploadComplete && onUploadComplete(newFiles);
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {uploading ? 'Upload en cours...' : 'Cliquez pour uploader des fichiers'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Images, PDF, Documents (max 16MB)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          multiple
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}