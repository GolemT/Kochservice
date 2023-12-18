// // pages/api/uploadImage.js
// import formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   const form = new formidable.IncomingForm();
//   form.uploadDir = path.join(process.cwd(), 'uploads');
//   form.keepExtensions = true;

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       res.status(500).json({ error: 'Image upload failed' });
//       return;
//     }

//     const oldPath = files.file.path;
//     const extension = path.extname(files.file.name);
//     const newFileName = `${Date.now()}${extension}`;
//     const newPath = path.join(process.cwd(), 'public', 'recipes', newFileName);

//     fs.rename(oldPath, newPath, (renameErr) => {
//       if (renameErr) {
//         res.status(500).json({ error: 'Image upload failed' });
//       } else {
//         const pic = `recipes/${newFileName}`;
//         res.status(200).json({ pic });
//       }
//     });
//   });
// }
