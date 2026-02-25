import { useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { motion } from 'motion/react';

interface SplashScreenProps {
  isDark: boolean;
  onComplete: () => void;
}

export function SplashScreen({ isDark, onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-[#0D1B1A] via-[#1A2C2B] to-[#0D1B1A]'
          : 'bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950'
      }`}
      style={{ fontFamily: "'Noto Sans Arabic', sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1561865406-62a037159577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwZ2VvbWV0cmljJTIwcGF0dGVybnxlbnwxfHx8fDE3Njg3MDAzODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Islamic pattern"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <div className={`w-32 h-32 mx-auto rounded-3xl ${
            isDark 
              ? 'bg-gradient-to-br from-[#377764] to-[#144E2C]' 
              : 'bg-gradient-to-br from-[#144E2C] to-[#10B981]'
          } p-6 shadow-2xl`}>
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1720549973451-018d3623b55a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYWFiYSUyMG1lY2NhfGVufDF8fHx8MTc2ODY1OTIzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Holy Shrine"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`text-4xl mb-3 ${
            isDark ? 'text-white' : 'text-white'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}
        >
          نور المعرفة
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`text-lg mb-8 ${
            isDark ? 'text-[#9AA8A8]' : 'text-emerald-100'
          }`}
        >
          اختبر معلوماتك في التراث الإسلامي الشيعي
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${
                isDark ? 'bg-[#377764]' : 'bg-[#144E2C]'
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}