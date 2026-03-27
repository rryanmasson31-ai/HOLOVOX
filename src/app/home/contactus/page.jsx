"use client";
import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1835] text-white px-6 py-10">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-white/60 mt-2">
          We’d love to hear from you. Reach out anytime!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        
        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-6">
          
          {/* Contact Info Cards */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
            <Mail className="text-[#E9164B]" />
            <div>
              <p className="text-sm text-white/60">Email</p>
              <p className="font-medium">support@360meet.com</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
            <Phone className="text-[#E9164B]" />
            <div>
              <p className="text-sm text-white/60">Phone</p>
              <p className="font-medium">+92 300 1234567</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
            <MapPin className="text-[#E9164B]" />
            <div>
              <p className="text-sm text-white/60">Location</p>
              <p className="font-medium">Karachi, Pakistan</p>
            </div>
          </div>

          {/* Extra Info */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="font-semibold mb-2">Support Hours</h3>
            <p className="text-sm text-white/60">
              Monday - Friday: 9AM - 6PM <br />
              Saturday: 10AM - 4PM
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE (FORM) ================= */}
        <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
          
          <h2 className="text-xl font-semibold mb-6">
            Send us a message
          </h2>

          <form className="space-y-4">
            
            {/* Name */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none focus:border-[#E9164B]"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none focus:border-[#E9164B]"
            />

            {/* Subject */}
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none focus:border-[#E9164B]"
            />

            {/* Message */}
            <textarea
              rows="5"
              placeholder="Your Message..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none focus:border-[#E9164B]"
            />

            {/* Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#E9164B] hover:bg-[#c91442] transition px-6 py-3 rounded-lg font-medium"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;