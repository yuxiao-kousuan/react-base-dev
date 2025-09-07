import React, { ReactElement, useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider, inject, observer } from 'mobx-react'
import ReactDOM from 'react-dom/client'
import RoutesConfig from './router'
import stores from './stores'

import { AppStore } from './stores/AppStore'
import './index.less'
import fontFamily from './assets/fontFamily'

interface IProps {
  appStore: AppStore;
}

function App(props: IProps): ReactElement {
  const { appStore } = props;
  const { loading } = appStore

  useEffect(() => {
    document.body.style.fontFamily = fontFamily.default
  }, [])

  return (
    <React.StrictMode>
      <BrowserRouter>
        {loading ?
          <div>Loading...</div> :
          <Routes>
            {
              RoutesConfig.map((route, index) => (
                <Route
                  {...route}
                  key={route.path}
                  element={(
                    <Suspense fallback={<div>Loading...</div>}>
                      <route.component />
                    </Suspense>
                  )}
                />
              ))
            }
            <Route path='*' element={<div>无此页面</div>} />
          </Routes>
        }
      </BrowserRouter>
    </React.StrictMode>
  )
}

const Index = inject('appStore')(observer(App));


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider {...stores}>
    <Index />
  </Provider>
)
