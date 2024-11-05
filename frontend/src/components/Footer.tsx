// src/components/Footer.tsx
import React from 'react';
import { SocialIcon } from 'react-social-icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-gray-100 py-10 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Digital Chit Fund Management</h2>
                <p className="text-sm mb-6">
                    This platform is a product from UST Pvt Ltd, designed to bring transparency, organization, and efficiency to traditional savings groups. Our goal is to empower communities by providing a secure online platform where participants can easily view fund allocations, understand financial status, and track the growth of their savings with confidence.
                </p>
                <div className="flex justify-center space-x-4 mb-4">
                    <a href="#" className="w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition">
                    <SocialIcon url="https://facebook.com" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition">
                    <SocialIcon url="https://instagram.com" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition">
                        <SocialIcon url="https://twitter.com" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition">
                        <SocialIcon url="https://youtube.com" />
                    </a>
                </div>
                <div className="flex justify-center space-x-6 text-sm mb-4">
                    <a href="https://www.indiafilings.com/learn/chit-funds/" className="hover:underline">Terms & Conditions</a>
                    <a href="https://chitfund.delhi.gov.in/hi/node/8315" className="hover:underline">Privacy Statement</a>
                </div>
            </div>
            <div className="text-xs text-gray-400 mt-4">
                &copy; {new Date().getFullYear()} Digital Chit Fund Management. A product by UST Pvt Ltd.
            </div>
        </footer>
    );
};

export default Footer;
