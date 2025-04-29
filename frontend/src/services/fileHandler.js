const isImageFile = (file) => file.type.match("image.*");

const isFileSizeValid = (file, maxSizeMB = 5) =>
  file.size <= maxSizeMB * 1024 * 1024;

const showToast = (toaster, title, description) => {
  if (!toaster) return;
  toaster.create({
    title,
    description,
    type: "error",
    duration: 3000,
    isClosable: true,
  });
};

const handleFileChange = async (
  e,
  setImagePreview,
  toaster = null,
  allowMultiple = true,
  setFile = null,
) => {
  const files = e.target.files;

  const imagePreviewArray = [];

  for (const file of files) {
    if (!file) continue;

    if (!isImageFile(file)) {
      showToast(
        toaster,
        "Invalid file type",
        "Please upload an image file (JPEG, PNG, etc.)",
      );
      continue;
    }

    if (!isFileSizeValid(file)) {
      showToast(
        toaster,
        "File too large",
        "Please upload an image smaller than 5MB",
      );
      continue;
    }

    const preview = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(file);
    });

    imagePreviewArray.push(preview);
  }

  if (imagePreviewArray.length > 0) {
    setImagePreview(allowMultiple ? imagePreviewArray : imagePreviewArray[0]);
    if (setFile) {
      setFile(allowMultiple ? files : files[0]);
    }
    return;
  }

  return -1;
};

const readRawFile = (file, onProgress, onComplete) => {
  if (!file) {
    return Promise.reject(new Error("No file provided"));
  }
  const CHUNK_SIZE = 1024 * 100; // 100KB
  return new Promise((resolve, reject) => {
    const totalSize = file.size;
    let offset = 0;
    const chunkList = [];

    const reader = new FileReader();

    const readNextChunk = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      chunkList.push(new Uint8Array(e.target.result));
      offset += CHUNK_SIZE;
      const percent = Math.min((offset / totalSize) * 100, 100);
      if (onProgress) onProgress(percent);

      if (offset < totalSize) {
        readNextChunk();
      } else {
        // Combine chunks into one Blob
        const completeBlob = new Blob(chunkList, { type: file.type });

        // Optionally wrap it as a File object (if filename is needed)
        const completeFile = new File([completeBlob], file.name, {
          type: file.type,
        });

        if (onComplete) onComplete(completeBlob);
        resolve(completeFile);
      }
    };

    reader.onerror = () => reject(reader.error);

    readNextChunk();
  });
};

export { handleFileChange, readRawFile };
