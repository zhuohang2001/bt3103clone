import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Marketplace from '@/views/Marketplace.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, 
    {
        path: '/marketplace',
        name: 'Marketplace',
        component: Marketplace
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router