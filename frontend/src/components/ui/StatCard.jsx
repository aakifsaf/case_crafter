import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon, description }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-gray-900/30 via-gray-800/40 to-gray-900/30 border border-white/10 shadow-2xl"
      style={{
        backgroundImage: isHovered 
          ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(59, 130, 246, 0.25), inset 0 1px 0 0 rgba(255,255,255,0.1)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255,255,255,0.05)'
      }}
    >
      {/* Animated glow effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        animate={{
          opacity: isHovered ? [0.3, 0.5, 0.3] : 0.1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main content */}
      <div className="relative p-6">
        <div className="flex items-start">
          <motion.div 
            className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ rotate: isHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="text-2xl text-blue-400"
            >
              {icon}
            </motion.div>
          </motion.div>
          
          <div className="ml-5 flex-1 min-w-0">
            <motion.dl>
              <motion.dt 
                className="text-sm font-medium text-gray-300/80 truncate uppercase tracking-wider"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.dt>
              <motion.dd 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                {value}
              </motion.dd>
            </motion.dl>
          </div>
        </div>
      </div>
      
      {description && (
        <motion.div 
          className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 px-6 py-4 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-gray-300/70">
            {description}
          </div>
        </motion.div>
      )}
      
      {/* Subtle particles effect */}
      {isHovered && (
        <>
          <motion.div 
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -20],
              x: [0, 10]
            }}
            transition={{ duration: 1.5 }}
            style={{ top: '20%', left: '30%' }}
          />
          <motion.div 
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -15],
              x: [0, -8]
            }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ top: '60%', left: '80%' }}
          />
        </>
      )}
    </motion.div>
  );
};