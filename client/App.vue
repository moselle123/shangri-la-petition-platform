<template>
	<el-container direction="vertical">
		<el-header>
			<el-menu default-active="/" mode="horizontal" :ellipsis="false" router>
				<el-menu-item>
					<el-text size="large" tag="b">Shangri-La Petition Platform</el-text>
				</el-menu-item>
				<el-menu-item v-if="pageName === 'Dashboard'" @click="logout">Logout</el-menu-item>
			</el-menu>
		</el-header>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>
</template>
<script>
export default {
	computed: {
		pageName() {
			return this.$route.name;
		},
	},
	methods: {
		fetchNewAccessToken() {
			return axios.post('http://localhost:3000/slpp/auth/refresh-token', {}, { withCredentials: true })
			.then(() => {
				this.$router.push('/dashboard');
			});
		},
		logout() {
			axios.post('http://localhost:3000/slpp/auth/logout')
			.catch((err) => {
				console.error('Logout failed:', err);
			});
		},
	},
	beforeMount() {
		this.fetchNewAccessToken();
	}
};
</script>
<style lang="scss" scoped>
.el-header {
	padding: 0;

	.el-menu-item {
		&:first-child {
			margin-right: auto;
		}
	}
}
</style>
