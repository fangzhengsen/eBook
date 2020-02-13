import store from '../../views/store/index'

const eBookStore = [
    {
        path: '/store',
        component: store,
        redirect: '/store/shelf',
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
            {
                path: 'category',
                component: () => import('../../views/store/StoreCategory.vue')
            },
            {
                path: 'speaking',
                component: () => import('../../views/store/StoreSpeaking.vue')
            },
        ]
    }
]

export default eBookStore;