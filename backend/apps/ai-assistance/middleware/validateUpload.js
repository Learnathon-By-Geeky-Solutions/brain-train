export const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }
  next();
};
