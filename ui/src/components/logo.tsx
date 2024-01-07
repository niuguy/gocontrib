/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Box, BoxProps, Typography } from "@mui/joy";

export function Logo(props: LogoProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderBottom: ({ palette }) => `1px solid ${palette.divider}`,
        ...sx,
      }}
      {...other}
    >
      {/* <IconButton component={Link} to="/" color="primary" variant="soft">
        <BrightnessAutoRounded />
      </IconButton> */}
      <Typography sx={{ fontSize: "1.25rem" }} level="h4" component="div">
        {import.meta.env.VITE_APP_NAME}
      </Typography>
    </Box>
  );
}

export type LogoProps = Omit<BoxProps, "children">;
