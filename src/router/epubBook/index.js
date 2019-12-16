import epubBook from '../../views/epubBook/index'
const eBook=[
    {
        path: '/epubBook',
        component: epubBook,
        children:[
            {
                path:':filename',
                component:()=>import('../../components/epubBook/EbookReader.vue')
            }
        ]
    },
]

export default eBook;
