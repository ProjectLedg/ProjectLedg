import React, { useState } from 'react';
import axios from 'axios';

const PDFPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Handles file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handles the file upload using Axios
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // Append the file to the form data

    try {
      setUploadError(''); // Reset error message before uploading

      const response = await axios.post('https://localhost:7223/api/PDF/upload-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus(`File uploaded successfully. Blob URL: ${response.data}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('');
      setUploadError('An error occurred during the upload. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload a PDF</h2>

      {/* File input field */}
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      
      {/* Upload button */}
      <button onClick={handleUpload} disabled={!selectedFile} style={{ marginLeft: '10px' }}>
        Upload
      </button>

      {/* Status messages */}
      {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
};

export default PDFPage;
