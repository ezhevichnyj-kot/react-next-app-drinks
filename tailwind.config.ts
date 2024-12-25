import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        banana: 'var(--banana)',
        ice: 'var(--ice)',
        yogurt: 'var(--yogurt)',
        'black-glass': 'var(--black-glass)',
      },
      height: {
        card: '350px',
      },
      width: {
        'content-main': '1000px',
      },
    },
  },
  plugins: [],
} satisfies Config;
