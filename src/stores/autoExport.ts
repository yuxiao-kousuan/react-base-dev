/**
 * 自动导出store实例的工具函数
 * 通过扫描stores目录下的所有Store类，自动创建实例并导出
 */

// 导入所有Store类
import { AppStore } from './AppStore';
import { WelcomePageStore } from './WelcomePageStore';
import { UserStore } from './UserStore';

// Store类映射 - 这里可以添加新的Store类
const storeClasses = {
  AppStore,
  WelcomePageStore,
  UserStore,
  // 添加新的Store类时，只需要在这里添加即可
  // ProductStore,
  // OrderStore,
};

// 自动创建store实例
const createStoreInstances = () => {
  const instances: Record<string, any> = {};
  
  Object.entries(storeClasses).forEach(([className, StoreClass]) => {
    // 将类名转换为实例名（首字母小写）
    const instanceName = className.charAt(0).toLowerCase() + className.slice(1);
    instances[instanceName] = new StoreClass();
  });
  
  return instances;
};

// 创建所有store实例
export const stores = createStoreInstances();

// 导出类型
export type Stores = typeof stores;

// 导出所有store实例
export const {
  appStore,
  welcomePageStore,
  userStore,
} = stores;

// 导出所有Store类（用于类型定义）
export { AppStore, WelcomePageStore, UserStore };

// 导出工具函数，用于添加新的Store
export const addStore = (className: string, StoreClass: any) => {
  const instanceName = className.charAt(0).toLowerCase() + className.slice(1);
  stores[instanceName] = new StoreClass();
  return stores;
};