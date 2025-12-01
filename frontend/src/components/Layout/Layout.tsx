import React, { type ReactNode } from 'react';
import { Header } from '../UI/Header';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-xbox-dark text-white flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-xbox-darker py-8 border-t border-white/5 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>&copy; 2023 Game Pass Dashboard Demo. Not affiliated with Microsoft.</p>
                </div>
            </footer>
        </div>
    );
};
