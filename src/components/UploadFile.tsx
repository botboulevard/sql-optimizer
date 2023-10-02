import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Box, Text, Button, List, useTheme } from "@chakra-ui/react";
function UploadFile(props: { onFileUpload: (files: File[]) => void }): React.ReactElement {
  const { onFileUpload } = props;
  const [files, setFiles] = React.useState<File[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/sql': ['.sql']
    }, // Specify the accepted file types
    maxFiles: 1, // Allow only one file to be uploaded
    multiple: false, // Do not allow multiple files to be uploaded
    onDropAccepted: files => {
      console.log(files);
    },
    onDropRejected: files => {
      console.log(files);
    },
  });

  useEffect(() => {
    setFiles(acceptedFiles);
    onFileUpload(acceptedFiles);
    console.log(acceptedFiles);
    // read the file content
  }, [acceptedFiles, onFileUpload]);

  const handleRemoveFile = (file: File) => {
    // Splice all files from the acceptedfile
    acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
    onFileUpload([]);
    setFiles([]);
  };

  return (
    <Container maxW="container.lg" centerContent sx={{ textAlign: "center" }}>
      <Box
        {...getRootProps({ className: 'dropzone ' })}
        sx={{
          border: "2px dashed",
          padding: "1rem",
          borderRadius: "lg",
          cursor: "pointer",
          display: "flex",
          width: "100%",
          minHeight: "40vh",
          _hover:{
            borderColor: "gray.500",
          }
        }}
      >
        <input {...getInputProps()} />
        <Text sx={{fontSize: 'lg', m: 'auto' }}>{`Drag 'n' drop you sql file here, or click to select files`}</Text>
      </Box>
      {files.length > 0 && (
        <Box>
          <Text sx={{ fontSize: 'xl', fontWeight: 'semibold' }}>Uploaded File</Text>
          <ul className="file-list">
            {files.map((file) => (
              <List key={file.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="file-info">
                  <span className="file-name">{file.name}</span> - <span className="file-size">{file.size} bytes</span>
                </span>
                <Button
                  onClick={() => handleRemoveFile(file)}
                  variant={"danger"}
                  // color="red.600"
                  // _hover={{ color: "red.800" }}
                  cursor="pointer"
                >
                  Remove
                </Button>
              </List>
            ))}
          </ul>
        </Box>
      )}
    </Container>
  );
}

export default UploadFile;
