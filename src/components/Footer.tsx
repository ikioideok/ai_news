import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    services: [
      { label: 'SEO支援', href: '#service' },
      { label: '広告運用最適化', href: '#service' },
      { label: 'SNSマーケティング', href: '#service' },
      { label: 'コンサルティング', href: '#service' },
      { label: 'AI導入支援', href: '#service' },
      { label: 'マーケティング自動化', href: '#service' },
    ],
    company: [
      { label: '会社概要', href: '#about' },
      { label: '採用情報', href: '#contact' },
    ],
  };

  // Social links removed per request

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Red accent line */}
      <motion.div
        className="h-1 bg-red-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6"
            >
              <h3 className="text-4xl font-black tracking-tighter">
                AI<span className="text-red-500">MA</span>
              </h3>
              <motion.div
                className="w-12 h-1 bg-red-500 mt-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>

            <p className="text-gray-300 leading-relaxed font-light mb-8">
              人手不足の時代に、AIで企業を支える。<br />
              株式会社AIMAは日本の未来のために、AIを活用して企業の課題を解決し、成長を加速させていきます。
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xl font-bold mb-6 tracking-tight">
              サービス
              <motion.div
                className="w-8 h-1 bg-red-500 mt-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300 font-light text-sm block"
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company (Details) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-bold mb-6 tracking-tight">
              会社情報
              <motion.div
                className="w-8 h-1 bg-red-500 mt-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <span className="font-semibold text-white">会社名</span>
                <div>株式会社AIMA (AIMA Inc.)</div>
              </div>
              <div>
                <span className="font-semibold text-white">所在地</span>
                <div>大阪府大阪市北区梅田一丁目2番2号　大阪駅前第2ビル2階5-6号室</div>
              </div>
              <div>
                <span className="font-semibold text-white">設立</span>
                <div>2018年</div>
              </div>
              <div>
                <span className="font-semibold text-white">事業内容</span>
                <div>AIマーケティング、AI関連メディア運営</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Newsletter removed */}

        {/* Bottom copyright only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="text-center">
            <p className="text-gray-500 text-sm font-light">© 2024 AIMA. All rights reserved.</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 bg-red-500 opacity-10"
        initial={{ scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="absolute top-1/2 left-0 w-16 h-16 bg-white opacity-5"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
    </footer>
  );
}
