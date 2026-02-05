import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("no local file path!");
            
            return null;
        }
        // If no file path is provided, exit early and return null.
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image" 
        });

        console.log("file is uploaded successfully!");
        fs.unlinkSync(localFilePath); // Delete the local file after successful upload
        // Return the response
        return response;
    } catch (error) {
        // If an error occurs, delete the local file to clean up
        console.error("Cloudinary upload failed", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};


const deleteOnCloudinary = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;

        //delete file from cloudinary
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });

        return result;
    } catch (error) {
        console.log("delete on cloudinary failed", error);
        return error;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };