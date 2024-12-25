import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

nextConfig.webpack = (config, context) => {
  config.module.rules.push({
    test: /\.svg$/,
    use: "@svgr/webpack",
  });
  return config;
};

module.exports = nextConfig;