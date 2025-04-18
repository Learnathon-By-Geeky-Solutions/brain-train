const handleFileChange = (e,setFile,setImagePreview,toaster=null) => {
    if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        
        // Check if the file is an image
        if (!selectedFile.type.match('image.*')) {
            if (toaster) {
                toaster.create({
                    title: "Invalid file type",
                    description: "Please upload an image file (JPEG, PNG, etc.)",
                    type: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return -1;
        }
        
        // Check if the file size is below 5MB
        if (selectedFile.size > 5 * 1024 * 1024) {
            if (toaster) {
                toaster.create({
                    title: "File too large",
                    description: "Please upload an image smaller than 5MB",
                    type: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return -1;
        }
        
        setFile(selectedFile);
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
        setImagePreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    }
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
          const completeFile = new File([completeBlob], file.name, { type: file.type });

          if (onComplete) onComplete(completeBlob);
          resolve(completeFile);
        }
      };

      reader.onerror = () => reject(reader.error);

      readNextChunk();
    });
};

export { handleFileChange, readRawFile };