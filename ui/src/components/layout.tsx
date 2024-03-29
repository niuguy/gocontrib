import { Box, GlobalStyles } from "@mui/joy";
import { Fragment, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Logo } from "./logo";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

/**
 * The main application layout.
 */
export function MainLayout(): JSX.Element {
  return (
    <Fragment>
      <GlobalStyles
        styles={{
          "#root": {
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridTemplateRows: "auto 1fr",
            height: "100vh",
            overflow: "hidden",
          },
          body: {
            margin: 0,
            overflow: "hidden",
          },
        }}
      />
      <Toolbar sx={{ gridArea: "1 / 2 / 2 / -1" }} />

      <Sidebar sx={{ gridArea: "2/ 1 / -1 / 2" }} />

      <Logo sx={{ gridArea: "1 / 1 / 2 / 2", zIndex: 100 }} />

      <Box sx={{ gridArea: "1 / 2 / -1 / -1", pt: "60px" }}>
        <div style={{ height: "calc(100vh - 60px)", overflowY: "auto" }}>
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
      </Box>
    </Fragment>
  );
}

/**
 * The minimal app layout to be used on pages such Login/Signup,
 * Privacy Policy, Terms of Use, etc.
 */
export function BaseLayout(): JSX.Element {
  return (
    <Fragment>
      <GlobalStyles
        styles={{
          "#root": {
            display: "grid",
            gridTemplateColumns: "1fr",
            minHeight: "100vh",
          },
        }}
      />

      <Box sx={{ gridArea: "1 / 1 / 2 / 2 " }}>
        <Logo />
      </Box>

      <Box sx={{ gridArea: "1 / 1 / -1 / -1", pt: "60px" }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </Box>
    </Fragment>
  );
}
