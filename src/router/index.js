import VueRouter from "vue-router"
import Main from "../pages/Main.vue"
import TaskView from "../pages/TaskView.vue"
export default new VueRouter({
    routes: [
        {
            path: "/home",
            component: Main
        },
        {
            path: "/view",
            component: TaskView,
            props($route) {
                return {
                    sid: $route.query.sid
                }
            }
        },
        {
            path: "*",
            redirect: "/home"
        },
    ]
})