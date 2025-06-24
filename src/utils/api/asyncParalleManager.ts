import _ from 'lodash';

const cloneDeep = _.cloneDeep;

/**
 * 异步请求状态枚举
 * 用于管理异步请求的生命周期状态
 */
const AsyncStatus = {
    INIT: 0,        // 初始状态：还未发起任何请求
    REQUESTING: 1,  // 请求中状态：正在进行网络请求
    SUCCESS: 2      // 成功状态：请求完成并有缓存数据
} as const;

/**
 * 异步状态类型定义
 */
type AsyncStatusType = typeof AsyncStatus[keyof typeof AsyncStatus];

/**
 * Promise池接口定义
 * 用于存储等待中的Promise的resolve和reject函数
 */
interface PromisePool<T> {
    resolve: (value: T) => void;    // Promise的成功回调
    reject: (reason?: any) => void; // Promise的失败回调
}

/**
 * 异步并行管理器
 * 
 * 【核心功能】
 * 无论何时同时发起多少个相同的异步请求，实际上只会执行一次真正的网络请求
 * 
 * 【解决问题】
 * 1. 防止重复请求：避免用户快速点击或组件多次渲染时发起重复的API请求
 * 2. 性能优化：减少不必要的网络请求，节省带宽和服务器资源
 * 3. 状态一致性：确保所有等待的请求都能获得相同的结果
 * 
 * 【工作原理】
 * 使用状态机模式管理请求生命周期：
 * - INIT(0) → REQUESTING(1) → SUCCESS(2)
 * - 在REQUESTING状态时，新的请求会被加入等待池
 * - 在SUCCESS状态时，直接返回缓存的数据
 * 
 * @template T 异步函数返回的数据类型
 * @param asyncFn 需要被管理的异步函数
 * @returns 返回包含fetch、refetch、get方法的管理器对象
 */
export default function asyncParallelManager<T = any>(asyncFn: (...args: any[]) => Promise<T>) {
    // 当前请求状态，初始为INIT状态
    let status: AsyncStatusType = AsyncStatus.INIT;

    // 缓存的数据，只有在SUCCESS状态时才有值
    let data: T | undefined;

    // 等待池：存储在REQUESTING状态时新来的请求的resolve和reject函数
    // 当第一个请求完成时，会统一处理池中的所有等待请求
    let pool: Array<[PromisePool<T>['resolve'], PromisePool<T>['reject']]> = [];

    /**
     * 智能请求方法
     * 
     * 【执行逻辑】
     * 1. 如果已有缓存数据(SUCCESS状态)，直接返回缓存的深拷贝
     * 2. 如果正在请求中(REQUESTING状态)，将当前请求加入等待池
     * 3. 如果是初始状态(INIT状态)，发起真正的网络请求
     * 
     * 【并发处理】
     * Promise可以控制多个入口的顺序，虽然async有直观的逻辑，
     * 但第一个入口只能是最后返回的。处理顺序如下：
     * 1→, 2→, ..., →1, →2, 3→, →3
     * 
     * @param args 传递给异步函数的参数
     * @returns Promise<T> 返回异步函数的结果
     */
    function fetch(...args: any[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            // 情况1：已有缓存数据，直接返回
            if (status === AsyncStatus.SUCCESS && data !== undefined) {
                // 使用深拷贝防止外部修改影响缓存数据
                // eslint-disable-next-line no-promise-executor-return
                return resolve(cloneDeep(data) as T);
            }

            // 情况2：正在请求中，加入等待池
            if (status === AsyncStatus.REQUESTING) {
                // 将当前请求的resolve和reject函数存入等待池
                // 当真正的请求完成时，会统一处理这些等待的请求
                // eslint-disable-next-line no-promise-executor-return
                return pool.push([resolve, reject]);
            }

            // 情况3：初始状态，发起真正的网络请求
            status = AsyncStatus.REQUESTING;

            asyncFn(...args)
                .then((_data: T) => {
                    // 请求成功处理
                    status = AsyncStatus.SUCCESS;
                    data = _data;

                    // 先处理当前请求
                    resolve(cloneDeep(data) as T);

                    // 再处理等待池中的所有请求，让它们都获得相同的结果
                    pool.forEach(([newResolve]) => newResolve(cloneDeep(data) as T));

                    // 清空等待池
                    pool = [];
                })
                .catch((err: any) => {
                    // 请求失败处理
                    status = AsyncStatus.INIT; // 重置为初始状态，允许重新请求

                    // 当前请求失败
                    reject(err);

                    // 等待池中的所有请求也都失败
                    pool.forEach(([, newReject]) => newReject(err));

                    // 清空等待池
                    pool = [];
                });
        });
    }

    /**
     * 强制重新请求方法
     * 
     * 【使用场景】
     * 当需要获取最新数据时使用，会绕过缓存直接发起新的请求
     * 
     * 【注意事项】
     * - 不会改变管理器的状态和缓存
     * - 每次调用都会发起新的网络请求
     * - 适用于需要强制刷新数据的场景
     * 
     * @param args 传递给异步函数的参数
     * @returns Promise<T> 返回异步函数的结果
     */
    function refetch(...args: any[]): Promise<T> {
        return asyncFn(...args)
            .then((data: T) => data)
            .catch((error: any) => Promise.reject(error));
    }

    /**
     * 获取缓存数据方法
     * 
     * 【功能说明】
     * 同步获取当前缓存的数据，不会发起网络请求
     * 
     * 【返回逻辑】
     * - 如果没有缓存数据且提供了默认值，返回默认值
     * - 如果有缓存数据，返回缓存数据的深拷贝
     * - 如果没有缓存数据且没有默认值，返回undefined
     * 
     * @param defaultValue 可选的默认值
     * @returns T | undefined 缓存的数据或默认值或undefined
     */
    function get(defaultValue?: T): T | undefined {
        return data === undefined && defaultValue !== undefined
            ? defaultValue
            : data !== undefined ? cloneDeep(data) : undefined;
    }

    // 返回管理器对象，包含三个核心方法
    return {
        fetch,    // 智能请求方法（会使用缓存）
        refetch,  // 强制重新请求方法（绕过缓存）
        get       // 获取缓存数据方法（同步获取）
    };
}

