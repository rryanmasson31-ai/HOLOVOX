"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ShoppingCart, Package, Zap } from "lucide-react";
 
 const products = [
   {
     name: "HoloVox Starter Bundle",
     price: "$948",
     description: "Everything you need to start streaming in 360°",
     items: ["Insta360 X4 Camera", "Tripod Mount", "3-month Basic subscription"],
     badge: "Best Value",
   },
   {
     name: "AR Glasses Kit",
     price: "From $299",
     description: "Compatible smart glasses for immersive viewing",
     items: ["Works with Meta, Xreal, RayBan", "Plug-and-play setup", "Free shipping"],
     badge: null,
   },
   {
     name: "Enterprise Setup",
     price: "Custom",
     description: "Multi-room installations for business",
     items: ["On-site installation", "Training included", "Priority support"],
     badge: "Enterprise",
   },
 ];
 
 export const Hardware = () => {
   return (
     <section className="py-12 flex justify-center md:py-16 relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-navy-light/50 to-transparent pointer-events-none" />
       
       <div className="container px-4 relative">
         <motion.div
           className="text-center max-w-3xl mx-auto mb-16"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E9164B]/10 text-[#E9164B] text-sm font-medium mb-6">
             <Package className="w-4 h-4" />
             Hardware Shop
           </div>
           <h2 className="font-creata text-3xl md:text-5xl font-bold text-gray-600 mb-6">
             Get the <span className="text-[#E9164B]">Full Experience</span>
           </h2>
           <p className="text-lg text-muted-foreground text-[#8783AB]">
             While HoloVox works with your phone, dedicated hardware unlocks the ultimate immersive experience.
           </p>
         </motion.div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
           {products.map((product, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className="bg-white shadow-[0_10px_25px_rgba(233,22,75,0.3)] rounded-2xl p-8 flex flex-col hover:border-[#E9164B]/30 transition-all duration-500 group"
             >
               {product.badge && (
                 <span className="inline-flex self-start px-3 py-1 rounded-full bg-[#E9164B]/20 text-[#E9164B] text-xs font-bold mb-4">
                   {product.badge}
                 </span>
               )}
               <h3 className="font-creata text-xl font-bold text-black mb-2">
                 {product.name}
               </h3>
               <p className="text-3xl font-creata font-bold text-black mb-3">
                 {product.price}
               </p>
               <p className="text-muted-foreground text-[#8783AB] text-sm mb-6">
                 {product.description}
               </p>
               
               <ul className="space-y-2 mb-8 flex-1">
                 {product.items.map((item, iIndex) => (
                   <li key={iIndex} className="flex items-center gap-2 text-sm text-black">
                     <Zap className="w-3 h-3 text-[#E9164B]" />
                     {item}
                   </li>
                 ))}
               </ul>
               
               <Button className="w-full bg-[#E9164B] text-white hover:bg-muted group-hover:border-[#E9164B]/50 transition-all">
                 <ShoppingCart className="w-4 h-4 mr-2" />
                 View Details
               </Button>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };