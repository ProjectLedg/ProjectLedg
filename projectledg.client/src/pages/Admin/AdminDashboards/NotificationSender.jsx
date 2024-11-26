import React, { useState } from "react";
import axios from "axios";

const NotificationSender = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [endpoint, setEndpoint] = useState("newsletter");
  const [confirmationMessage, setConfirmationMessage] = useState(""); // New state for messages
  const [isError, setIsError] = useState(false); // State to track success or error

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      endpoint === "newsletter"
        ? "https://projectledgserver.azurewebsites.net/api/admin/newsletter"
        : endpoint === "targeted-email"
        ? "https://projectledgserver.azurewebsites.net/api/admin/targeted-email"
        : "https://projectledgserver.azurewebsites.net/api/admin/email-notification";

    try {
      const response = await axios.post(url, { subject, content });
      setConfirmationMessage(response.data.Message || "Notification sent successfully!");
      setIsError(false); // Reset error flag
    } catch (error) {
      setConfirmationMessage(
        error.response?.data?.Message || "An error occurred while sending the email."
      );
      setIsError(true); // Set error flag
    }
  };

  // Inline styles
  const styles = {
    container: {
      display: "flex",
      minHeight: "54vh",
      backgroundColor: "#f9f9f9",
      padding: "20px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      maxWidth: "600px",
      width: "100%",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s",
      minHeight: "150px",
      resize: "none",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
    },
    button: {
      flex: 1,
      padding: "10px",
      fontSize: "14px",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.2s",
    },
    activeButton: {
      backgroundColor: "#0056b3",
    },
    submitButton: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#28a745",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.2s",
    },
    message: {
      textAlign: "center",
      marginTop: "20px",
      padding: "10px",
      borderRadius: "5px",
      fontWeight: "bold",
    },
    successMessage: {
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Notification Sender</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
              placeholder="Enter email subject"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Message:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textarea}
              placeholder="Enter your message here..."
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Endpoint:</label>
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => setEndpoint("newsletter")}
                style={{
                  ...styles.button,
                  ...(endpoint === "newsletter" && styles.activeButton),
                }}
              >
                Newsletter
              </button>
              <button
                type="button"
                onClick={() => setEndpoint("targeted-email")}
                style={{
                  ...styles.button,
                  ...(endpoint === "targeted-email" && styles.activeButton),
                }}
              >
                Targeted Email
              </button>
              <button
                type="button"
                onClick={() => setEndpoint("email-notification")}
                style={{
                  ...styles.button,
                  ...(endpoint === "email-notification" && styles.activeButton),
                }}
              >
                Email Notification
              </button>
            </div>
          </div>
          <button type="submit" style={styles.submitButton}>
            Send Email
          </button>
        </form>
        {confirmationMessage && (
          <div
            style={{
              ...styles.message,
              ...(isError ? styles.errorMessage : styles.successMessage),
            }}
          >
            {confirmationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSender;
