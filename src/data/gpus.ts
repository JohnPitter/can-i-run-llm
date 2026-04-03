export interface GPU {
  id: string;
  name: string;
  brand: 'NVIDIA' | 'AMD' | 'Intel' | 'Apple';
  vramGB: number;
  bandwidthGBs: number;
  tier: 'entry' | 'mid' | 'high' | 'enthusiast' | 'professional';
}

export const KNOWN_GPUS: GPU[] = [
  // NVIDIA RTX 30 series
  { id: 'rtx-3050-8gb', name: 'RTX 3050 8GB', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 224, tier: 'entry' },
  { id: 'rtx-3060-12gb', name: 'RTX 3060 12GB', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 360, tier: 'mid' },
  { id: 'rtx-3060ti', name: 'RTX 3060 Ti', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 448, tier: 'mid' },
  { id: 'rtx-3070', name: 'RTX 3070', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 448, tier: 'mid' },
  { id: 'rtx-3070ti', name: 'RTX 3070 Ti', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 608, tier: 'mid' },
  { id: 'rtx-3080-10gb', name: 'RTX 3080 10GB', brand: 'NVIDIA', vramGB: 10, bandwidthGBs: 760, tier: 'high' },
  { id: 'rtx-3080-12gb', name: 'RTX 3080 12GB', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 912, tier: 'high' },
  { id: 'rtx-3080ti', name: 'RTX 3080 Ti', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 912, tier: 'high' },
  { id: 'rtx-3090', name: 'RTX 3090', brand: 'NVIDIA', vramGB: 24, bandwidthGBs: 936, tier: 'enthusiast' },
  { id: 'rtx-3090ti', name: 'RTX 3090 Ti', brand: 'NVIDIA', vramGB: 24, bandwidthGBs: 1008, tier: 'enthusiast' },

  // NVIDIA RTX 40 series
  { id: 'rtx-4060', name: 'RTX 4060', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 272, tier: 'entry' },
  { id: 'rtx-4060ti-8gb', name: 'RTX 4060 Ti 8GB', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 288, tier: 'mid' },
  { id: 'rtx-4060ti-16gb', name: 'RTX 4060 Ti 16GB', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 288, tier: 'mid' },
  { id: 'rtx-4070', name: 'RTX 4070', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 504, tier: 'mid' },
  { id: 'rtx-4070-super', name: 'RTX 4070 Super', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 504, tier: 'mid' },
  { id: 'rtx-4070ti', name: 'RTX 4070 Ti', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 504, tier: 'high' },
  { id: 'rtx-4070ti-super', name: 'RTX 4070 Ti Super', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 672, tier: 'high' },
  { id: 'rtx-4080', name: 'RTX 4080', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 717, tier: 'high' },
  { id: 'rtx-4080-super', name: 'RTX 4080 Super', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 736, tier: 'high' },
  { id: 'rtx-4090', name: 'RTX 4090', brand: 'NVIDIA', vramGB: 24, bandwidthGBs: 1008, tier: 'enthusiast' },

  // NVIDIA RTX 50 series
  { id: 'rtx-5060', name: 'RTX 5060', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 320, tier: 'entry' },
  { id: 'rtx-5060ti-8gb', name: 'RTX 5060 Ti 8GB', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 448, tier: 'mid' },
  { id: 'rtx-5060ti-16gb', name: 'RTX 5060 Ti 16GB', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 448, tier: 'mid' },
  { id: 'rtx-5070', name: 'RTX 5070', brand: 'NVIDIA', vramGB: 12, bandwidthGBs: 672, tier: 'mid' },
  { id: 'rtx-5070ti', name: 'RTX 5070 Ti', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 896, tier: 'high' },
  { id: 'rtx-5080', name: 'RTX 5080', brand: 'NVIDIA', vramGB: 16, bandwidthGBs: 960, tier: 'high' },
  { id: 'rtx-5090', name: 'RTX 5090', brand: 'NVIDIA', vramGB: 32, bandwidthGBs: 1792, tier: 'enthusiast' },

  // NVIDIA professional
  { id: 'a100-40gb', name: 'A100 40GB', brand: 'NVIDIA', vramGB: 40, bandwidthGBs: 1555, tier: 'professional' },
  { id: 'a100-80gb', name: 'A100 80GB', brand: 'NVIDIA', vramGB: 80, bandwidthGBs: 2039, tier: 'professional' },
  { id: 'h100-80gb', name: 'H100 80GB', brand: 'NVIDIA', vramGB: 80, bandwidthGBs: 3350, tier: 'professional' },
  { id: 'tesla-p40', name: 'Tesla P40', brand: 'NVIDIA', vramGB: 24, bandwidthGBs: 346, tier: 'professional' },

  // NVIDIA GTX (still used)
  { id: 'gtx-1060-6gb', name: 'GTX 1060 6GB', brand: 'NVIDIA', vramGB: 6, bandwidthGBs: 192, tier: 'entry' },
  { id: 'gtx-1070', name: 'GTX 1070', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 256, tier: 'entry' },
  { id: 'gtx-1080', name: 'GTX 1080', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 320, tier: 'mid' },
  { id: 'gtx-1080ti', name: 'GTX 1080 Ti', brand: 'NVIDIA', vramGB: 11, bandwidthGBs: 484, tier: 'mid' },
  { id: 'rtx-2060', name: 'RTX 2060', brand: 'NVIDIA', vramGB: 6, bandwidthGBs: 336, tier: 'entry' },
  { id: 'rtx-2070', name: 'RTX 2070', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 448, tier: 'mid' },
  { id: 'rtx-2080', name: 'RTX 2080', brand: 'NVIDIA', vramGB: 8, bandwidthGBs: 448, tier: 'mid' },
  { id: 'rtx-2080ti', name: 'RTX 2080 Ti', brand: 'NVIDIA', vramGB: 11, bandwidthGBs: 616, tier: 'high' },

  // AMD
  { id: 'rx-6700xt', name: 'RX 6700 XT', brand: 'AMD', vramGB: 12, bandwidthGBs: 384, tier: 'mid' },
  { id: 'rx-6800', name: 'RX 6800', brand: 'AMD', vramGB: 16, bandwidthGBs: 512, tier: 'high' },
  { id: 'rx-6800xt', name: 'RX 6800 XT', brand: 'AMD', vramGB: 16, bandwidthGBs: 512, tier: 'high' },
  { id: 'rx-6900xt', name: 'RX 6900 XT', brand: 'AMD', vramGB: 16, bandwidthGBs: 512, tier: 'enthusiast' },
  { id: 'rx-7600', name: 'RX 7600', brand: 'AMD', vramGB: 8, bandwidthGBs: 288, tier: 'entry' },
  { id: 'rx-7700xt', name: 'RX 7700 XT', brand: 'AMD', vramGB: 12, bandwidthGBs: 432, tier: 'mid' },
  { id: 'rx-7800xt', name: 'RX 7800 XT', brand: 'AMD', vramGB: 16, bandwidthGBs: 624, tier: 'high' },
  { id: 'rx-7900xt', name: 'RX 7900 XT', brand: 'AMD', vramGB: 20, bandwidthGBs: 800, tier: 'enthusiast' },
  { id: 'rx-7900xtx', name: 'RX 7900 XTX', brand: 'AMD', vramGB: 24, bandwidthGBs: 960, tier: 'enthusiast' },
  { id: 'rx-9070xt', name: 'RX 9070 XT', brand: 'AMD', vramGB: 16, bandwidthGBs: 650, tier: 'high' },

  // Intel Arc
  { id: 'arc-a770', name: 'Arc A770 16GB', brand: 'Intel', vramGB: 16, bandwidthGBs: 560, tier: 'mid' },
  { id: 'arc-b580', name: 'Arc B580', brand: 'Intel', vramGB: 12, bandwidthGBs: 456, tier: 'mid' },

  // Apple Silicon (unified memory — treated as both RAM and VRAM)
  { id: 'm1-8gb', name: 'M1 8GB', brand: 'Apple', vramGB: 8, bandwidthGBs: 68, tier: 'entry' },
  { id: 'm1-16gb', name: 'M1 16GB', brand: 'Apple', vramGB: 16, bandwidthGBs: 68, tier: 'mid' },
  { id: 'm1-pro-16gb', name: 'M1 Pro 16GB', brand: 'Apple', vramGB: 16, bandwidthGBs: 200, tier: 'mid' },
  { id: 'm1-pro-32gb', name: 'M1 Pro 32GB', brand: 'Apple', vramGB: 32, bandwidthGBs: 200, tier: 'high' },
  { id: 'm1-max-32gb', name: 'M1 Max 32GB', brand: 'Apple', vramGB: 32, bandwidthGBs: 400, tier: 'high' },
  { id: 'm1-max-64gb', name: 'M1 Max 64GB', brand: 'Apple', vramGB: 64, bandwidthGBs: 400, tier: 'enthusiast' },
  { id: 'm1-ultra-128gb', name: 'M1 Ultra 128GB', brand: 'Apple', vramGB: 128, bandwidthGBs: 800, tier: 'professional' },
  { id: 'm2-8gb', name: 'M2 8GB', brand: 'Apple', vramGB: 8, bandwidthGBs: 100, tier: 'entry' },
  { id: 'm2-16gb', name: 'M2 16GB', brand: 'Apple', vramGB: 16, bandwidthGBs: 100, tier: 'mid' },
  { id: 'm2-24gb', name: 'M2 24GB', brand: 'Apple', vramGB: 24, bandwidthGBs: 100, tier: 'mid' },
  { id: 'm2-pro-16gb', name: 'M2 Pro 16GB', brand: 'Apple', vramGB: 16, bandwidthGBs: 200, tier: 'mid' },
  { id: 'm2-pro-32gb', name: 'M2 Pro 32GB', brand: 'Apple', vramGB: 32, bandwidthGBs: 200, tier: 'high' },
  { id: 'm2-max-32gb', name: 'M2 Max 32GB', brand: 'Apple', vramGB: 32, bandwidthGBs: 400, tier: 'high' },
  { id: 'm2-max-64gb', name: 'M2 Max 64GB', brand: 'Apple', vramGB: 64, bandwidthGBs: 400, tier: 'enthusiast' },
  { id: 'm2-max-96gb', name: 'M2 Max 96GB', brand: 'Apple', vramGB: 96, bandwidthGBs: 400, tier: 'enthusiast' },
  { id: 'm2-ultra-192gb', name: 'M2 Ultra 192GB', brand: 'Apple', vramGB: 192, bandwidthGBs: 800, tier: 'professional' },
  { id: 'm3-8gb', name: 'M3 8GB', brand: 'Apple', vramGB: 8, bandwidthGBs: 100, tier: 'entry' },
  { id: 'm3-16gb', name: 'M3 16GB', brand: 'Apple', vramGB: 16, bandwidthGBs: 100, tier: 'mid' },
  { id: 'm3-24gb', name: 'M3 24GB', brand: 'Apple', vramGB: 24, bandwidthGBs: 100, tier: 'mid' },
  { id: 'm3-pro-18gb', name: 'M3 Pro 18GB', brand: 'Apple', vramGB: 18, bandwidthGBs: 150, tier: 'mid' },
  { id: 'm3-pro-36gb', name: 'M3 Pro 36GB', brand: 'Apple', vramGB: 36, bandwidthGBs: 150, tier: 'high' },
  { id: 'm3-max-36gb', name: 'M3 Max 36GB', brand: 'Apple', vramGB: 36, bandwidthGBs: 400, tier: 'high' },
  { id: 'm3-max-48gb', name: 'M3 Max 48GB', brand: 'Apple', vramGB: 48, bandwidthGBs: 400, tier: 'enthusiast' },
  { id: 'm3-max-64gb', name: 'M3 Max 64GB', brand: 'Apple', vramGB: 64, bandwidthGBs: 400, tier: 'enthusiast' },
  { id: 'm3-max-128gb', name: 'M3 Max 128GB', brand: 'Apple', vramGB: 128, bandwidthGBs: 400, tier: 'professional' },
  { id: 'm4-16gb', name: 'M4 16GB', brand: 'Apple', vramGB: 16, bandwidthGBs: 120, tier: 'mid' },
  { id: 'm4-24gb', name: 'M4 24GB', brand: 'Apple', vramGB: 24, bandwidthGBs: 120, tier: 'mid' },
  { id: 'm4-32gb', name: 'M4 32GB', brand: 'Apple', vramGB: 32, bandwidthGBs: 120, tier: 'mid' },
  { id: 'm4-pro-24gb', name: 'M4 Pro 24GB', brand: 'Apple', vramGB: 24, bandwidthGBs: 273, tier: 'high' },
  { id: 'm4-pro-48gb', name: 'M4 Pro 48GB', brand: 'Apple', vramGB: 48, bandwidthGBs: 273, tier: 'enthusiast' },
  { id: 'm4-max-36gb', name: 'M4 Max 36GB', brand: 'Apple', vramGB: 36, bandwidthGBs: 546, tier: 'high' },
  { id: 'm4-max-48gb', name: 'M4 Max 48GB', brand: 'Apple', vramGB: 48, bandwidthGBs: 546, tier: 'enthusiast' },
  { id: 'm4-max-64gb', name: 'M4 Max 64GB', brand: 'Apple', vramGB: 64, bandwidthGBs: 546, tier: 'enthusiast' },
  { id: 'm4-max-128gb', name: 'M4 Max 128GB', brand: 'Apple', vramGB: 128, bandwidthGBs: 546, tier: 'professional' },
];
