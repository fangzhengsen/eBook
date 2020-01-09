import store from '../../views/store/index'

const eBookStore = [
    {
        path: '/store',
        component: store,
        redirect: '/store/home',
        children: [
            {
                path: 'home',
                component: () => import('../../views/store/StoreHome.vue')
            },
        ]
    }
]

export default eBookStore;