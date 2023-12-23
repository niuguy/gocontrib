// layouts
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements
} from "react-router-dom";

// pages
import Repos from "./pages/repos";
import Setting from "./pages/setting";
import Tasks from "./pages/tasks";

// layouts
import RootLayout from "./layout";

const router = createHashRouter(
  createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Repos />} />

        <Route path="repos" element={<Repos />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="setting" element={<Setting />} />
      </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
