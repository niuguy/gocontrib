/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box, BoxProps } from "@mui/joy";
import { Fragment, Suspense } from "react";


export function Toolbar(props: ToolbarProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        gap: 1,
        px: 2,
        ...sx,
      }}
      component="header"
      {...other}
    >
      <Box sx={{ flexGrow: 1 }} component="span" />

      <Suspense>
        <ActionButtons />
      </Suspense>
    </Box>
  );
}

function ActionButtons(): JSX.Element {

  return (
    <Fragment>

      {/* <IconButton variant="soft" size="sm">
        <NotificationsRounded />
      </IconButton> */}

      
    </Fragment>
  );
}

type ToolbarProps = Omit<BoxProps<"header">, "children">;
