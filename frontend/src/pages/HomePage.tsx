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
                   <h2 className="text-4xl text-white font-bold text-center px-4">
                       Digital Fund Management System
                   </h2>
               </div>
           </header>
 
           {/* Introduction Section */}
           <section className="py-8 px-4 text-center">
               <h3 className="text-2xl font-semibold mb-4">Welcome to Our Platform</h3>
               <p className="text-gray-700 max-w-2xl mx-auto">
                   We provide a seamless way to manage your fund activities. Join us today to start managing your funds efficiently.
               </p>
           </section>
 
           {/* About Chit Funds Section */}
           <section className="py-8 px-4 bg-gray-50">
               <h3 className="text-2xl font-semibold mb-6 text-center">About Chit Funds</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                   <div className="bg-white shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2">What is a Chit Fund?</h4>
                       <p className="text-gray-700">
                           A chit fund is a savings and borrowing scheme where members contribute a fixed amount monthly, which one member receives as a lump sum each month.
                       </p>
                   </div>
                   <div className="bg-white shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2">How It Works</h4>
                       <p className="text-gray-700">
                           Each member contributes to a pooled fund, and members receive the pooled amount on a rotating basis. This enables members to save consistently and receive funds when needed.
                       </p>
                   </div>
                   <div className="bg-white shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2">Is It Secure?</h4>
                       <p className="text-gray-700">
                           Yes! Chit funds are legally recognized and regulated in many regions. Our platform enhances transparency and management, ensuring a secure experience.
                       </p>
                   </div>
               </div>
           </section>
 
           {/* Advantages Section */}
           <section className="py-8 px-4">
               <h3 className="text-2xl font-semibold mb-6 text-center">Advantages of Chit Funds</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                   <div className="bg-blue-100 shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2 text-blue-700">Simple Savings</h4>
                       <p className="text-gray-700">
                           Chit funds provide an easy and systematic way to save money over time.
                       </p>
                   </div>
                   <div className="bg-blue-100 shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2 text-blue-700">Flexible Access to Funds</h4>
                       <p className="text-gray-700">
                           Members can receive funds when they need them, making chit funds versatile for various financial needs.
                       </p>
                   </div>
                   <div className="bg-blue-100 shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2 text-blue-700">Community-Based</h4>
                       <p className="text-gray-700">
                           Chit funds operate within a community, promoting trust and cooperation among members.
                       </p>
                   </div>
               </div>
           </section>
 
           {/* Why Choose Us Section */}
           <section className="py-8 px-4 bg-gray-50">
               <h3 className="text-2xl font-semibold mb-6 text-center">Why Choose Our Chit Fund Platform?</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                   <div className="bg-white shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2">Transparency</h4>
                       <p className="text-gray-700">
                           Track all transactions and fund allocations in real time for complete transparency.
                       </p>
                   </div>
                   <div className="bg-white shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2">User-Friendly</h4>
                       <p className="text-gray-700">
                           Our platform is designed for ease of use, making it simple to join and manage funds.
                       </p>
                   </div>
                   <div className="bg-white shadow-lg rounded-lg p-6">
                       <h4 className="text-lg font-semibold mb-2">Enhanced Security</h4>
                       <p className="text-gray-700">
                           We prioritize security, ensuring your contributions and withdrawals are protected at every step.
                       </p>
                   </div>
               </div>
           </section>
       </div>
   );
};
 
export default HomePage;