import React, { useState } from 'react';
import { storage, uploadBytesResumable, getDownloadURL, ref } from './txtImgConfig';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [name, setName] = useState('');

  const handleImageUpload = event => {
    setImage(event.target.files[0]);
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };

const handleUpload = async () => {
  // Create a reference to 'images/produk/name'
  let imageRef = ref(storage, `images/produk/${name}`);

  // Upload file and metadata to the object 'images/produk/name'
  let uploadTask = uploadBytesResumable(imageRef, image);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed', 
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setUploadProgress(progress);
    }, 
    (error) => {
      // Handle unsuccessful uploads
      console.error('Upload failed:', error);
    }, 
    async () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log('File available at', downloadURL);

      // Add the download URL to the form data
      formData.append('foto', downloadURL);

      // Send the form data to your server
      try {
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
      }
    }
  );
};

  return (
    <div>
      <input type="file" id="fileInput" onChange={handleImageUpload} style={{display: 'none'}} />
      <label htmlFor="fileInput" style={{cursor: 'pointer'}}>Add</label>
      <input type="text" value={name} onChange={handleNameChange} placeholder="Enter name" />
      <button onClick={handleUpload}>Upload</button>
      <p>Upload progress: {uploadProgress}%</p>
    </div>
  );
}

export default UploadImage;