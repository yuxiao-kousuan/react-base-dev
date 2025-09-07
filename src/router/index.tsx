import { lazy } from "react";

export default [
    {
        path: '/',
        component: lazy(() => import('@src/page/WelcomePage')),
        title: '欢迎页'
    }
]