/**
 * 代理调试脚本
 * 用于测试和诊断代理配置问题
 */

// 测试直接访问原始URL
export const testDirectUrl = async () => {
    const originalUrl = 'https://m1.apifoxmock.com/m1/6595783-6301451-default/apifox/mock/test?apifoxToken=IlGWRhhZetq0ok6Z9HaUz';

    console.log('🧪 测试直接访问原始URL...');
    console.log('URL:', originalUrl);

    try {
        const response = await fetch(originalUrl);
        const data = await response.json();
        console.log('✅ 直接访问成功:', data);
        return { success: true, data };
    } catch (error) {
        console.log('❌ 直接访问失败:', error);
        return { success: false, error };
    }
};

// 测试代理URL
export const testProxyUrl = async () => {
    const proxyUrl = '/apifox/mock/test?apifoxToken=IlGWRhhZetq0ok6Z9HaUz';

    console.log('🔄 测试代理URL...');
    console.log('URL:', proxyUrl);

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        console.log('✅ 代理访问成功:', data);
        return { success: true, data };
    } catch (error) {
        console.log('❌ 代理访问失败:', error);
        return { success: false, error };
    }
};

// 完整的代理诊断
export const fullProxyDiagnosis = async () => {
    console.log('\n🔍 开始代理诊断...\n');

    // 1. 测试直接访问
    console.log('1️⃣ 测试直接访问原始API...');
    const directResult = await testDirectUrl();

    console.log('\n');

    // 2. 测试代理访问
    console.log('2️⃣ 测试通过代理访问...');
    const proxyResult = await testProxyUrl();

    console.log('\n');

    // 3. 诊断结果
    console.log('📊 诊断结果:');

    if (directResult.success && proxyResult.success) {
        console.log('✅ 代理配置正常工作！');
    } else if (directResult.success && !proxyResult.success) {
        console.log('⚠️  原始API正常，但代理配置有问题');
        console.log('   可能原因：');
        console.log('   - Vite代理配置未生效');
        console.log('   - 路径匹配规则错误');
        console.log('   - 端口或URL配置错误');
    } else if (!directResult.success && !proxyResult.success) {
        console.log('❌ 原始API和代理都无法访问');
        console.log('   可能原因：');
        console.log('   - 网络连接问题');
        console.log('   - API服务器故障');
        console.log('   - Token或参数错误');
    } else {
        console.log('🤔 奇怪的情况：代理成功但直接访问失败');
    }

    return {
        direct: directResult,
        proxy: proxyResult
    };
}; 