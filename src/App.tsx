import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { About, Notes, Note, Profile, NotFound, Settings, Folders } from "./pages/index.tsx";
import { Stack } from "@mantine/core";

import Test1 from "./pages/TransitionTest/Test1.tsx";
import Test2 from "./pages/TransitionTest/Test2.tsx";

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
            { path: "/folders", element: <Folders /> },
            { path: "/profile", element: <Profile /> },
            { path: "/settings", element: <Settings /> },
            { path: "/about", element: <About /> },
            {
                path: "/transition-test", children: [
                    { index: true, element: <Test1 /> },
                    { path: "/transition-test/test1", element: <Test1 /> },
                    { path: "/transition-test/test2", element: <Test2 /> },
                ]
            },
            { path: "*", element: <NotFound /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App
