import {
  Group,
  Text,
  useMantineTheme,
  rem,
  Image,
  Button,
  Center,
  Container,
  createStyles,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";

import useNotification from "@/hooks/useNotification";

interface FileUploaderProps extends Partial<DropzoneProps> {
  file: File[] | null;
  setFile: React.Dispatch<React.SetStateAction<File[] | null>>;
  error?: string;
}

const useStyles = createStyles((theme) => ({
  image: {
    objectFit: "contain",
    minHeight: rem(90),
  },
}));

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  title,
  error,
  ...rest
}) => {
  const { classes } = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const { handleError } = useNotification();

  const handleDrop = (files: File[]) => {
    if (files && files.length > 0) {
      setFile([]); // Clear the previous files
      const droppedFile = files[0];
      setFile([droppedFile]); // Set the file as an array

      // Simulating upload delay with setTimeout
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const renderFilePreview = () => {
    if (file) {
      if (file[0]?.type?.includes("image")) {
        return (
          <Image
            src={URL.createObjectURL(file[0])}
            alt="File Preview"
            width={150}
            height={150}
            className={classes.image}
          />
        );
      } else {
        return <div>{file[0].name}</div>;
      }
    }
    return null;
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) =>
          handleError(
            "File Upload Failed",
            "An error occurred while uploading your file"
          )
        }
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        loading={isLoading}
        multiple={false}
        sx={{ border: error ? "1px solid red" : "" }}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ maxHeight: rem(150), pointerEvents: "none" }}
        >
          {file ? (
            renderFilePreview()
          ) : (
            <Container size={150}>
              <Center
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Text size="xs" fw={900}>
                  {title}
                </Text>
                <Text size="xs" fz={8} mb={5} color="dimmed" mt={7} ta='center'>
                  Supports: jpeg, jpg, png, gif - Max: 5MB
                </Text>
                <Button size="xs" fz={10} variant="outline">
                  Choose File
                </Button>
              </Center>
            </Container>
          )}
        </Group>
      </Dropzone>
      {error && (
        <Text size={"sm"} fw={400} mb={10} color="#fa5252">
          {error}
        </Text>
      )}
    </>
  );
};

export default FileUploader;