/**
 * 可取消异步请求管理器
 * 
 * 【核心功能】
 * 自动取消异步请求，根据key值判断是否取消之前的请求
 * 
 * 【解决问题】
 * 1. 竞态条件：避免用户快速操作时，后发的请求先返回导致显示错误结果
 * 2. 资源浪费：取消无效的请求，减少不必要的网络开销
 * 3. 内存泄漏：防止组件卸载后请求仍在处理导致的内存泄漏
 * 
 * 【使用场景】
 * - 搜索框：用户快速输入时，只需要最后一次搜索的结果
 * - 分页：用户快速翻页时，只需要最后一页的数据
 * - 数据刷新：避免重复刷新请求
 * 
 * 【实现原理】
 * 使用闭包维护一个取消缓存对象，每个key对应一个取消函数
 * 当发起新请求时，先执行同key的旧请求的取消函数
 */
export const makeCancelable = (() => {
    // 取消函数缓存：key -> cancelFunction
    // 每个key对应一个取消函数，用于取消该key对应的请求
    const cancelCache: Record<string, () => void> = {};

    /**
     * 创建可取消的Promise
     * 
     * @template T Promise返回的数据类型
     * @param promise 需要被包装的Promise
     * @param key 唯一标识符，相同key的新请求会取消旧请求
     * @returns Promise<T> 返回包装后的可取消Promise
     */
    return <T>(promise: Promise<T>, key: string): Promise<T> => {
        // 如果该key已存在取消函数，先执行取消操作
        if (cancelCache[key]) {
            cancelCache[key]();
        }

        // 取消标志位：用于标记该请求是否已被取消
        let hasCanceled = false;

        // 创建包装后的Promise
        const wrappedPromise = new Promise<T>((resolve, reject) => {
            promise
                .then((val: T) => {
                    // 只有在未被取消的情况下才处理成功结果
                    if (!hasCanceled) {
                        resolve(val);
                    }
                    // 如果已被取消，则忽略结果，不做任何处理
                })
                .catch((error: any) => {
                    // 只有在未被取消的情况下才处理错误结果
                    if (!hasCanceled) {
                        reject(error);
                    }
                    // 如果已被取消，则忽略错误，不做任何处理
                });
        });

        // 为当前key设置取消函数
        // 当下次有相同key的请求时，会调用这个函数来取消当前请求
        cancelCache[key] = () => {
            hasCanceled = true;
        };

        return wrappedPromise;
    };
})();