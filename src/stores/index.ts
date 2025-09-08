import { fisrtToLowercase } from '@src/utils/tools';
import { AppStore } from './AppStore';
import { WelcomePageStore } from './WelcomePageStore';

interface Stores {
    appStore: AppStore;
    welcomePageStore: WelcomePageStore;
}

const stores: Stores = {} as Stores;

// 使用Vite的import.meta.glob替代require.context
const modules = import.meta.glob('./*Store.{js,ts}', { eager: true });

Object.keys(modules).forEach((path) => {
    const match = path.match(/\/([a-zA-Z]*)\.(js|ts)$/);
    if (match && match.length >= 1) {
        const storeName = fisrtToLowercase(match[1]) as keyof Stores;
        const module = modules[path] as any;
        stores[storeName] = module.default || module;
    }
});

export default stores;
