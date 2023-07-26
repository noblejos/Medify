import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const useNotification = () => {
  const handleError = (title: string, msg: string) => {
    notifications.show({
      title: title,
      message: msg,
      icon: <IconX size="0.8rem" />,
      color: "red",
      styles: (theme) => ({
        root: {
          backgroundColor: "#FEEDE6",
          border: "1px solid #F44708",
          width: "500px",
          borderRadius: "5px",

          //   "&::before": { backgroundColor: theme.white },
        },

        title: { fontSize: "13px", fontWeight: 700, color: "#F44708" },
        description: { color: "#F44708", fontSize: "11px" },
        closeButton: {
          color: "#F44708",
          "&:hover": { backgroundColor: theme.colors.blue[7] },
        },
      }),
    });
  };

  const handleSuccess = (title: string, msg: string) => {
    notifications.show({
      title: title,
      message: msg,
      icon: <IconCheck size="0.8rem" />,
      color: "teal",
      styles: (theme) => ({
        root: {
          backgroundColor: "#EFF5F1",
          border: "1px solid #76AD87",
          width: "500px",
          borderRadius: "5px",

          //   "&::before": { backgroundColor: theme.white },
        },

        title: { fontSize: "13px", fontWeight: 700, color: "#375F43" },
        description: { color: "#375F43", fontSize: "11px" },
        closeButton: {
          color: theme.white,
          "&:hover": { backgroundColor: theme.colors.blue[7] },
        },
      }),
    });
  };

  return {
    handleError,
    handleSuccess,
  };
};

export default useNotification;
