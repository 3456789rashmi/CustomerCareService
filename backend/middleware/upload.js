const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp and user id
        const uniqueSuffix = `${req.user.id}-${Date.now()}`;
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    // Allowed image types
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only image files are allowed (JPEG, PNG, GIF, WebP)"),
            false
        );
    }
};

// Create multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

module.exports = upload;
