"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";


const FloatingParticles = () => {
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-coral/60" style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }} animate={{
      y: [-20, -100],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5]
    }} transition={{
      duration: 4 + Math.random() * 4,
      repeat: Infinity,
      delay: Math.random() * 4,
      ease: "easeInOut"
    }} />)}
    </div>;
};


export const Hero = () => {
  return <div>
    {/* Hero Image Section */}
    <section className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0">
        <img src="/hero-family.png" alt="Immersive family connection" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-transparent to-background/20" />
        <div className="absolute inset-0 bg-linear-to-r from-background/0 via-transparent to-background/0" />
        {/* <div className="absolute inset-0 bg-linear-to-b from-background/80 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40" /> */}
      </div>
      
      <FloatingParticles />
      
      {/* Top Content - Logo */}
      <div className="relative z-10 pt-24 md:pt-32 px-4">
        <motion.div className="flex justify-center">
          <motion.img src="/holovox-logo.png" alt="HoloVox" className="h-16 md:h-24" initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} />
        </motion.div>
      </div>
      
      <div className="flex-1" />
    </section>

    {/* Glass Card - Below the hero image with breathing room */}
    <div className="relative z-20 px-4 flex justify-center -mt-20 md:-mt-24">
      <div className="items-center shadow-[0_10px_25px_rgba(233,22,75,0.3)] justify-center text-center w-5xl bg-white rounded-3xl p-8 md:p-12 flex flex-col gap-6">
        <motion.h1 className="font-creata text-gray-800 text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight" initial={{
        opacity: 0.5,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }}>
          Step Into Someone's
          <span className="block text-[#E4246E]">Reality</span>
        </motion.h1>
        
        <motion.p className="text-lg md:text-xl max-w-3xl drop-shadow-lg text-[#8585ad]" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }}>
          {/* Immersive 360° streaming that brings you closer. 
          Use any device—phone, smart glasses, or VR—to experience 
          the world through someone else's eyes. */}
          Experience immersive, AI-powered video that feels like you're really there. 
Enjoy a wide-angle 360° view using just your phone—no expensive hardware required. 
Step beyond flat calls and into real presence.
        </motion.p>
        
        <motion.div className="w-full max-w-md" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.6
      }}>
          <p className="text-sm text-gray-600 mb-3 drop-shadow">
            Coming Soon — Join the waitlist
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <Input type="email" placeholder="Enter your email" className="flex-1 h-12 bg-card/60 backdrop-blur-sm border-border/50 text-gray-600 placeholder:text-gray-400" />
            <Button type="submit" className="h-12 px-8 bg-[#E9164B] hover:bg-red-500 text-white font-medium glow-coral transition-all">
              Notify Me
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  </div>;
};