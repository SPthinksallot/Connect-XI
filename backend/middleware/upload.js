const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage for images, videos, audio
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "connectx/misc";
    let resourceType = "auto";
    let allowedFormats;

    if (file.mimetype.startsWith("image/")) {
      folder = "connectx/images";
      allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    } else if (file.mimetype.startsWith("video/")) {
      folder = "connectx/videos";
      resourceType = "video";
      allowedFormats = ["mp4", "mov", "avi", "webm"];
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "connectx/audio";
      resourceType = "video"; // Cloudinary uses 'video' for audio
      allowedFormats = ["mp3", "wav", "ogg", "webm", "m4a"];
    } else {
      folder = "connectx/files";
      resourceType = "raw";
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
      transformation:
        file.mimetype.startsWith("image/")
          ? [{ quality: "auto", fetch_format: "auto" }]
          : undefined,
    };
  },
});

// File size filter
const fileFilter = (req, file, cb) => {
  const ALLOWED_MIME = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/mov", "video/avi", "video/webm",
    "audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not supported`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

module.exports = upload;
