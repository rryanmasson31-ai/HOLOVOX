 "use client";
 import { motion } from "framer-motion";
 import { Button } from "./ui/button";
 import { Input } from "./ui/input";
 import { ArrowRight, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
 
 const footerLinks = {
   Product: ["Features", "Pricing", "Hardware", "Enterprise"],
   Company: ["About", "Careers", "Press", "Contact"],
   Resources: ["Documentation", "Help Center", "Community", "Blog"],
   Legal: ["Privacy", "Terms", "Security", "Cookies"],
 };
 
 const socialLinks = [
   { icon: Twitter, href: "#" },
   { icon: Instagram, href: "#" },
   { icon: Youtube, href: "#" },
   { icon: Linkedin, href: "#" },
 ];
 
 export const Footer = () => {
   return (
     <footer className="py-16 flex justify-center bg-[#0C0C2A] md:py-24 border-t border-border/50">
       <div className="container px-4">
         {/* CTA Section */}
         <motion.div
           className="max-w-4xl mx-auto text-center mb-20"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
           <h2 className="font-creata text-3xl md:text-5xl font-bold text-white mb-6">
             Ready to <span className="text-[#E9164B]">Holo</span>?
           </h2>
           <p className="text-lg text-muted-foreground text-[#8783AB] mb-8 max-w-xl mx-auto">
             Join thousands already on the waitlist. Be the first to experience 
             the future of immersive communication.
           </p>
           <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
             <Input
               type="email"
               placeholder="Enter your email"
               className="flex-1 h-12 bg-white text-black backdrop-blur-sm border-border/50"
             />
             <Button 
               type="submit"
               className="h-12 px-8 bg-[#E9164B] hover:bg-red-500 text-white glow-coral"
             >
               Join Waitlist
               <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
           </form>
         </motion.div>
         
         {/* Links Grid */}
         <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
           <div className="col-span-2 md:col-span-1">
             <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/holovox-icon.png"
                alt="HoloVox"
                className="h-8 md:h-10"
              />
              <span className="font-creata text-xl font-semibold text-white hidden sm:block">
                HOLOVOX
              </span>
            </a>
             <p className="text-sm text-muted-foreground text-[#8783AB] mb-4">
               See me. Feel me. Holo me.
             </p>
             <div className="flex gap-3">
               {socialLinks.map((social, index) => (
                 <a
                   key={index}
                   href={social.href}
                   className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-black hover:text-[#E9164B] transition-all"
                 >
                   <social.icon className="w-5 h-5" />
                 </a>
               ))}
             </div>
           </div>
           
           {Object.entries(footerLinks).map(([category, links]) => (
             <div key={category}>
               <h4 className="font-bold text-white mb-4">{category}</h4>
               <ul className="space-y-3">
                 {links.map((link) => (
                   <li key={link}>
                     <a href="#" className="text-sm text-muted-foreground text-[#8783AB] hover:text-[#E9164B] transition-colors">
                       {link}
                     </a>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
         </div>
         
         {/* Bottom */}
         <div className="flex text-[#8783AB] flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
           <p className="text-sm text-muted-foreground">
             © 2026 HoloVox. All rights reserved.
           </p>
           <p className="text-sm text-muted-foreground">
             Made with ❤️ for a more connected world
           </p>
         </div>
       </div>
     </footer>
   );
 };