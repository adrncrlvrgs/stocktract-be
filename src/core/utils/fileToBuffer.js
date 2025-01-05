/**
 * @param {File|File[]} files - The File object(s) to convert.
 * @returns {Promise<Buffer|Buffer[]>} - The converted Buffer or array of Buffers.
 */
export const fileToBuffer = async (files) => {
  if (Array.isArray(files)) {
    const bufferPromises = files.map(async (file) => {
      if (!(file instanceof File)) {
        throw new Error("Invalid input: Expected a File object");
      }
      const arrayBuffer = await file.arrayBuffer();

      return Buffer.from(arrayBuffer);
    });

    return await Promise.all(bufferPromises);
  } else if (files instanceof File) {

    const arrayBuffer = await files.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    throw new Error("Invalid input: Expected a File object or an array of File objects");
  }
};