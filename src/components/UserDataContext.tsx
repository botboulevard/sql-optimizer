import { Message } from 'ai';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { decryptData, encryptData } from './utils/utils';
import { v4 as uuidv4 } from 'uuid';

type LocalCustomData = {
  chatId: string | null;
  conversation: Message[];
  hasUploaded: boolean;
};

interface UserDataContextModel {
  hasUploaded: boolean;
  setHasUploaded: Dispatch<SetStateAction<boolean>>;
  chatId: string | null;
  setChatId: Dispatch<SetStateAction<string | null>>;
  conversation: Message[];
  setConversation: Dispatch<SetStateAction<Message[]>>;
}

const UserDataContext = createContext<UserDataContextModel | null>(null);

type UserDataProviderProps = {
  children: ReactNode;
};

function UserDataProvider({ children }: UserDataProviderProps): React.ReactElement {
  const returnLocalData = (key: keyof LocalCustomData) => {
    const data = localStorage.getItem('user_data');
    if (data) {
      const decryptedData: LocalCustomData = JSON.parse(decryptData(data));
      return decryptedData[key];
    }
    return null;
  };

  const [hasUploaded, setHasUploaded] = useState(() => (returnLocalData('hasUploaded') as boolean) || false);
  const [chatId, setChatId] = useState<string | null>(() => (returnLocalData('chatId') as string) || uuidv4());
  const [conversation, setConversation] = useState<Message[]>(() => (returnLocalData('conversation') as Message[]) || []);

  useEffect(() => {
    if (process.env.REACT_APP_NOT_SECRET_CODE) {
      localStorage.setItem(
        'user_data',
        encryptData(JSON.stringify({ chatId, conversation, hasUploaded: hasUploaded }), process.env.REACT_APP_NOT_SECRET_CODE),
      );
    }
  }, [chatId, conversation, hasUploaded]);

  useEffect(() => {
    if (process.env.REACT_APP_NOT_SECRET_CODE) {
      const data = localStorage.getItem('user_data');
      if (data) {
        const decryptedData: LocalCustomData = JSON.parse(decryptData(data));
        const { chatId, conversation, hasUploaded } = decryptedData;

        setChatId(chatId);
        setConversation(conversation);
        setHasUploaded(hasUploaded);
      }
    }
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        hasUploaded,
        setHasUploaded,
        chatId,
        setChatId,
        conversation,
        setConversation,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

const UserDataConsumer = UserDataContext.Consumer;

export { UserDataProvider, UserDataConsumer };
export default UserDataContext;
