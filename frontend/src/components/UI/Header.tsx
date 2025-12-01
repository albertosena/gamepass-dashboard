import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="bg-xbox-darker border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-xbox-green rounded-full flex items-center justify-center">
                        <Gamepad2 className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                            Xbox Game Pass
                        </h1>
                        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                            Console Catalog + Metacritic
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex gap-4 text-sm font-medium text-gray-300">
                        <a href="#" className="hover:text-white transition-colors">Games</a>
                        <a href="#" className="hover:text-white transition-colors">Perks</a>
                        <a href="#" className="hover:text-white transition-colors">Community</a>
                    </nav>
                    <div className="w-px h-6 bg-white/10"></div>
                    <button className="text-sm font-bold text-xbox-green hover:text-green-400 transition-colors">
                        JOIN NOW
                    </button>
                </div>
            </div>
        </header>
    );
};
