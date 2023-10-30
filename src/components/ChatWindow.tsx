import { useChat } from 'ai/react';
import { ReactElement, useContext, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import type { FormEvent } from 'react';

import { Message } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../App';
import { ChatMessageBubble } from './ChatMessageBubble';
import { UploadDocumentsForm } from './UploadDocumentsForm';
import UserDataContext from './UserDataContext';

import {
  Box,
  Button,
  CircularProgress,
  Input,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent: ReactElement;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { endpoint, emptyStateComponent, placeholder, titleText = 'An LLM', emoji } = props;

  const conversation = useContext(UserDataContext)?.conversation;
  const setConversation = useContext(UserDataContext)?.setConversation;
  const chatID = useContext(UserDataContext)?.chatId;
  const hasUploaded = useContext(UserDataContext)?.hasUploaded;
  const setHasUploaded = useContext(UserDataContext)?.setHasUploaded;
  const setChatId = useContext(UserDataContext)?.setChatId;
  const setMessages = useContext(UserDataContext)?.setConversation;

  // const [chatEndpointIsLoading, _setChatEndpointIsLoading] = useState(false);

  const clearConversation = () => {
    console.log('clearing conversation');
    if (setHasUploaded) {
      console.log('setting hasUploaded to false');
      setHasUploaded(false);
    }
    if (setChatId) {
      setChatId(uuidv4());
    }
    if (setMessages) {
      setMessages([]);
    }
  };

  const ingestForm = !hasUploaded ? <UploadDocumentsForm></UploadDocumentsForm> : <div className="flex w-full mb-4 flex-col"></div>;
  // const intemediateStepsToggle = showIntermediateStepsToggle && (
  //   <div>
  //     <input
  //       type="checkbox"
  //       id="show_intermediate_steps"
  //       name="show_intermediate_steps"
  //       checked={showIntermediateSteps}
  //       onChange={e => setShowIntermediateSteps(e.target.checked)}
  //     ></input>
  //     <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
  //   </div>
  // );

  const { input, handleInputChange } = useChat({
    api: endpoint,
    id: chatID || undefined,
    headers: {
      'Content-Type': 'application/json',
    },
    onError: e => {
      console.error(e);
      toast(e.message, {
        theme: 'dark',
      });
    },
  });

  // async function sendMessage(e: FormEvent<HTMLFormElement>, prevConversation: Message[]) {
  //   if (conversation === undefined || setConversation === undefined) return;
  //   e.preventDefault();
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.classList.add('grow');
  //   }
  //   if (!conversation.length) {
  //     await new Promise(resolve => setTimeout(resolve, 300));
  //   }
  //   if (chatEndpointIsLoading) {
  //     return;
  //   }
  //   setChatEndpointIsLoading(true);
  //   setConversation(prevConversation => [
  //     ...prevConversation,
  //     {
  //       id: prevConversation.length.toString(),
  //       content: input,
  //       role: 'user',
  //     },
  //   ]);
  //   setInput('');
  //   try {
  //     await fetch(endpoint, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         messages: [
  //           ...prevConversation,
  //           {
  //             id: prevConversation.length.toString(),
  //             content: input,
  //             role: 'user',
  //           },
  //         ],
  //         chatId: chatID,
  //         socketId: socket.id,
  //       }),
  //     });
  //     setChatEndpointIsLoading(false);
  //   } catch (error) {
  //     toast('Error from Server try again', {
  //       theme: 'dark',
  //     });
  //     console.error(error);
  //     setChatEndpointIsLoading(false);
  //   }
  // }

  useEffect(() => {
    socket.on('llmResChunk', (data: { chatID: string; content: string }) => {
      if (data.chatID === chatID) {
        if (!setConversation) return;
        setConversation(prevMessages => {
          let newMessages: Message[] = [];
          if (prevMessages[prevMessages.length - 1]?.role === 'user') {
            const newMessage: Message = {
              id: prevMessages.length.toString(),
              role: 'assistant',
              content: data.content,
            };
            newMessages = [...prevMessages, newMessage];
          } else {
            const newMessage: Message = {
              id: prevMessages.length.toString(),
              role: 'assistant',
              content: data.content,
            };
            newMessages = [...prevMessages.slice(0, -1), newMessage];
          }
          return newMessages;
        });
      }
    });

    socket.on('resError', (data: { chatID: string; error: unknown }) => {
      if (data.chatID === chatID) {
        if (!setConversation) return;
        setConversation(prevMessages => {
          let newMessages: Message[] = [];
          const newMessage: Message = {
            id: prevMessages.length.toString(),
            role: 'assistant',
            content: 'Error: ' + data.error,
          };
          if (prevMessages[prevMessages.length - 1]?.role === 'user') {
            newMessages = [...prevMessages, newMessage];
          } else newMessages = [...prevMessages.slice(0, -1), newMessage];
          return newMessages;
        });
      }
      toast(data.error as string, {
        theme: 'dark',
      });
    });
  }, [chatID, setConversation]);

  const StartChatCard = (
    <Box
      p={4}
      rounded="md"
      w="full"
      overflow="hidden"
    >
      <Text fontSize="3xl" mb={4}>
        Get Started with SQL Optimization
      </Text>
      <UnorderedList>
        <ListItem>
          <Text ml="2">Your database is ready for optimization! You're all set to improve your SQL queries and database performance.</Text>
        </ListItem>
        <ListItem>
          <Text ml="2">Feel free to start optimizing or ask me to suggest indexes for your database by saying: <em>"Optimize my queries"</em></Text>
        </ListItem>
        <ListItem>
          <Text ml="2">I'm here to assist you in fine-tuning your SQL queries and enhancing your database efficiency. Let's get started!</Text>
        </ListItem>
        <ListItem>
          <Text ml="2"><strong>Keep in mind, I offer optimization recommendations, not database administration services. Consult a database expert for specific guidance.</strong></Text>
        </ListItem>
      </UnorderedList>

    </Box>
  );
  useEffect(() => {
    console.log('conversation changed,', conversation);
  }, [conversation])


  const returnHero = () => {
    if (hasUploaded) {
      return StartChatCard;
    } else return emptyStateComponent;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        "@media (min-width: 768px)": {
          padding: "2rem",
        },
        borderRadius: "0.375rem",
        overflow: "hidden",
        border: conversation && conversation.length > 0 ? "1px solid" : "none",
      }}
    >
      <Text
        sx={{
          fontSize: conversation && conversation.length > 0 ? "24px" : "0px",
          md: conversation && conversation.length > 0 ? "32px" : "0px",
          mb: conversation && conversation.length > 0 ? "16px" : "0px",
        }}
      >
        {emoji} {titleText}
      </Text>

      {!conversation || (conversation && conversation.length === 0) ? returnHero() : ""}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          width: "100%",
          marginBottom: "1rem",
          overflow: "auto",
          transition: "flex-grow 0.3s ease-in-out",
        }}
        ref={messageContainerRef}
      >
        {conversation && conversation.length > 0
          ? [...conversation]
            .reverse()
            .map((m, index) => (
              <ChatMessageBubble key={`${m.role}_${index}`} message={m} aiEmoji={emoji}></ChatMessageBubble>
            ))
          : ""}
      </Box>

      {(!conversation || (conversation && conversation.length === 0)) && ingestForm}

      <Box
        // onSubmit={(e) => sendMessage(e, conversation || [])}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          mt: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            mt: "1rem",
          }}
        >
          <Input
            sx={{
              flexGrow: 1,
              marginRight: "1rem",
              p: "1rem",
              borderRadius: "0.375rem",
            }}
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            sx={{
              flexShrink: 0,
              p: "1rem",
              borderRadius: "0.375rem",
              width: "7rem",
              cursor: hasUploaded && input.length === 0 ? "not-allowed" : "pointer",
              opacity: hasUploaded && input.length === 0 ? 0.5 : 1,
            }}
            disabled={hasUploaded && input.length === 0}
          >
            <Text
              role="status"
              sx={{
                // display: chatEndpointIsLoading ? "flex" : "none",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                isIndeterminate
                size="20px"
                color="white"
                sx={{ fill: "sky.800" }}
              />
              <Text sx={{ srOnly: true }}>Loading...</Text>
            </Text>
            {/* <Text sx={{ display: chatEndpointIsLoading ? "none" : "block" }}>Send</Text> */}
          </Button>
        </Box>
      </Box>
      {hasUploaded && (
        <Button
          sx={{
            flexShrink: 0,
            mt: "1rem",
            ml: "1rem",
          }}
          onClick={clearConversation}
        >
          Clear Data
        </Button>
      )}
      <ToastContainer />
    </Box>
  );
}
