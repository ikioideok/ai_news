import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Quote } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Faster, more stylish animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.4,
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5,
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5,
      },
    },
  };

  // Values section removed per request

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl mb-4 font-black text-black tracking-tighter"
          >
            ABOUT
            <motion.span 
              className="text-red-500"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 500 }}
            >
              .
            </motion.span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-red-500 mx-auto"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideInLeft}
            className="space-y-8"
          >
            {/* CEO Message */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-red-500 rounded-full"
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              />
              <h3
                className="text-4xl md:text-5xl font-black text-black tracking-tight mb-6"
                style={{ fontFamily: '"Noto Sans JP", ui-sans-serif, system-ui, sans-serif' }}
              >
                AIで解決する
                <br />
                企業の<span className="text-red-500">マーケティング課題</span>
              </h3>
              {/* Elegant animated description under the heading */}
              <motion.div
                variants={containerVariants}
                className="mt-4 md:mt-6 space-y-3 md:space-y-4"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-base md:text-lg text-gray-700 leading-relaxed font-light"
                  style={{ fontFamily: '"Noto Sans JP", ui-sans-serif, system-ui, sans-serif' }}
                >
                  人手不足の時代に、AIで企業を支える。
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="text-base md:text-lg text-gray-700 leading-relaxed font-light"
                  style={{ fontFamily: '"Noto Sans JP", ui-sans-serif, system-ui, sans-serif' }}
                >
                  株式会社AIMAは日本の未来のために、AIを活用して企業の課題を解決し、成長を加速させていきます。
                </motion.p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-50 p-8 relative overflow-hidden"
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-red-500"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              />
              <Quote className="h-8 w-8 text-red-500 mb-4" />
              <blockquote className="text-sm md:text-base text-gray-700 leading-relaxed font-light italic mb-6">
                今、日本は深刻な人手不足に陥っています。国力は年々低下。この流れは、今後、さらに加速していくでしょう。<br />
                私はこの現状に危機感を覚え、日本の企業が持つ文化や精神、技術などをAIで守り、さらに加速させていきたいと考えています。<br />
                どのようなことでも構いませんので、ぜひ一度、お気軽にご相談ください。
              </blockquote>
              <div className="flex items-center">
                <div className="w-1 h-12 bg-red-500 mr-4" />
                <div>
                  <p className="font-bold text-black">水間 雄紀</p>
                  <p className="text-sm text-gray-500">代表取締役CEO</p>
                </div>
              </div>
            </motion.div>

            {/* Company Values section removed */}
          </motion.div>

          {/* Right Side - CEO Image */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideInRight}
            className="relative"
          >
            <motion.div
              className="relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-24 h-24 bg-red-500 z-10"
                initial={{ scale: 0, rotate: 45 }}
                animate={isInView ? { scale: 1, rotate: 45 } : { scale: 0, rotate: 45 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-black z-10"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 300 }}
              />
              
              {/* CEO Image */}
              <motion.div
                className="relative z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <ImageWithFallback
                  src="/images/ceo.png"
                  alt="AIMA CEO 水間 雄紀"
                  className="w-full h-[600px] object-cover transition-all duration-500"
                />
                
                
              </motion.div>
            </motion.div>

            {/* Background pattern */}
            <motion.div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
                backgroundSize: '30px 30px',
              }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
