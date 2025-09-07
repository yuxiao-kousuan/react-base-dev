import { fisrtToLowercase } from '@src/utils/tools';

const stores: { [key: string]: any } = {};

// 使用Vite的import.meta.glob替代require.context
const modules = import.meta.glob('./*Store.{js,ts}', { eager: true });

Object.keys(modules).forEach((path) => {
    const match = path.match(/\/([a-zA-Z]*)\.(js|ts)$/);
    if (match && match.length >= 1) {
        const storeName = fisrtToLowercase(match[1]);
        const module = modules[path] as any;
        stores[storeName] = module.default || module;
    }
});

export default stores;
