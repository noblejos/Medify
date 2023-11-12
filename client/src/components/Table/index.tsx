import {
    createStyles,
    Header,
    HoverCard,
    Group,
    Button,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    rem,
    Container,
    Flex
} from "@mantine/core";
import {
    IconSelector,
    IconChevronDown,
    IconChevronUp,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
    th: {
        padding: "0 !important",
        backgroundColor: "#F5F5F5 !important",
        color: "#F9C27C !important"
    },
    td: {
        padding: "0 !important",
        borderTop: "none !important"
    },
    tbodyStyle: {
        // cursor: "pointer",
    },
    control: {
        width: "100%",
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },
    control1: {
        width: "100%",
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },

    icon: {
        width: rem(21),
        height: rem(21),
        borderRadius: rem(21),
    },
}))



export function Th({ children, reversed, sorted, onSort, styles, sortable = true, align }: any) {
    const { classes } = useStyles();
    const Icon = sorted
        ? reversed
            ? IconChevronUp
            : IconChevronDown
        : IconSelector;
    return (
        <th className={classes.th} style={{ ...styles }}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text align={align} fw={500} fz="sm" >
                        {children}
                    </Text>
                    {sortable && <Center className={classes.icon}>
                        <Icon size="0.9rem" stroke={1.5} />
                    </Center>}
                </Group>
            </UnstyledButton>
        </th>
    );
}

export function Td({ children, reversed, sorted, onSort, styles }: any) {
    const { classes } = useStyles();
    return (
        <td className={classes.td} style={{ ...styles }}>

            <Text fw={500} fz="sm" className={classes.control1}>
                {children}
            </Text>


        </td>
    );
}
