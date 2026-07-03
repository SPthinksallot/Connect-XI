const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "chatType",
      required: true,
    },
    chatType: {
      type: String,
      enum: ["Chat", "Group"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaPublicId: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "audio", "file", null],
      default: null,
    },
    mediaName: {
      type: String,
      default: null,
    },
    // Transcribed text from voice notes
    voiceText: {
      type: String,
      default: null,
    },
    // Translated content keyed by language code e.g. { en: "...", hi: "..." }
    translatedContent: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search index on content and voiceText
messageSchema.index({ content: "text", voiceText: "text" });
// For fast retrieval by chat + time
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model("Message", messageSchema);
