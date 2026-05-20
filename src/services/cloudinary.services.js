import cloudinary from "../config/claudinary.config.js";

export const uploadOnCloudinary = async(filePath)=>{
    return await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: "assignment",
    });
};