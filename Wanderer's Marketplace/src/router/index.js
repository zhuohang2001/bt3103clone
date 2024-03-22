import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Marketplace from '@/views/Marketplace.vue'
import Profile from '@/views/Profile.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    }, 
    {
        path: '/home',
        name: 'Home',
        component: Home
    }, 
    {
        path: '/marketplace',
        name: 'Marketplace',
        component: Marketplace
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router