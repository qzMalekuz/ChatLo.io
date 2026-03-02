import { Message, User } from "../types";
import { findUserById } from "./userService";

// rooms: roomName → Set of userId
const rooms: Record<string, Set<number>> = {};

export function joinRoom(user: User, roomName: string): void {
    // Already in this room — ignore
    if (user.rooms.includes(roomName)) return;

    if (!rooms[roomName]) {
        rooms[roomName] = new Set();
    }

    rooms[roomName].add(user.id);
    user.rooms.push(roomName);
    user.room = roomName;   // track last joined as primary (for backward compat)

    broadcastToRoom(roomName, {
        type: "ROOM_NOTIFICATION",
        payload: {
            message: `${user.username} joined ${roomName}`,
            timestamp: new Date().toISOString(),
        },
    });
}

export function leaveRoom(user: User, roomName?: string): void {
    const target = roomName || user.room;
    if (!target) return;
    if (!user.rooms.includes(target)) return;

    rooms[target]?.delete(user.id);

    broadcastToRoom(target, {
        type: "ROOM_NOTIFICATION",
        payload: {
            message: `${user.username} left ${target}`,
            timestamp: new Date().toISOString(),
        },
    });

    if (rooms[target] && rooms[target].size === 0) {
        delete rooms[target];
    }

    user.rooms = user.rooms.filter(r => r !== target);
    // Update primary room reference
    user.room = user.rooms[user.rooms.length - 1] ?? null;
}

export function leaveAllRooms(user: User): void {
    for (const room of [...user.rooms]) {
        leaveRoom(user, room);
    }
}

export function broadcastToRoom(roomName: string, message: Message): void {
    if (!rooms[roomName]) return;

    const serialised = JSON.stringify(message);

    rooms[roomName].forEach((memberId) => {
        const member = findUserById(memberId);
        if (member) member.ws.send(serialised);
    });
}

export function getRoomMembers(roomName: string): { id: number; username: string }[] {
    if (!rooms[roomName]) return [];

    const result: { id: number; username: string }[] = [];
    rooms[roomName].forEach((memberId) => {
        const member = findUserById(memberId);
        if (member) result.push({ id: member.id, username: member.username });
    });
    return result;
}
