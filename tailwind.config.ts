import type { Config } from "tailwindcss";

// 关键: preflight 关掉,只生成 utility 类,避免 reset 影响其它已用 vanilla CSS 的页面
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Sugardating 黑金 feed 主题(只在 /photography 用)
        feed: {
          bg:       "#0a0a0c",     // 页面底色
          surface:  "rgba(255,255,255,0.04)",
          elevated: "rgba(255,255,255,0.07)",
          line:     "rgba(255,255,255,0.08)",
          line2:    "rgba(255,255,255,0.14)",
          ink:      "#F2F2F4",
          mute:     "#A7A7AE",
          dim:      "#6B6B72",
        },
        gold: {
          DEFAULT: "#B8A789",   // 沿用站点 --accent,温润金调
          bright:  "#D4BF95",
          glow:    "rgba(184,167,137,0.18)",
        },
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      fontFamily: {
        ui:    ['"Plus Jakarta Sans"', '"Noto Sans SC"', "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
      },
      maxWidth: {
        feed: "640px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.2,.7,.2,1)",
      },
    },
  },
};

export default config;
