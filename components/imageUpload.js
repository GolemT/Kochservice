// // components/ImageUpload.js
// import { useState } from 'react';

// export default function ImageUpload({ onImageUpload }) {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//   };

//   const handleUpload = async () => {
//     if (selectedFile) {
//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       try {
//         const response = await fetch('/api/uploadImage', {
//           method: 'POST',
//           body: formData,
//         });

//         if (response.ok) {
//           const data = await response.json();
//           onImageUpload(data.pic);
//         } else {
//           console.error('Image upload failed.');
//         }
//       } catch (error) {
//         console.error('Image upload error:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// }
