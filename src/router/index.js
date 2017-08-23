import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import movie from '../components/movie/movie'
import personal from '../components/personal/personal'
import rating from '../components/rating/rating'
import '../common/stylus/index.styl'

Vue.use(Router)
Vue.use(VueResource)
export default new Router({
  routes: [
     {
        path:'/movie',
        component:movie
     },
    {
        path:'/rating',
        component:rating
    },
    {
        path:'/personal',
        component:personal
    }
  ],
  linkActiveClass: 'active'
})
