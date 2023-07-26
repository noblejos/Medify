import { adminLinks, doctorsLinks, userLinks } from "@/constants/navLinks";
import {
  createStyles,
  Navbar,
  UnstyledButton,
  Text,
  Group,
  rem,
  Flex,
  Avatar,
} from "@mantine/core";

import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
    background: "#FAFAFA",

    [theme.fn.smallerThan("sm")]: {
      transform: "translateX(-100%)",
      transition: "transform 500ms ease",
    },
  },

  openNavbar: {
    [theme.fn.smallerThan("sm")]: {
      transform: "translateX(0)",
      transition: "transform 500ms ease",
    },
  },

  section: {
    marginLeft: `calc(${theme.spacing.xs} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,
    marginTop: `calc(${theme.spacing.md} *3)`,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
        }`,
    },
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "calc(100% - 20px)",
    fontSize: theme.fontSizes.xs,
    marginLeft: 10,
    padding: `${rem(14)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 600,
    color: theme.colors.medifyDark[4],

    "&:hover": {
      // backgroundColor: theme.colors.medify[4],
      color: theme.colors.medify[0],
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: "10px"
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },

  customFlex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  activeState: {
    backgroundColor: theme.colors.medifyGrey[3],
    color: theme.colors.medify[0],
    fontWeight: "bolder",
  },

  bottomLink: {
    borderTop: "1px solid #EAEAEB",
    padding: `5px 10px`,
  },
}));

export function NavbarSearch({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  // const { user } = User();
  // const { business } = Business();
  const router = useRouter();
  const { classes, theme } = useStyles();


  const links = userLinks
  // General Links
  const generalLinks = links.map((link) => (
    <Link href={link.path} key={link.path}>
      <UnstyledButton
        mb={20}
        key={link.label}
        className={
          router.pathname === link.path
            ? `${classes.mainLink} ${classes.activeState}`
            : `${classes.mainLink}`
        }
      >
        <div className={classes.mainLinkInner}>
          {link.icon(router.pathname === "/")}
          <span>{link.label}</span>
        </div>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Navbar
      height="100%"
      width={{ sm: 250, md: 250 }}
      p="md"
      className={opened ? `${classes.openNavbar}` : `${classes.navbar}`}
    >
      <div className={classes.customFlex}>
        <div>
          <Navbar.Section className={classes.section}>
            <div className={classes.mainLinks}>{generalLinks}</div>
          </Navbar.Section>
        </div>

        {/* Other */}
        <Navbar.Section className={classes.section} mb={45}>
          <div className={classes.bottomLink}>
            <Flex align="center">
              <Avatar
                radius="0"
                size={30}
                color="dark"
                variant="filled"
                mr={15}
              >
                {/* {user?.firstName.charAt(0)} */}
                A
              </Avatar>
              <Flex direction="column">
                <Text size="10px" weight={700} color={theme.primaryColor}>
                  {/* {business ? String(business).toLocaleUpperCase() : "Classic"} */}
                </Text>
                <Text size="12px" weight={500} color="dimmed">
                  {/* {user?.email} */}
                  test@gmail.com
                </Text>
              </Flex>
            </Flex>
          </div>
        </Navbar.Section>
      </div>
    </Navbar>
  );
}
