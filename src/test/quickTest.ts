/**
 * 快速代理测试脚本
 */

import { get } from '@src/api/axiosWarpInstance';

// 测试修复后的代理配置
export const quickProxyTest = async () => {
    console.log('\n🧪 快速代理测试开始...\n');

    try {
        console.log('1️⃣ 测试代理路径: /apifox/mock/test');
        console.log('   期望代理到: https://m1.apifoxmock.com/m1/6595783-6301451-default/apifox/mock/test');

        const response = await get(
            '/apifox/mock/test',
            { apifoxToken: 'IlGWRhhZetq0ok6Z9HaUz' },
            {
                timeout: 10000,
                showLoading: false
            }
        );

        console.log('✅ 代理测试成功！');
        console.log('📦 响应数据:', response.data);

        if (response.data && response.data.userId && response.data.name) {
            console.log('🎉 Mock API 代理配置修复成功！');
            console.log(`👤 用户信息: ${response.data.name} (ID: ${response.data.userId})`);
            return { success: true, data: response.data };
        } else {
            console.log('⚠️  响应数据格式异常:', response.data);
            return { success: false, error: 'Unexpected response format' };
        }

    } catch (error) {
        console.log('❌ 代理测试失败');
        console.error('错误详情:', error);

        if (error instanceof Error) {
            if (error.message.includes('404')) {
                console.log('💡 可能原因: API路径不正确');
            } else if (error.message.includes('CORS')) {
                console.log('💡 可能原因: 跨域问题，代理未生效');
            } else if (error.message.includes('timeout')) {
                console.log('💡 可能原因: 请求超时，网络问题');
            } else {
                console.log('💡 建议: 检查代理配置和网络连接');
            }
        }

        return { success: false, error };
    }
};

// 导出给UI调用
export default quickProxyTest; 