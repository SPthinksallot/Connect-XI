import { useCallback, useRef } from "react";
import useSocketStore from "../store/useSocketStore";
import { EVENTS } from "../utils/constants";

const TYPING_DEBOUNCE_MS = 2000;

/**
 * Emits typing:start and typing:stop events to the server.
 * Auto-stops typing after TYPING_DEBOUNCE_MS of inactivity.
 */
export const useTyping = (chatId) => {
  const { socket } = useSocketStore();
  const isTypingRef = useRef(false);
  const timerRef = useRef(null);

  const startTyping = useCallback(() => {
    if (!socket || !chatId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit(EVENTS.TYPING_START, { chatId });
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      stopTyping();
    }, TYPING_DEBOUNCE_MS);
  }, [socket, chatId]);

  const stopTyping = useCallback(() => {
    if (!socket || !chatId || !isTypingRef.current) return;
    isTypingRef.current = false;
    clearTimeout(timerRef.current);
    socket.emit(EVENTS.TYPING_STOP, { chatId });
  }, [socket, chatId]);

  return { startTyping, stopTyping };
};
