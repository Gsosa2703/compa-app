/*
File Upload Support
Why: Many marketplace applications involve uploading images for listings (e.g., product pictures). Adding file upload support is crucial.
How: You can use multer for handling file uploads in your backend
*/

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
