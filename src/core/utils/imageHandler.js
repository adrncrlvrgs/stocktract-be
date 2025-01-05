import cloudinary from "../../config/cloudinary.config.js";
import streamifier from "streamifier";

/**
 * @param {Buffer|Buffer[]} files - The Buffer(s) to upload.
 * @param {string} folder - The destination folder in Cloudinary.
 * @returns {Promise<string|string[]>} - The URL(s) of the uploaded image(s).
 */
export const uploadImageToCloudinary = async (files, folder) => {
  try {
    if (Array.isArray(files)) {
      // Handle multiple files
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              use_filename: true,
              unique_filename: false,
              overwrite: true,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          // Create a readable stream from the Buffer
          streamifier.createReadStream(file).pipe(uploadStream);
        });
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } else {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            use_filename: true,
            unique_filename: false,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );


        streamifier.createReadStream(files).pipe(uploadStream);
      });
    }
  } catch (error) {
    throw new Error(`Failed to upload image(s): ${error.message}`);
  }
};

/**
 * @param {string|string[]} publicIds - The public ID(s) of the image(s) to update.
 * @param {File|File[]} files - The File object(s) of the new image(s) to upload.
 * @returns {Promise<string|string[]>} - The URL(s) of the updated image(s).
 */
export const updateImageInCloudinary = async (publicIds, files) => {
  try {
    if (Array.isArray(files)) {
      const updatePromises = files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { public_id: publicIds[index], overwrite: true },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          // Convert the file buffer to a stream and pipe it to Cloudinary
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      const results = await Promise.all(updatePromises);
      return results;
    } else {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: publicIds, overwrite: true },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        streamifier.createReadStream(files.buffer).pipe(uploadStream);
      });
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
      const deletePromises = publicIds.map((publicId) =>
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
      const detailPromises = publicIds.map((publicId) =>
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
