// pages/api/dogs.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function handler(req, res) {
  const proxy = createProxyMiddleware({
    target: 'https://frontend-take-home-service.fetch.com', // Target external API
    changeOrigin: true,
    pathRewrite: {
      '^/api/dogs': '', // Remove /api/dogs from the URL
    },
  });

  return proxy(req, res);
}
