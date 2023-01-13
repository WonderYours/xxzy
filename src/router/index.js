import VueRouter from "vue-router"
import Main from "../pages/Main.vue"
import Settler from "../pages/Settler.vue"
export default new VueRouter({
    routes: [
        {
            path: "/home",
            component: Main
        },
        {
            path: "/settler",
            component: Settler
        },
        {
            path: "*",
            redirect: "/home"
        },
    ]
})