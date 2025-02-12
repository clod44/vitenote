import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { About, Notes, Note, Profile, NotFound, Settings } from "./pages/index.tsx";
import { Stack } from "@mantine/core";
const Layout = () => (
    <div className="fixed left-0 top-0 w-full h-full content">
        <Stack w="100%" h="100%" align="stretch" justify="center" gap="sm">
            <Outlet />
        </Stack>
    </div>
);

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { index: true, path: "/", element: <Notes /> },
            { path: "/note/:id?", element: <Note /> },
            { path: "/profile", element: <Profile /> },
            { path: "/settings", element: <Settings /> },
            { path: "/about", element: <About /> },
            { path: "*", element: <NotFound /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App
