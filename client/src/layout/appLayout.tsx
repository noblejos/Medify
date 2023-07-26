import { ComponentType, useState, useEffect, ReactElement } from "react";
import { AppShell, Text, useMantineTheme, LoadingOverlay } from "@mantine/core";

import { SpotlightProvider } from "@mantine/spotlight";
import type { SpotlightAction } from "@mantine/spotlight";

import HeaderComponent from "@/components/Header";
import {
  IconHome,
  IconDashboard,
  IconFileText,
  IconSearch,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import HeadMeta from "@/components/Head";
import { NavbarSearch } from "@/components/Navbar";

import styles from "@/styles/layout.module.scss";

const actions: SpotlightAction[] = [
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => console.log("Home"),
    icon: <IconHome size="1.2rem" />,
  },
  {
    title: "Dashboard",
    description: "Get full information about current system status",
    onTrigger: () => console.log("Dashboard"),
    icon: <IconDashboard size="1.2rem" />,
  },
  {
    title: "Documentation",
    description: "Visit documentation to lean more about all features",
    onTrigger: () => console.log("Documentation"),
    icon: <IconFileText size="1.2rem" />,
  },
];

export default function withLayout(
  Component: ComponentType<{ data: any }>,
  pageName: string = "",
  footerComponent?: ReactElement
) {
  function ApplicationShell(props: any) {
    const [query, setQuery] = useState("");

    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const [visible, { toggle }] = useDisclosure(false);

    return (
      <SpotlightProvider
        actions={actions}
        searchIcon={<IconSearch size="1.2rem" />}
        searchPlaceholder="Search..."
        shortcut="shift + r"
        nothingFoundMessage={
          <Text>Search re:Current for &quot;{query}&quot;</Text>
        }
        onQueryChange={(q) => setQuery(q)}
      >
        <HeadMeta pageName={pageName} />
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark" ? theme.colors.dark[8] : "#fff",
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={<NavbarSearch opened={opened} setOpened={setOpened} />}
          header={
            <HeaderComponent
              toggleOverlay={toggle}
              opened={opened}
              setOpened={setOpened}
            />
          }
        >
          <div className={styles.innerContainer}>
            <Component {...props} />
          </div>
        </AppShell>
      </SpotlightProvider>
    );
  }

  return ApplicationShell;
}
