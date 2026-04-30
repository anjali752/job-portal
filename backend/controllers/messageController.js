import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { receiverId, content } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !content) {
    return next(new ErrorHandler("Receiver and content are required", 400));
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message: content,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

export const getMessages = catchAsyncErrors(async (req, res, next) => {
  const { participantId } = req.params;
  const userId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: participantId },
      { sender: participantId, receiver: userId },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

export const getChatList = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // Find all unique users the current user has chatted with
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).sort({ createdAt: -1 });

  const participantsMap = new Map();

  for (const msg of messages) {
    const participantId = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
    
    if (!participantsMap.has(participantId)) {
      participantsMap.set(participantId, {
        lastMessage: msg.message,
        lastMessageDate: msg.createdAt,
      });
    }
  }

  const participantIds = Array.from(participantsMap.keys());
  const participants = await User.find({ _id: { $in: participantIds } }).select("name avatar role");

  const chatList = participants.map(p => ({
    ...p.toObject(),
    ...participantsMap.get(p._id.toString())
  }));

  res.status(200).json({
    success: true,
    chatList,
  });
});
