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

/**
 * @param {string} publicId - The public ID of the image to update.
 * @param {string} imagePath - The local path of the new image to upload.
 * @returns {Promise<string>} - The URL of the updated image.
 */
export const updateImageInCloudinary = async (publicId, imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      overwrite: true,
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to update image: ${error.message}`);
  }
};

/**
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<void>}
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * @param {string} publicId - The public ID of the image.
 * @returns {Promise<object>} - The details of the image.
 */

export const getImageDetailsFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to get image details: ${error.message}`);
  }
};
