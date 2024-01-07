/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box, BoxProps, List } from "@mui/joy";

import { Following } from "./sidebar-following";
import { Navigation } from "./sidebar-nav";
export function Sidebar(props: SidebarProps): JSX.Element {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        display: "flex",
        gap: 1,
        borderRight: ({ palette }) => `1px solid ${palette.divider}`,
        ...sx,
      }}
      {...other}
    >
      <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
        <Navigation />
        <Following />
      </List>
    </Box>
  );
}

type SidebarProps = Omit<BoxProps, "children">;
