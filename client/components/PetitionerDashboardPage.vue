<template>
	<el-container class="dashboard" direction="vertical">
		<el-text size="large">
			This platform allows citizens of Shangri-La to create or sign petitions
			on matter within the government’s responsibility. Any citizen can propose a petition on topics they care about.
			Once a petition reaches the signature threshold set by the Petitions Committee, it then qualifies for
			parliamentary debate. After the debate, the Petitions Committee issues a summary response of behalf of the
			Parliament before formally closing the petition.
		</el-text>
		<el-row justify="space-between">
			<el-input class="search-box" v-model="searchInput" placeholder="Search petitions" />
			<el-button type="primary" @click="showCreatePetitionDialog">Create a Petition</el-button>
		</el-row>
		<el-row :gutter="20">
			<el-col v-for="petition in filteredPetitions" key="petition" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<el-card body-class="petition-card" @click="selectPetition(petition)">
					<template #header>
						<el-text tag="b">{{petition.title}}</el-text>
						<el-tag :type="petition.status === 'open' ? 'success' : 'danger'">{{petition.status}}</el-tag>
						<el-tag v-if="!petition?.response" type="warning">Awaiting Response</el-tag>
					</template>
					<el-text>{{petition.content}}</el-text>
					<el-text tag="b">{{petition.signatures.length}} signatures</el-text>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
	<el-dialog v-model="isDialogVisible" :close="closeDialog">
		<template #header>
			<el-text size="large" tag="b">{{ isCreatingPetition ? 'Create a petition' : selectedPetition?.title }}</el-text>
			<template v-if="selectedPetition">
				<el-tag :type="selectedPetition?.status === 'open' ? 'success' : 'danger'">{{selectedPetition?.status}}</el-tag>
				<el-tag v-if="!selectedPetition?.response" type="warning">Awaiting Response</el-tag>
			</template>
		</template>
		<create-petition-dialog v-if="isCreatingPetition" @newPetition="petitionCreated" />
		<petition-info-dialog v-else-if="selectedPetition" v-model="selectedPetition" :threshold="threshold" :userId="userId" />
	</el-dialog>
</template>
<script>
export default {
	data() {
		return {
			petitions: [],
			searchInput: '',
			isDialogVisible: false,
			selectedPetition: null,
			isCreatingPetition: false,
			threshold: null,
			userId: null,
                };
	},
	computed: {
		filteredPetitions() {
			return this.petitions?.filter((data) => !this.searchInput || data.title.toLowerCase().includes(this.searchInput.toLowerCase()));
		},
	},
	methods: {
		showCreatePetitionDialog() {
			this.isDialogVisible = true
			this.isCreatingPetition = true;
		},
		showPetitionInfoDialog(petition) {
			this.isDialogVisible = true;
			this.selectedPetition = petition;
		},
		getUser() {
			axios.get('http://localhost:3000/slpp/auth/user')
			.then(({data}) => {
				this.userId = data.id;
			})
			.catch((err) => {
				console.error('Error in retrieving user:', err);
			});
		},
		getPetitions() {
			axios.get('http://localhost:3000/slpp/petitions')
			.then(({data}) => {
				this.petitions = data.petitions;
			})
			.catch((err) => {
				console.error('Error in retrieving petitions:', err);
			});
		},
		selectPetition(petition) {
			this.selectedPetition = petition;
			this.isDialogVisible = true;
		},
		petitionCreated(petition) {
			this.getPetitions(petition);
			this.selectPetition(petition);
			this.isCreatingPetition = false;
		},
		getThreshold() {
			axios.get('http://localhost:3000/slpp/petitions/threshold')
			.then(({data}) => {
				this.threshold = Number(data.threshold);
			})
			.catch((err) => {
				console.error('Error in retrieving petition threshold:', err);
			});
		},
		closeDialog() {
			this.isCreatingPetition = false;
			this.selectPetition = null;
		}
	},
	mounted() {
		this.getUser();
		this.getThreshold();
		this.getPetitions();
	},
};
</script>
<style lang="scss" scoped>
.dashboard {
	gap: 2em;

	.search-box {
		width: 40%;
	}

	.el-card {
		margin-bottom: 1em;
		height: 100%;

		cursor: pointer;
	}

	.el-text {
		align-self: flex-start;
	}
}
</style>
