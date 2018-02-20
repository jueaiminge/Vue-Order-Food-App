// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Goods from './components/goods/goods'
import Seller from './components/seller/seller'
import Ratings from './components/ratings/ratings'

import './common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {
 	path: '/',
 	component: Goods,
 	redirect: '/goods'
  },
  { path: '/goods', 
  	component: Goods
  },
  { path: '/ratings', 
  	component: Ratings 
  },
  { path: '/seller', 
  	component: Seller 
  }
]

const router = new VueRouter({
//	mode:'history',
  	routes // （缩写）相当于 routes: routes
})

const app = new Vue({
  	router,
  	el: '#app',
	template: '<App/>',
	components: { App }
})

/* eslint-disable no-new */
//new Vue({
//el: '#app',
//template: '<App/>',
//components: { App }
//});
