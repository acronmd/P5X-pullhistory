// src/App.tsx
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SheetStats from '@/routes/Viewer'
import Home from '@/routes/Home'
import LimitedBanner from '@/routes/Limited'

export default function App() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/viewer" element={<SheetStats />} />
            <Route path="/limited" element={<LimitedBanner />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    )
}
