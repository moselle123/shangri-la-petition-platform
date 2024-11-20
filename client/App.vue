<template>
	<el-container direction="vertical">
		<el-header>
			<el-menu default-active="/" mode="horizontal" :ellipsis="false" router>
				<el-menu-item>
					<el-text size="large" tag="b">Shangri-La Petition Platform</el-text>
				</el-menu-item>
				<template>
					<el-menu-item index="/">Dashboard</el-menu-item>
				</template>
			</el-menu>
		</el-header>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>
</template>
<script>
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
