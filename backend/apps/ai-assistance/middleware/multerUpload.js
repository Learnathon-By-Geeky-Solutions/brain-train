import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
    }
  },
});

export const handleMulterErrors = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err?.code === "LIMIT_FILE_SIZE") {
        return res
          .status(413)
          .json({ error: "Image too large. Max size is 10MB." });
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};
