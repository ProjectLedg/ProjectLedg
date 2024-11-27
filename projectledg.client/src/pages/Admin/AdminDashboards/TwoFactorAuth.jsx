import React, { useState, useEffect } from 'react';
import { axiosConfig } from '/axiosconfig';

const TwoFactorAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [authCode, setAuthCode] = useState('');
  const [message, setMessage] = useState('');

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
      console.error('Failed to fetch the QR code', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission
  const handleActivate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosConfig.post('/TwoFactorAuth/enable-2fa', { code: authCode });
      setMessage('2FA är aktiverad!');
    } catch (error) {
      console.error('Failed to activate 2FA', error);
      setMessage('Aktivering misslyckades. Kontrollera din kod och försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the QR code image when the component mounts
  useEffect(() => {
    fetchQRCode();
  }, []); // Empty dependency array means it runs only once when the component mounts

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>2FA</h1>
      {isLoading ? (
        <p style={styles.message}>Laddar...</p>
      ) : qrCodeUrl ? (
        <div style={styles.qrCodeContainer}>
          <img src={qrCodeUrl} alt="QR Code" style={styles.qrCode} />
          <p style={styles.instructions}>
            Skanna QR-koden med din autentiseringsapp och ange koden nedan.
          </p>
          <form onSubmit={handleActivate} style={styles.form}>
            <input
              type="text"
              placeholder="Ange kod"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              Aktivera 2FA
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      ) : (
        <p style={styles.message}>Ingen QR-kod är tillgänglig.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#007bff',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrCode: {
    width: '200px',
    height: '200px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
  },
  instructions: {
    fontSize: '1.1rem',
    marginBottom: '20px',
    color: '#555',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  input: {
    width: '100%',
    maxWidth: '300px',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  message: {
    fontSize: '1.1rem',
    marginTop: '20px',
    color: '#333',
  },
};


export default TwoFactorAuth;
