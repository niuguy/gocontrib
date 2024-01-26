import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { MainLayout, RootError } from "../components";

export const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/explore" replace /> },
      { path: "explore", lazy: () => import("./explore") },
      { path: "repos", lazy: () => import("./repos") },
      { path: "tasks", lazy: () => import("./tasks") },
      { path: "issues/:repo_owner/:repo_name", lazy: () => import("./issues") },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
