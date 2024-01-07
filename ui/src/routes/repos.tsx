/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/joy";

export const Component = function Repos(): JSX.Element {

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Repos
      </Typography>
      <Typography>Coming soon...</Typography>
    </Container>
  );
};
