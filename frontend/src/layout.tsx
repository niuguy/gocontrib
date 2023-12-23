import {Outlet} from "react-router-dom";

import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import {CssVarsProvider} from "@mui/joy/styles";
// icons
import Header from "./components/Header";
import SideBar from "./components/Sidebar";

export default function RootLayout() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline/>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Header />
                <SideBar />
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: {
                            xs: 2,
                            md: 6,
                        },
                        pt: {
                            xs: "calc(12px + var(--Header-height))",
                            sm: "calc(12px + var(--Header-height))",
                            md: 3,
                        },
                        pb: {
                            xs: 2,
                            sm: 2,
                            md: 3,
                        },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        gap: 1,
                        overflow: 'auto', // Add this to make it scrollable
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            my: 1,
                            gap: 1,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "start", sm: "center" },
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
