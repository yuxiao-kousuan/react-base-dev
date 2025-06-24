/**
 * 代理配置管理
 * 用于不同环境下的API请求代理转发
 */

/**
 * 环境类型定义
 */
export type Environment = 'development' | 'production';

/**
 * 代理规则配置接口
 */
export interface ProxyRule {
    /** 匹配的路径前缀 */
    pathPattern: string;
    /** 目标服务器地址 */
    target: string;
    /** 是否改变请求源 */
    changeOrigin?: boolean;
    /** 是否重写路径 */
    pathRewrite?: Record<string, string>;
    /** 描述信息 */
    description: string;
    /** 是否启用HTTPS */
    secure?: boolean;
    /** 自定义请求头 */
    headers?: Record<string, string>;
}

/**
 * 环境配置接口
 */
export interface EnvironmentConfig {
    /** 环境名称 */
    name: string;
    /** 环境描述 */
    description: string;
    /** 代理规则列表 */
    proxyRules: ProxyRule[];
}

/**
 * 代理配置映射
 */
export const PROXY_CONFIGS: Record<Environment, EnvironmentConfig> = {
    // 开发环境配置
    development: {
        name: 'Development',
        description: '本地开发环境',
        proxyRules: [
            {
                pathPattern: '/apifox/mock',
                target: 'https://m1.apifoxmock.com/m1/6595783-6301451-default',
                changeOrigin: true,
                // 移除路径重写，保持完整路径
                description: 'Apifox Mock API代理',
                secure: true,
                headers: {
                    'User-Agent': 'React-App-Dev'
                }
            }
        ]
    },

    // 生产环境配置
    production: {
        name: 'Production',
        description: '生产环境',
        proxyRules: [
            {
                pathPattern: '/api',
                target: 'https://api.example.com',
                changeOrigin: true,
                description: '生产环境API服务器',
                secure: true,
                headers: {
                    'X-Environment': 'production'
                }
            }
        ]
    }
};

/**
 * 获取当前环境
 */
export const getCurrentEnvironment = (): Environment => {
    return (process.env.NODE_ENV as Environment) || 'development';
};

/**
 * 生成Vite代理配置
 */
export const generateViteProxyConfig = (env: Environment = getCurrentEnvironment()) => {
    const config = PROXY_CONFIGS[env];
    const proxyConfig: Record<string, any> = {};

    config.proxyRules.forEach(rule => {
        proxyConfig[rule.pathPattern] = {
            target: rule.target,
            changeOrigin: rule.changeOrigin ?? true,
            secure: rule.secure ?? true,
            rewrite: rule.pathRewrite ? (path: string) => {
                let newPath = path;
                Object.entries(rule.pathRewrite!).forEach(([pattern, replacement]) => {
                    newPath = newPath.replace(new RegExp(pattern), replacement);
                });
                return newPath;
            } : undefined,
            configure: rule.headers ? (proxy: any) => {
                proxy.on('proxyReq', (proxyReq: any) => {
                    Object.entries(rule.headers!).forEach(([key, value]) => {
                        proxyReq.setHeader(key, value);
                    });
                });
            } : undefined
        };
    });

    return proxyConfig;
};