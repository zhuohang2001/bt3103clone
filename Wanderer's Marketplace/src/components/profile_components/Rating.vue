<template>
	<div class="rating-container">
		<div class="top">
			<img
				src="/images/logo_without_words.png"
				alt="Profile Photo"
				class="profile-photo"
			/>
			<div class="top-right">
				<div class="username">{{ ratedByUsername }}</div>
				<span class="star" v-for="i in 5" :key="i" :style="getStarStyle(i)"
					>&#9733;</span
				>
			</div>
		</div>
		<div v-if="ratingComment" class="comment">{{ ratingComment }}</div>
		<div class="rating-info">
			<span>{{ ratingType }} Rating from Shopper </span>
			<span>|</span>
			<span>{{ monthsPosted }} 2 months ago</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		profilePhoto: {
			type: String,
			required: true,
		},
		ratedByUsername: {
			type: String,
			required: true,
		},
		ratingValue: {
			type: Number,
			required: true,
			validator: (val) => val >= 0 && val <= 5,
		},
		ratingComment: {
			type: String,
			default: "",
		},
	},
	methods: {
		getStarStyle(index) {
			return {
				color: index <= this.ratingValue ? "#051e55" : "#ccc",
			};
		},
	},
};
</script>

<style scoped>
.rating-container {
	background-color: #fff1e7;
	border-radius: 20px;
	padding: 1rem;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	text-align: left;
}

.top {
	display: flex;
}

.profile-photo {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.top-right {
	display: block;
}

.username {
	font-weight: bold;
}

.star {
	font-size: 20px;
}

.comment {
	margin-top: 10px;
}

.rating-info {
    font-size: xx-small;
}
</style>
