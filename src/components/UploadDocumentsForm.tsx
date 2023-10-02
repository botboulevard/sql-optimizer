import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import UploadFile from './UploadFile';
import UserDataContext from './UserDataContext';
import { Button, CircularProgress, HStack, Textarea, VStack } from '@chakra-ui/react'
import { toast } from 'react-toastify';
export function UploadDocumentsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const hasUploaded = useContext(UserDataContext)?.hasUploaded;
  const setHasUploaded = useContext(UserDataContext)?.setHasUploaded;
  const chatID = useContext(UserDataContext)?.chatId;
  // set disabled to this for text area
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (hasUploaded) setDocument('Uploaded!');
  }, [hasUploaded]);

  const ingest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    let response;
    if (files.length > 0) {
      const data = new FormData();
      data.append('file', files[0], files[0].name);
      data.append('chatId', chatID || '');
      response = await axios.post('/api/v1/ingest', data);

      // response = await fetch('/api/v1/ingest', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'multipart/formdata' },
      //   file: files[0],
      //   body: JSON.stringify({
      //     document: files[0],
      //     chatId: chatID,
      //   }),
      // });
    } else {
      response = await axios.post(
        '/api/v1/ingest',
        {
          text: document,
          chatId: chatID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (response.status === 200) {
      setDocument('Uploaded!');
      if (setHasUploaded) {
        setHasUploaded(true);
        setIsLoading(false);
      }
    } else {
      const json = response.data;
      if (json.error) {
        setDocument(json.error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('files', files);
  }, [files]);

  return (
    <VStack sx={{
      width: "100%",
      // padding: "4px",
      borderRadius: "lg",

    }}>
      <HStack
        sx={{
          width: "100%",
        }}
      >
        <Textarea
          sx={{
            width: "100%",
            // padding: "4px",
            borderRadius: "lg",
          }}
          // className="w-full p-4 rounded"
          // value={document}
          onChange={e => setDocument(e.target.value)}
          style={{ minHeight: '40vh' }}
          placeholder="Enter your SQL Table Structure here"
          disabled={isDisabled}
        
        />
        <UploadFile
          onFileUpload={(files: File[]) => {
            if (files.length > 0) setIsDisabled(true);
            else setIsDisabled(false);
            setFiles(files);
            setDocument('');
          }}
        />
      </HStack>
      <HStack
        mr={'auto'}

      >
        <Button
          disabled={files.length === 0 && document.length === 0}
          cursor={isLoading ? "not-allowed" : "pointer"}
          opacity={isLoading ? 0.5 : 1}
          onClick={()=>toast.error("No API yet")}
          isLoading={isLoading}
        >
          {hasUploaded ? (
            <span>Uploaded</span>
          ) : (
            <span>Upload</span>
          )}
        </Button>

        {hasUploaded && <Button color={'red'}>Clear</Button>}
      </HStack>
    </VStack>
  );
}
