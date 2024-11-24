<template>
	<el-container direction="vertical">
		<el-header>
			<el-menu default-active="/" mode="horizontal" :ellipsis="false" router>
				<el-menu-item>
					<el-text size="large" tag="b">Shangri-La Petition Platform</el-text>
				</el-menu-item>
				<el-menu-item @click="logout">Logout</el-menu-item>
			</el-menu>
		</el-header>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>
</template>
<script>
export default {
	data() {
		return {

		};
	},
	methods: {
		logout() {
			axios.post('http://localhost:3000/slpp/auth/logout')
			.catch((err) => {
				console.error('Logout failed:', err);
			});
		},
	},
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
