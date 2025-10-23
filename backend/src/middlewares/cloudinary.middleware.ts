
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'products',
    resource_type: 'image',
    format: 'webp', // Auto convert to webp
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  }),
});

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});