import cloudinary from "../../config/cloudinary.config.js";

/**
 * @param {string} imagePath - The local path of the image to upload.
 * @param {string} folder - The destination folder in Cloudinary.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (imagePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};