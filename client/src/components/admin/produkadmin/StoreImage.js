import React, { useState } from 'react';
import { storage, uploadBytesResumable, getDownloadURL, ref } from './txtImgConfig';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = event => {
    setImage(event.target.files[0]);
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleUpload = async () => {
    if (!image || !name) {
      console.error('Please select an image and enter a name.');
      return;
    }

    setUploading(true);

    try {
      const imageRef = ref(storage, `images/produk/${name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const formData = new FormData();
            formData.append('foto', downloadURL); // Append the URL string, not a file
            formData.append('name', name);

            const response = await fetch('http://127.0.0.1:5000/produk', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              console.error(`Server responded with ${response.status}: ${response.statusText}`);
              const responseBody = await response.json();
              console.error('Response body:', responseBody);
            } else {
              const responseBody = await response.json();
              console.log('New product added:', responseBody);
            }
          } catch (error) {
            console.error('Failed to add product:', error);
          } finally {
            setUploading(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <div>
      <input type="file" id="fileInput" onChange={handleImageUpload} style={{ display: 'none' }} />
      <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>Add</label>
      <input type="text" value={name} onChange={handleNameChange} placeholder="Enter name" />
      <button onClick={handleUpload} disabled={!image || !name || uploading}>Upload</button>
      {uploading && <p>Uploading...</p>}
      {uploadProgress > 0 && <p>Upload progress: {uploadProgress.toFixed(2)}%</p>}
    </div>
  );
}

export default UploadImage;
