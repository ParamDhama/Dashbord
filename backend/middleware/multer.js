const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`); // Replace spaces with underscores for safety
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images with extensions .jpeg, .jpg, or .png are allowed.')); // Reject the file with a clear error message
  }
};

// Multer configuration
const upload = multer({
  storage, // Use the configured storage
  limits: { fileSize: 2 * 1024 * 1024 }, // Set a file size limit of 2MB
  fileFilter, // Apply the file filter
});

// Handle errors for better clarity
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 2MB limit.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = {
  upload, // Export the configured upload middleware
  handleUploadErrors, // Export the error handling middleware
};
