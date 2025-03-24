import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import MainLayout from '@/views/MainLayout/MainLayout.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                {/*TODO : add fallback route for here*/}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
