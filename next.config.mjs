import createNextIntlPlugin from "next-intl/plugin";

// next-intl 通过 plugin 注入 messages 加载;无 URL 前缀,locale 走 cookie
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
