<template>
	<el-container class="dashboard" direction="vertical">
		<el-text size="large">
			This platform allows citizens of Shangri-La to create or sign petitions
			on matter within the government’s responsibility. Any citizen can propose a petition on topics they care about.
			Once a petition reaches the signature threshold set by the Petitions Committee, it then qualifies for
			parliamentary debate. After the debate, the Petitions Committee issues a summary response of behalf of the
			Parliament before formally closing the petition.
		</el-text>
		<el-row>
			<el-input class="search-box" v-model="searchInput" placeholder="Search petitions" />
			<el-button type="primary" @click="toggleDialog">Create a Petition</el-button>
		</el-row>
		<el-row class="grid">
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<el-card v-for="petition in filteredPetitons" key="petition">
					<template #header>
						<el-text>{{petition.title}}</el-text>
						<el-tag :type="petition.status === 'open' ? 'success' : 'danger'">{{petition.status}}</el-tag>
					</template>
					<el-text>{{petition.description}}</el-text>
					<!-- <el-progress :percentage="(petition.signatures / petition.signaturesNeeded * 100).toFixed(0)" /> -->
				</el-card>
			</el-col>
		</el-row>
	</el-container>
	<el-dialog v-model="isDialogVisible" title="Create a new petition">
		<el-form ref="form" status-icon :rules="rules" label-width="200px" :model="loginDetails">
			<el-form-item label="Username" prop="username">
				<el-input v-model="loginDetails.username" type="email" placeholder="Enter your email"></el-input>
			</el-form-item>
			<el-form-item label="Password" prop="password">
				<el-input v-model="loginDetails.password" type="password" placeholder="Enter your password"></el-input>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
export default {
	data() {
		return {
			petitions: [
				{
					title: 'Free Pizza Tuesdays',
					status: 'open',
					description: 'All citezens of Shangri-La should be gifted free Pizza every Tuesday.',
					signatures: 782,
					signaturesNeeded: 1000,

				}
			],
			searchInput: '',
			isDialogVisible: false,
                };
	},
	computed: {
		filteredPetitons() {
			return this.petitions.filter((data) => !this.searchInput || data.title.toLowerCase().includes(this.searchInput.toLowerCase()));
		},
	},
	methods: {
		toggleDialog() {
			this.isDialogVisible = !this.isDialogVisible;
		},
	},
};
</script>
<style lang="scss" scoped>
.dashboard {
	gap: 2em;
}
</style>
