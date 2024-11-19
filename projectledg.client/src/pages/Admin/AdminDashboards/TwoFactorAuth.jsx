import React, { useState, useEffect } from 'react';
import { axiosConfig } from '/axiosconfig';

const TwoFactorAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  // Function to fetch the QR code image
  const fetchQRCode = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get('/TwoFactorAuth/generate-qr-code', {
        responseType: 'blob', // Ensure the response is treated as a Blob (image)
      });

      // Create a URL for the Blob and set it as the image source
      const qrCodeUrl = URL.createObjectURL(response.data);
      setQrCodeUrl(qrCodeUrl);
    } catch (error) {
      console.error("Failed to fetch the QR code", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the QR code image when the component mounts
  useEffect(() => {
    fetchQRCode();
  }, []); // Empty dependency array means it runs only once when the component mounts

  return (
    <div>
        <h1>Två Faktor Autentisering</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : qrCodeUrl ? (
        <div>
          {/* Display the fetched QR code image */}
          <img src={qrCodeUrl} alt="QR Code" style={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
            
        </div>
      ) : (
        <p>Ingen QR Kod är en </p>
      )}
    </div>
  );
};

export default TwoFactorAuth;
