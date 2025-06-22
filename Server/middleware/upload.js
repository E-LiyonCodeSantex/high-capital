const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware to normalize the file path
const normalizeFilePath = (req, res, next) => {
    if (req.file) {
        // Normalize the file path to use forward slashes
        req.file.path = req.file.path.replace(/\\/g, '/');
        req.file.filename = `/uploads/${req.file.filename}`; // Add `/uploads/` prefix
    }
    next();
};

module.exports = { upload, normalizeFilePath };

/*

const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storageType = process.env.STORAGE_TYPE || 'local';

let upload;

if (storageType === 'local') {
    // Local storage configuration
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

    upload = multer({ storage });
} else if (storageType === 'gcloud') {
    // Google Cloud Storage configuration
    const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT_ID,
        keyFilename: process.env.GCLOUD_KEY_FILE,
    });

    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

    upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type.'));
            }
        },
    });

    upload.toGoogleCloud = async (file) => {
        const blob = bucket.file(`${Date.now()}-${file.originalname}`);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            throw new Error(err.message);
        });

        blobStream.end(file.buffer);
        return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    };
}

module.exports = upload;
*/