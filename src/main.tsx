import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider, createTheme } from '@mantine/core'
const theme = createTheme({
    primaryColor: 'yellow',
})

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // Stop default Chrome behavior
    event.prompt(); // Show the install prompt manually
});


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <App />
        </MantineProvider>
    </StrictMode >,
)
