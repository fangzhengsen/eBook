import epubBook from '../../views/epubBook/index'
const eBook = [
    {
        path: '/ebook',
        component: epubBook,
        children: [
            {
                path: ':filename',
                component: () => import('../../components/epubBook/EbookReader.vue')
            }
        ]
    },
]

export default eBook;
