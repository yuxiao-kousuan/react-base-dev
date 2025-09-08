import React, { ReactElement, useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider, inject, observer } from 'mobx-react'
import ReactDOM from 'react-dom/client'
import RoutesConfig from './router'
import Layout from './components/Layout'

import AppStore, { AppStore as AppStoreType } from './stores/AppStore'
import WelcomePageStore from './stores/WelcomePageStore'
import './index.less'
import fontFamily from './assets/fontFamily'

// 创建明确的 stores 对象
const stores = {
  appStore: AppStore,
  welcomePageStore: WelcomePageStore
};

interface IProps {
  appStore: AppStoreType;
}

function App(props: IProps): ReactElement {
  const { appStore } = props;
  const { loading } = appStore

  console.log(loading)

  useEffect(() => {
    document.body.style.fontFamily = fontFamily.default
  }, [])

  return (
    <React.StrictMode>
      <BrowserRouter>
        {<Layout>
          <Routes>
            {
              RoutesConfig.map((route, index) => (
                <Route
                  path={route.path}
                  key={route.path}
                  element={(
                    <Suspense fallback={<div>组件切换Loading...</div>}>
                      <route.component />
                    </Suspense>
                  )}
                />
              ))
            }
            <Route path='*' element={<div>无此页面</div>} />
          </Routes>
        </Layout>
        }
      </BrowserRouter>
    </React.StrictMode>
  )
}

const Index = inject('appStore')(observer(App));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider {...stores}>
    {/* @ts-ignore */}
    <Index />
  </Provider>
)
