// "use client";
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Mail, Lock, User, Github, Chrome } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const [showAuth, setShowAuth] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden relative">
//       {/* 360° Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Floating gradient spheres */}
//         <div className="absolute w-[60vmax] h-[60vmax] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 top-[-20vmax] right-[-20vmax] animate-spin-slow"></div>
//         <div className="absolute w-[50vmax] h-[50vmax] rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 bottom-[-20vmax] left-[-20vmax] animate-spin-reverse"></div>

//         {/* 3D Grid */}
//         <div className="absolute inset-0">
//           <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-grid animate-grid-move"></div>
//         </div>

//         {/* Camera Lens Effect */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//           <div className="relative w-[30vmin] h-[30vmin]">
//             <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
//             <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-white/40 to-white/10 animate-spin-slow"></div>
//           </div>
//         </div>

//         {/* Orbiting Rings */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//           <div className="relative w-[80vmin] h-[80vmin] animate-spin-slow">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute inset-0 rounded-full border border-white/10"
//                 style={{
//                   transform: `rotate(${i * 45}deg)`,
//                   animation: `orbitPulse 3s ease-in-out ${i * 0.5}s infinite`
//                 }}
//               >
//                 <div className="absolute w-2 h-2 bg-white rounded-full top-[-4px] left-1/2 -translate-x-1/2 shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Floating Particles */}
//         <div className="absolute inset-0">
//           {[...Array(50)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-1 h-1 bg-white rounded-full animate-float"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${3 + Math.random() * 4}s`
//               }}
//             ></div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           className="text-center max-w-4xl"
//         >
//           <motion.h1
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-glow"
//           >
//             HoloVax
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl"
//           >
//             "The next generation of immersive video collaboration. Connect your 360° hardware
//             and step into the same room, from anywhere in the world."
//           </motion.p>

//           <motion.button
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.9 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowAuth(true)}
//             className="relative px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full shadow-2xl hover:shadow-pink-500/25 overflow-hidden group animate-gradient"
//           >
//             <span className="relative z-10">Get Started</span>
//             <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* Authentication Modal */}
//       <AnimatePresence>
//         {showAuth && (
//           <AuthModal onClose={() => setShowAuth(false)} />
//         )}
//       </AnimatePresence>

//       <style jsx>{`
//         @keyframes orbitPulse {
//           0%, 100% { border-color: rgba(255,255,255,0.1); }
//           50% { border-color: rgba(255,255,255,0.3); }
//         }
//       `}</style>
//     </div>
//   );
// }

// // Authentication Modal Component
// function AuthModal({ onClose }) {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//       className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.8, y: 50 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.8, y: 50 }}
//         onClick={(e) => e.stopPropagation()}
//         className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
//         >
//           <X size={24} />
//         </button>

//         <div className="mb-8">
//           <div className="flex gap-2 p-1 bg-white/10 rounded-full">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
//                 isLogin
//                   ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
//                   : 'text-white/70 hover:text-white'
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
//                 !isLogin
//                   ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
//                   : 'text-white/70 hover:text-white'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>
//         </div>

//         {isLogin ? <LoginForm /> : <SignUpForm />}
//       </motion.div>
//     </motion.div>
//   );
// }

// // Login Form Component
// function LoginForm() {
//    const router = useRouter();
//   function handleGetStarted() {
//     router.push('/connect');
//   }

//   return (
//     <motion.form
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="space-y-6"
//       onSubmit={(e) => e.preventDefault()}
//     >
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//         <p className="text-white/60">Login to continue your immersive experience</p>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-between text-sm">
//         <label className="flex items-center gap-2 text-white/60">
//           <input type="checkbox" className="rounded bg-white/10 border-white/20" />
//           Remember me
//         </label>
//         <button className="text-pink-400 hover:text-pink-300 transition-colors">
//           Forgot password?
//         </button>
//       </div>

//       <button
//         type="submit"
//         onClick={handleGetStarted}
//         className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
//       >
//         <span className="relative z-10">Login</span>
//         <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
//       </button>

//       <div className="relative my-8">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-white/20"></div>
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-4 bg-transparent text-white/40">Or continue with</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <button className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
//           <Chrome size={20} />
//           Google
//         </button>
//         <button className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
//           <Github size={20} />
//           GitHub
//         </button>
//       </div>
//     </motion.form>
//   );
// }

// // Sign Up Form Component
// function SignUpForm() {
//   return (
//     <motion.form
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="space-y-6"
//       onSubmit={(e) => e.preventDefault()}
//     >
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//         <p className="text-white/60">Join the future of video collaboration</p>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
//             <input
//               type="password"
//               placeholder="Create a password"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
//             <input
//               type="password"
//               placeholder="Confirm your password"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
//             />
//           </div>
//         </div>
//       </div>

//       <label className="flex items-start gap-2 text-sm text-white/60">
//         <input type="checkbox" className="mt-1 rounded bg-white/10 border-white/20" />
//         <span>I agree to the Terms of Service and Privacy Policy</span>
//       </label>

//       <button
//         type="submit"
//         className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
//       >
//         <span className="relative z-10">Sign Up</span>
//         <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
//       </button>
//     </motion.form>
//   );
// }

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { Pricing } from "@/components/Pricing";
import { Hardware } from "@/components/Hardware";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <section id="features">
        <Features />
      </section>
      <UseCases />
      <section id="pricing">
        <Pricing />
      </section>
      <section id="hardware">
        <Hardware />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
