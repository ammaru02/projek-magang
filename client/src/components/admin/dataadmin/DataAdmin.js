import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./DataAdmin.css";

export default function AdminPanel() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        level: '',
        name: '',
        username: '',
        email: ''
    });
    const [newAdminData, setNewAdminData] = useState({
        level: '',
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('edit');
    const navigate = useNavigate();

    useEffect(() => {
        if (view === 'edit') {
            fetchAdminData();
        } else {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view]);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found. Please log in.');
                setLoading(false);
                navigate('/login');
                return;
            }
            const response = await axios.get('http://localhost:5000/admin/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const adminData = response.data;
            setFormData({
                level: adminData.level,
                name: adminData.name,
                username: adminData.username,
                email: adminData.email,
                oldPassword: '',
                newPassword: ''
            });
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setMessage('Error fetching admin data.');
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (view === 'edit') {
            setFormData({
                ...formData,
                [name]: value
            });
        } else {
            setNewAdminData({
                ...newAdminData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (view === 'edit') {
            if (formData.oldPassword === '' || formData.newPassword === '') {
                setMessage('Old Password and New Password fields cannot be empty');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const dataToSend = {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                };

                const response = await axios.put('http://localhost:5000/admin/profile/password', dataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessage(response.data.message);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setMessage(error.response.data.error);
                } else {
                    setMessage('Error updating password.');
                }
            }
        } else {
            setLoading(true);

            try {
                const response = await axios.post('http://localhost:5000/admin', newAdminData);
                setMessage(response.data.message);
                setNewAdminData({
                    level: '',
                    name: '',
                    username: '',
                    email: '',
                    password: ''
                });
            } catch (error) {
                setMessage('Error adding admin.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='admin-panel-container'>
            <div className='title-dataadmin'>
                <h1>{view === 'edit' ? 'Edit Admin Data' : 'Add Admin'}</h1>
            </div>
            <div className='edit-form'>
                <form onSubmit={handleSubmit}>
                    {view === 'edit' ? (
                        <>
                            <label>
                                Level:
                                <input type="text" name="level" value={formData.level} readOnly />
                            </label>
                            <label>
                                Name:
                                <input type="text" name="name" value={formData.name} readOnly />
                            </label>
                            <label>
                                Username:
                                <input type="text" name="username" value={formData.username} readOnly />
                            </label>
                            <label>
                                Email:
                                <input type="email" name="email" value={formData.email} readOnly />
                            </label>
                            <div className="password-fields">
                                <div className="password-field">
                                    <label>
                                        Old Password:
                                        <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
                                    </label>
                                </div>
                                <div className="password-field">
                                    <label>
                                        New Password:
                                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="button-group">
                                <button type="submit">Change Password</button>
                                {(formData.level === 'super admin') && <button type="button" onClick={() => setView('input')}>Input Data</button>}
                            </div>
                        </>
                    ) : (
                        <>
                            <label>
                                Level:
                                <input type="text" name="level" value={newAdminData.level} onChange={handleChange} required />
                            </label>
                            <label>
                                Name:
                                <input type="text" name="name" value={newAdminData.name} onChange={handleChange} required />
                            </label>
                            <label>
                                Username:
                                <input type="text" name="username" value={newAdminData.username} onChange={handleChange} required />
                            </label>
                            <label>
                                Email:
                                <input type="email" name="email" value={newAdminData.email} onChange={handleChange} required />
                            </label>
                            <label>
                                Password:
                                <input type="password" name="password" value={newAdminData.password} onChange={handleChange} required />
                            </label>
                            <div className="button-group">
                                <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Admin'}</button>
                                <button type="button" onClick={() => setView('edit')}>Back to Edit</button>
                            </div>
                        </>
                    )}
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
