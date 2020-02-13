import Vue from 'vue'
import VueRouter from 'vue-router'
import epubBook from "./epubBook/index";
import store from './store/index'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  ...epubBook,
  ...store
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
