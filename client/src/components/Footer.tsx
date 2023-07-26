import { createStyles, Container, rem } from "@mantine/core";
import { ReactElement } from "react";

const useStyles = createStyles((theme) => ({
  footer: {
    position: "fixed",
    bottom: 0,
    width: "calc(100% - 15.625rem)",
    left: "15.625rem",
    height: "49px",
    background: "#FAFAFA",
    borderTop: `${rem(1)} solid ${theme.colors.gray[2]}`,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    paddingInline: "2rem",
  },
}));

export function LayoutFooter({
  Component,
}: {
  Component: ReactElement | undefined;
}) {
  const { classes } = useStyles();

  return <div className={classes.footer}>{Component ?? null}</div>;
}
