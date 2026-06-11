import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (localFilePath, folderName) => {
    try {
        if (!localFilePath) return null;

        // Determine resource type based on file extension
        // PDFs must be uploaded as 'raw' or 'auto', but 'raw' is safer for free tier Cloudinary
        const extension = path.extname(localFilePath).toLowerCase();
        let resourceType = 'auto';
        
        if (extension === '.pdf') {
            resourceType = 'raw';
        }

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            folder: `ai_job_portal/${folderName}`
        });

        // Clean up local file
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error('Cloudinary Upload Error:', error);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        if (!publicId) return;
        // PDFs require resource_type: 'raw' to be deleted properly
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
    }
};