import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import CreateAccount from "@/views/CreateAccount.vue"
import Home from "@/views/Home.vue";
import Marketplace from "@/views/Marketplace.vue";
import Profile from "@/views/Profile.vue";
import ListingCompleted from "@/views/ListingCompleted.vue";
import AddNewListing from "@/views/AddNewListing.vue";

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
    {
        path: "/createaccount",
        name: "CreateAccount",
        component: CreateAccount,
    },
	{
		path: "/home",
		name: "Home",
		component: Home,
	},
	{
		path: "/marketplace",
		name: "Marketplace",
		component: Marketplace,
	},
	{
		path: "/profile",
		name: "Profile",
		component: Profile,
	},
	{
		path: "/listingcompleted",
		name: "ListingCompleted",
		component: ListingCompleted,
	},
	{
		path: "/addnewlisting",
		name: "AddNewListing",
		component: AddNewListing,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
