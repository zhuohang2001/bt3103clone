import { createStore } from "vuex";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();

export default createStore({
	state: {
		user: null, // This will hold the logged-in user state
		currentListing: null, // Initialize currentListing
		userProfile: {
			profilePhoto: "",
		},
	},
	mutations: {
		setUser(state, user) {
			console.log("user setting");
			console.log(user);
			state.user = user;
		},
		setCurrentListing(state, listing) {
			state.currentListing = listing;
		},
		setUserProfile(state, userProfile) {
			state.userProfile = userProfile;
		},
	},
	actions: {
		initializeAuth({ commit }) {
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				commit("setUser", user);
				if (user) {
					this.dispatch("fetchUserProfile", user);
				}
			});
		},
		setCurrentListing({ commit }, listing) {
			commit("setCurrentListing", listing);
		},
		async fetchUserProfile({ commit }, user) {
			if (!user) {
				// Handle the case where the user is not logged in or is undefined
				console.error("User is not logged in or is undefined");
				return;
			}
			const userDocRef = doc(db, "Users", user.uid);
			try {
				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					commit("setUserProfile", {
						profilePhoto: userDocSnapshot.data().profilePhoto,
					});
				}
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		},
	},
});
