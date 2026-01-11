import React from 'react';
import { Mail, Instagram, MessageCircle, ExternalLink } from 'lucide-react';

const Contacto: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 animate-[centerExpand_0.6s_ease-out_forwards] max-w-4xl mx-auto items-center justify-center min-h-[60vh]">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(13,242,242,0.5)] mb-4">
          Contáctame
        </h2>
        <p className="text-white/70 max-w-md mx-auto leading-relaxed">
          ¿Tienes algún proyecto en mente o simplemente quieres saludar? 
          Estoy disponible para colaboraciones y nuevos desafíos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Email Card */}
        <a 
          href="mailto:hugojaque@gmail.com" 
          className="group flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(13,242,242,0.15)] transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail className="text-primary w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Correo Electrónico</h3>
          <span className="text-white/60 text-sm group-hover:text-primary transition-colors">hugojaque@gmail.com</span>
        </a>

        {/* Instagram Card */}
        <a 
          href="https://www.instagram.com/degollenme/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Instagram className="text-pink-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Instagram</h3>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm group-hover:text-pink-400 transition-colors">@degollenme</span>
            <ExternalLink size={12} className="text-white/40" />
          </div>
        </a>

        {/* WhatsApp Card (Optional) */}
        <a 
          href="https://wa.me/56912345678" // Replace with real number if available
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 md:col-span-2"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="text-green-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
          <span className="text-white/60 text-sm group-hover:text-green-400 transition-colors">Enviar mensaje directo</span>
        </a>

      </div>
    </div>
  );
};

export default Contacto;
