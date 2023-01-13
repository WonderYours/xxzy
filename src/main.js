import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from "./router/index.js"

Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
  beforeCreate(){
    Vue.prototype.$bus = this;
  }
})

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
