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
  routes
})

export default router
