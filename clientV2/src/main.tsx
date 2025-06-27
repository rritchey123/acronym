import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { Header } from '@/components/Misc/Header/Header.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { Toaster } from './components/ui/sonner.tsx'
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider defaultTheme="dark">
                <Header />
                <Toaster position="top-center" richColors />
                <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>
)
