import cloudinary from "../../config/cloudinary.config.js";

/**
 * @param {string|string[]} imagePaths - The local path(s) of the image(s) to upload.
 * @param {string} folder - The destination folder in Cloudinary.
 * @returns {Promise<string|string[]>} - The URL(s) of the uploaded image(s).
 */
export const uploadImageToCloudinary = async (imagePaths, folder) => {
  try {
    if (Array.isArray(imagePaths)) {
      const uploadPromises = imagePaths.map(imagePath =>
        cloudinary.uploader.upload(imagePath, {
          folder: folder,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        })
      );

      const results = await Promise.all(uploadPromises);
      return results.map(result => result.secure_url);
    } else {
      // Handle single image upload
      const result = await cloudinary.uploader.upload(imagePaths, {
        folder: folder,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      return result.secure_url;
    }
  } catch (error) {
    throw new Error(`Failed to upload image(s): ${error.message}`);
  }
};

/**
 * @param {string|string[]} publicIds - The public ID(s) of the image(s) to update.
 * @param {string|string[]} imagePaths - The local path(s) of the new image(s) to upload.
 * @returns {Promise<string|string[]>} - The URL(s) of the updated image(s).
 */
export const updateImageInCloudinary = async (publicIds, imagePaths) => {
  try {
    if (Array.isArray(imagePaths)) {
      const updatePromises = imagePaths.map((imagePath, index) =>
        cloudinary.uploader.upload(imagePath, {
          public_id: publicIds[index],
          overwrite: true,
        })
      );

      const results = await Promise.all(updatePromises);
      return results.map(result => result.secure_url);
    } else {
      const result = await cloudinary.uploader.upload(imagePaths, {
        public_id: publicIds,
        overwrite: true,
      });

      return result.secure_url;
    }
  } catch (error) {
    throw new Error(`Failed to update image(s): ${error.message}`);
  }
};

/**
 * @param {string|string[]} publicIds - The public ID(s) of the image(s) to delete.
 * @returns {Promise<void>}
 */
export const deleteImageFromCloudinary = async (publicIds) => {

  try {
    if (Array.isArray(publicIds)) {
      const deletePromises = publicIds.map(publicId =>
        cloudinary.uploader.destroy(publicId)
      );

      await Promise.all(deletePromises);
    } else {
      await cloudinary.uploader.destroy(publicIds);
    }
  } catch (error) {
    throw new Error(`Failed to delete image(s): ${error.message}`);
  }
};

/**
 * Gets details of images from Cloudinary.
 * @param {string|string[]} publicIds - The public ID(s) of the image(s).
 * @returns {Promise<object|object[]>} - The details of the image(s).
 */
export const getImageDetailsFromCloudinary = async (publicIds) => {
  try {
    if (Array.isArray(publicIds)) {
      // Handle multiple image details retrieval
      const detailPromises = publicIds.map(publicId =>
        cloudinary.api.resource(publicId)
      );

      const results = await Promise.all(detailPromises);
      return results;
    } else {

      const result = await cloudinary.api.resource(publicIds);
      return result;
    }
  } catch (error) {
    throw new Error(`Failed to get image details: ${error.message}`);
  }
};