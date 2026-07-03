import { useState, useRef, useCallback } from "react";

/**
 * useVoiceRecorder — uses the Web Speech API for transcription
 * and MediaRecorder for audio blob capture.
 */
export const useVoiceRecorder = ({ onTranscript, onAudioBlob } = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript("");
    setDuration(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onAudioBlob?.(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      // Duration timer
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Web Speech API for transcription
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "hi-IN"; // supports Hindi + English
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
          let finalText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript;
            }
          }
          if (finalText) {
            setTranscript((prev) => prev + " " + finalText);
            onTranscript?.(finalText);
          }
        };

        recognition.onerror = (e) => {
          if (e.error !== "no-speech") setError(`Speech error: ${e.error}`);
        };

        recognition.start();
      }
    } catch (err) {
      setError(err.message || "Microphone access denied");
    }
  }, [onTranscript, onAudioBlob]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    recognitionRef.current?.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    stopRecording();
    chunksRef.current = [];
    setTranscript("");
    setDuration(0);
  }, [stopRecording]);

  return { isRecording, duration, transcript, error, startRecording, stopRecording, cancelRecording };
};
