// src/App.tsx
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import SheetStats from '@/routes/Viewer'
import Home from '@/routes/Home'
import LimitedBanner from '@/routes/Limited'
import PrivacyPolicy from "@/routes/PrivacyPolicy"
import TermsOfService from "@/routes/TermsOfService"
import { LanguageProvider } from "@/utils/language.tsx"

export default function App() {
    return (
        <LanguageProvider>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/viewer" element={<SheetStats />} />
                <Route path="/banner" element={<LimitedBanner />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </LanguageProvider>
    )
}
