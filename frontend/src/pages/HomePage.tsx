// src/components/HomePage.tsx
import React from 'react';
import image from '../assets/image.jpg'; // Import the image

const HomePage: React.FC = () => {
    return (
        <div>
            <header
                className="relative bg-cover bg-center h-[80vh]" // Adjusted to 80% of the viewport height
                style={{ backgroundImage: `url(${image})` }} // Use the imported image
            >
                <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                    <h2 className="text-4xl text-white font-bold">Digital Fund Management System</h2>
                </div>
            </header>

            {/* You can add more sections here for the HomePage content */}
            <section className="py-8 px-4">
                <h3 className="text-2xl font-semibold mb-4">Welcome to Our Platform</h3>
                <p className="text-gray-700">
                    We provide a seamless way to manage your fund activities. Join us today to start managing your funds efficiently.
                </p>
                {/* Add more content or components as needed */}
            </section>
        </div>
    );
};

export default HomePage;
