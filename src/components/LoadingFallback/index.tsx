import React, { ReactElement, useEffect } from 'react';
import NProgress from 'nprogress';
import './index.less'

// 配置 NProgress
NProgress.configure({
    showSpinner: false, // 不显示旋转器
    minimum: 0.1, // 最小进度
    speed: 200, // 动画速度
    trickleSpeed: 200, // 滴流速度
});

function LoadingFallback(): ReactElement {

    useEffect(() => {
        // 组件挂载时开始加载
        NProgress.start();

        // 组件卸载时完成加载
        return () => {
            NProgress.done();
        };
    }, []);

    return <React.Fragment></React.Fragment>;
}

export default LoadingFallback;
