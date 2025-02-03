import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, Notes, Note, Profile, NotFound, Settings } from "./pages/index.tsx";
import { Stack } from "@mantine/core";


function App() {
    return (
        <>
            <BrowserRouter>
                <div className="fixed left-0 top-0 w-full h-full">
                    <Stack
                        w={"100%"}
                        h={"100%"}
                        align="stretch"
                        justify="center"
                        gap="sm"
                    >
                        <Routes>
                            <Route path="/" element={<Notes />} />
                            <Route path="/note/:id?" element={<Note />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/about" element={<About />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Stack>
                </div>
            </BrowserRouter >
        </>
    )
}

export default App
