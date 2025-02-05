import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider, createTheme } from '@mantine/core'
import { AuthProvider } from './context/auth/';
import { NotesProvider } from './context/notes/';
const theme = createTheme({
    primaryColor: 'yellow',
})

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.addEventListener("beforeinstallprompt", (event: any) => {
    event.preventDefault();
    const deferredPrompt = event;
    deferredPrompt.prompt();
});


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AuthProvider>
                <NotesProvider>
                    <App />
                </NotesProvider>
            </AuthProvider>
        </MantineProvider>
    </StrictMode >,
)
