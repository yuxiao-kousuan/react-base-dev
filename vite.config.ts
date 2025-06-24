import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { generateViteProxyConfig } from './src/config/proxy'

// 生成并打印代理配置
const proxyConfig = generateViteProxyConfig();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // 自动打开浏览器
    port: 3000, // 开发服务器端口
    host: true, // 允许外部访问
    // 代理配置
    proxy: proxyConfig
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src')
    }
  },
  // 构建配置
  build: {
    minify: 'terser', // 明确指定使用terser
    // 生产环境移除console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // 环境变量前缀
  envPrefix: 'REACT_APP_',
})
