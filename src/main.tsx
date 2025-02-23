import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider, createTheme } from '@mantine/core'
import { AuthProvider } from './context/auth/';
import { NotesProvider } from './context/notes/';
import { FoldersProvider } from './context/folders/';
const theme = createTheme({
    primaryColor: 'yellow',
})

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AuthProvider>
                <FoldersProvider>
                    <NotesProvider>
                        <App />
                    </NotesProvider>
                </FoldersProvider>
            </AuthProvider>
        </MantineProvider>
    </StrictMode >,
)
