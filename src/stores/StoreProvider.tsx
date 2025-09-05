import React, { createContext, ReactNode } from 'react';
import { stores, Stores } from './index';

// 创建Context
const StoreContext = createContext<Stores>(stores);

// Provider组件
interface StoreProviderProps {
    children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    return (
        <StoreContext.Provider value={stores}>
            {children}
        </StoreContext.Provider>
    );
};

// 导出Context供inject使用
export { StoreContext };