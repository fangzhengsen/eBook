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
            {
                path: 'list',
                component: () => import('../../views/store/StoreList.vue')
            },
            {
                path: 'detail',
                component: () => import('../../views/store/StoreDetail.vue')
            },
            {
                path: 'shelf',
                component: () => import('../../views/store/StoreShelf.vue')
            },
        ]
    }
]

export default eBookStore;