import { WebSocket } from "ws";
import { Message, User } from "../types";
import { sendError, sendJson } from "../utils/send";
import { getAllUsers, findUserById } from "./userService";

export function broadcast(message: Message): void {
    const serialised = JSON.stringify(message);
    getAllUsers().forEach((connectedUser) => {
        if (connectedUser.ws.readyState === WebSocket.OPEN) {
            connectedUser.ws.send(serialised);
        }
    });
}

export function sendPrivateMessage(
    sender: User,
    receiverId: number,
    text: string,
    audioData?: string,
    duration?: number,
    messageId?: string,
    imageUrl?: string,
    videoUrl?: string,
    fileInfo?: { name?: string; size?: string },
): void {
    const receiver = findUserById(receiverId);

    if (!receiver) {
        return sendError(sender.ws, "Receiver not found");
    }

    const directMessage: Message = {
        type: audioData ? "PRIVATE_VOICE" : "PRIVATE_CHAT",
        payload: {
            from: sender.id,
            to: receiver.id,
            ...(messageId ? { messageId } : {}),
            username: sender.username,
            text,
            ...(imageUrl ? { imageUrl } : {}),
            ...(videoUrl ? { videoUrl } : {}),
            ...(fileInfo ? { fileInfo } : {}),
            timestamp: new Date().toISOString(),
            ...(audioData && { audioData, duration: duration ?? 0 }),
        },
    };

    sendJson(receiver.ws, directMessage);
    sendJson(sender.ws, directMessage);
}
