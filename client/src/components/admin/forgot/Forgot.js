import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showTokenForm, setShowTokenForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const navigate = useNavigate();

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage('token sukses dikirm ke email');
            setShowTokenForm(true); // Menampilkan formulir untuk memasukkan token setelah pengiriman email berhasil
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                setMessage('gagal kirim token ke email.');
            }
        }
    };

    const handleSubmitToken = async (e) => {
        e.preventDefault();
        setShowPasswordForm(true); // Menampilkan formulir untuk memasukkan password baru setelah token dikirim
    };

const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {

        // eslint-disable-next-line no-unused-vars
        const response = await axios.post('http://localhost:5000/reset-password', { email, token, new_password: newPassword });
        setMessage('Password reset sukses.');
        setShowTokenForm(false);
        setShowPasswordForm(false);
        
        // Redirect to login page after successful password reset
        window.location.href = '/login';
    } catch (error) {
        if (error.response) {
            setMessage(`Error: ${error.response.data.message}`);
        } else {
            setMessage('gagal reset password.');
        }
    }
};


    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <div className="container-forgot-password">
            <div className="password-forgot-container">
                <h2>Lupa Password</h2>
                {!showTokenForm && !showPasswordForm && (
                    <form onSubmit={handleSubmitEmail}>
                        <label>
                            Email:
                            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>
                        <button type="submit" className="button">Kirim</button>
                        <button type="button" className="button" onClick={handleCancel}>Batal</button>
                    </form>
                )}
                {showTokenForm && !showPasswordForm && (
                    <form onSubmit={handleSubmitToken}>
                        <label>
                            Token:
                            <input type="text" className="input" value={token} onChange={(e) => setToken(e.target.value)} required />
                        </label>
                        <button type="submit" className="button">Kirim Token</button>
                        
                    </form>
                )}
                {showPasswordForm && (
                    <form onSubmit={handleSubmitNewPassword}>
                        <label>
                            Password Baru:
                            <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </label>
                        <button type="submit" className="button">Reset Password</button>
                    </form>
                )}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
