// ForgotPasswordModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { requestPasswordReset } from "../services/api"; 


// Set the app element for accessibility (this should be the root of your app)
Modal.setAppElement('#root');

const ForgotPasswordModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Open the modal when the link is clicked
  const openModal = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setMessage('');
  };

 

  const handleForgotPassSubmit = async () => {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
      if (response.status === "SUCCESS") {
        setMessage('If an account with that email exists, a reset link has been sent.');
      } else {
        setMessage('If an account with that email exists, a reset link has been sent.');
      }
  
    };

  return (
    <div>
      {/* This link opens the modal */}
      <a href="#" onClick={openModal}>Forgot Password?</a>

      {/* The Modal Component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Forgot Password Modal"
        style={{
          content: {
            width: '400px',
            height: '400px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px'
          }
        }}
      >
        <h2>Forgot Password</h2>
        <div>  
            <h2> <span className="org_header">  <img src="/icons/Logo.png" alt="Org Logo" className="logo_class" />  </span></h2>
          
        </div>
        {message ? (
          // If message exists, show it with a close button
          <div>
            <p>{message}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        ) : (

       
        <form onSubmit={handleForgotPassSubmit}>
              <div>  
                <p className="sub-text">Please provide your email that you registered with your account. A link to reset the password will be provided in email.</p>
             </div>   
        
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="button" onClick={closeModal}>Cancel</button> &nbsp;&nbsp;
          <button type="submit" style={{ marginRight: '10px' }}>Submit</button>
         
        </form>

       
    )}
      </Modal>
    </div>
  );
};

export default ForgotPasswordModal;
