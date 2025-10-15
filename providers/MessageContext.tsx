"use client";
import { createContext, Dispatch, SetStateAction, useState, ReactNode } from "react";

interface Message {
  role: string;
  content: string;
  timestamp?: number;
}

interface MessageContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<string>>;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState('google/gemini-pro');

  return (
    <MessageContext.Provider value={{ messages, setMessages, selectedModel, setSelectedModel }}>
      {children}
    </MessageContext.Provider>
  );
};
