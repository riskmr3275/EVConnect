const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ev-connect',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    }
});

// Create multer upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

class UploadService {
    // Single file upload
    static single(fieldName) {
        return upload.single(fieldName);
    }

    // Multiple files upload
    static multiple(fieldName, maxCount = 5) {
        return upload.array(fieldName, maxCount);
    }

    // Upload profile image
    static profileImage() {
        return upload.single('profileImage');
    }

    // Upload station images
    static stationImages() {
        return upload.array('stationImages', 10);
    }

    // Upload EV image
    static evImage() {
        return upload.single('evImage');
    }

    // Delete image from Cloudinary
    static async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Failed to delete image');
        }
    }

    // Get optimized image URL
    static getOptimizedUrl(publicId, options = {}) {
        const defaultOptions = {
            width: 400,
            height: 300,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto'
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        return cloudinary.url(publicId, finalOptions);
    }

    // Generate thumbnail
    static getThumbnail(publicId, size = 150) {
        return cloudinary.url(publicId, {
            width: size,
            height: size,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto'
        });
    }

    // Upload base64 image
    static async uploadBase64(base64String, folder = 'ev-connect') {
        try {
            const result = await cloudinary.uploader.upload(base64String, {
                folder: folder,
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });

            return {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height
            };
        } catch (error) {
            console.error('Error uploading base64 image:', error);
            throw new Error('Failed to upload image');
        }
    }

    // Validate image file
    static validateImage(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
        }

        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }

        return true;
    }

    // Handle upload errors
    static handleUploadError(error, req, res, next) {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum size is 5MB.'
                });
            }
            if (error.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Maximum allowed is 10.'
                });
            }
        }

        if (error.message === 'Only image files are allowed!') {
            return res.status(400).json({
                success: false,
                message: 'Only image files are allowed!'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
}

module.exports = UploadService;