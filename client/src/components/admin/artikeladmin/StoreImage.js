import React, { useState } from 'react';
import { storage, uploadBytesResumable, getDownloadURL, ref } from './txtImgConfig';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = event => {
    setImage(event.target.files[0]);
  };

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleUpload = async () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(`File available at ${downloadURL}`);
          // Send the URL and the name to your Flask server
          fetch('http://localhost:5000/produk', { // replace with your Flask server's endpoint
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({foto: downloadURL }), // use the correct keys here
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        });
      }
    );
  };

  return (
    <div>
      <input type="file" id="fileInput" onChange={handleImageUpload} style={{display: 'none'}} />
      <label htmlFor="fileInput" style={{cursor: 'pointer'}}>Add</label>
      <button onClick={handleUpload}>Upload</button>
      <p>Upload progress: {uploadProgress}%</p>
    </div>
  );
}

export default UploadImage;