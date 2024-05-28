import React from 'react';
import "./DataAdmin.css";

export default function DataAdmin() {
    return (
        <div className='dataadmin-container'>
            <div className='title-dataadmin'>
                <h1>Data Admin</h1>
            </div>
            <div className='edit-form'>
                <form>
                    <label>
                        Level:
                        <select name="level">
                            <option value="">Pilih Level</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </label>
                    <label>
                        Nama:
                        <input type="text" name="nama" />
                    </label>
                    <label>
                        Username:
                        <input type="text" name="username" />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" />
                    </label>
                    <div className="password-fields">
                        <div className="password-field">
                            <label>
                                Password Lama:
                                <input type="password" name="oldPassword" />
                            </label>
                        </div>
                        <div className="password-field">
                            <label>
                                Password Baru:
                                <input type="password" name="newPassword" />
                            </label>
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
