import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import {
  Header,
  Text,
  MediaQuery,
  Burger,
  Image,
  useMantineTheme,
  Group,
  Avatar,
  rem,
  Flex,
  Menu,
  UnstyledButton,
  createStyles,
  Indicator,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconPlayerPause,
  IconSettings,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { RiNotification2Line } from "react-icons/ri";
// import User from "@/store/user.store";

import Logo from "@/assets/images/medify.png";
import Link from "next/link";
import useNotification from "@/hooks/useNotification";
import { getCookie, deleteCookie } from "cookies-next";
import { BaseUrl } from "@/config/baseUrl";
import User from "@/store/user.store";
import { useRouter } from "next/router";

const server = process.env.NEXT_PUBLIC_DB_HOST;

const useStyles = createStyles((theme) => ({
  user: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.colors.medifyGrey[4],
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  userText: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  wrapper: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
  },

  textkbdContainer: {
    flexGrow: 1,
    display: "flex",
    margin: "0 20px 0 0",

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  searchbtn: {
    display: "none",

    [theme.fn.smallerThan("md")]: {
      display: "block",
    },
  },

  textkbd: {
    maxWidth: rem(800),
    width: "100%",

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      minWidth: "100%",
    },
  },

  bgHover: {
    "&:hover": {
      backgroundColor: theme.colors.medify[4],
      color: theme.colors.medify[0],
    },
  },
}));

interface Props {
  toggleOverlay: () => void;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function HeaderComponent({
  toggleOverlay,
  opened,
  setOpened,
}: Props) {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const { handleError } = useNotification();
  const router = useRouter()

  const queryClient = useQueryClient()
  const { removeUser, user } = User()

  const [modalOpened, { open, close }] = useDisclosure(false);
  const [appSwitch, setAppSwitch] = useState("");
  const [loading, setLoading] = useState(false);

  const token = getCookie("auth")
  const [userMenuOpened, setUserMenuOpened] = useState(false);


  const fetchNotifications = async () => {
    const { data: response } = await axios.get(`${BaseUrl}/notifications`, {
      headers: {
        Authorization: "Bearer " + `${token}`,
      }
    });
    return response.data;
  }
  const { isLoading, isError, data: notification, error } = useQuery(["notifications"], fetchNotifications)

  const handleLogout = async () => {
    // const token = Cookies.get("auth");
    toggleOverlay();

    try {
      // await axios.get(`${server}/auth/logout`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      deleteCookie("auth")
      removeUser();
      window.location.replace("/auth/login");
    } catch (error) {
      toggleOverlay();
    }
  };


  return (
    <Header height={{ base: 60, md: 60 }} p="md">
      <div className={classes.wrapper}>
        <div style={{ width: 234 }}>
          <Flex align="center">
            <Link href="/">
              <Image src={Logo.src} width={35} />
            </Link>
            <Text fw={700} fz={20} ml={20}>MEDIFY</Text>
          </Flex>
        </div>

        <Group spacing={7}>
          <Flex align="center">
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Link href={"/notifications"}>
              <Indicator
                inline
                label={<Text size="8px">{notification?.length}</Text>}
                size={15}
                mr={20}
                mt={3}
              >
                <RiNotification2Line
                  color={theme.colors.medifyGrey[2]}
                  size={20}
                />
              </Indicator>
              </Link>

            </MediaQuery>

            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton className={cx(classes.user)}>
                  <Group spacing={7}>
                    <Avatar radius="xl" size={30} color="gray">
                      {user?.firstName.charAt(0)}
                      {user?.lastName.charAt(0)}
                    </Avatar>
                    <Group className={cx(classes.userText)}>
                      <IconChevronDown size={rem(12)} stroke={1.5} />
                    </Group>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  className={classes.bgHover}
                  onClick={handleLogout}
                  icon={<IconLogout size="0.9rem" stroke={1.5} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened(!opened)}
                size="sm"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>
          </Flex>
        </Group>
      </div>
    </Header>
  );
}
