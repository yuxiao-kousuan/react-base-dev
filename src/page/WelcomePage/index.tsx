import React, { ReactElement } from 'react';
import { observer, inject } from 'mobx-react';
import { WelcomePageStore } from '@src/stores/WelcomePageStore';

import './index.less';

interface IProps {
    prefixCls?: string;
    welcomePageStore: WelcomePageStore;
}

Index.defaultProps = {
    prefixCls: 'mc-WelcomePage'
};

function Index(props: IProps): ReactElement {
    const { prefixCls, welcomePageStore } = props;
    const { isVisible } = welcomePageStore;


    return (
        <div className={prefixCls}>
            {isVisible ? '我是配置2' : '我是配置1'}
            <button onClick={() => welcomePageStore.setIsVisible(!isVisible)}>
                切换
            </button>
        </div>
    );
}

export default inject('welcomePageStore')(observer(Index));
