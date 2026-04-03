import { motion } from 'framer-motion';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <motion.div
      className={`${dims} relative flex-shrink-0`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="32" height="32" rx="2" fill="#000" />
        <rect x="1" y="1" width="30" height="30" rx="1" fill="none" stroke="#76b900" strokeWidth="1.5" />
        <motion.path
          d="M8 22V12l4 3v-5l4 3v-3l4 3v-3l4 5v8H8z"
          fill="#76b900"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M8 22V15l4 2.5v-4l4 2.5v-2l4 2.5v-2l4 4v5.5H8z" fill="#bff230" opacity="0.35" />
      </svg>
    </motion.div>
  );
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <Logo size="md" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-[16px] font-bold tracking-tight text-white">CAN I RUN</span>
        <span className="text-[16px] font-bold tracking-tight text-nv-green">LLM</span>
        <span className="text-[16px] font-bold tracking-tight text-nv-gray-500">?</span>
      </div>
    </div>
  );
}
