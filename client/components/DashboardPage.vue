<template>
	<el-container class="dashboard" direction="vertical">
		<el-row justify="space-between">
			<el-input class="search-box" v-model="searchInput" placeholder="Search petitions" />
			<el-button v-if="user.role === 'petitioner'" type="primary" @click="showCreatePetitionDialog">Create a Petition</el-button>
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
					<el-text tag="b">{{petition.signatures.length}} {{petition.signatures.length === 1 ? 'signature' : 'signatures'}}</el-text>
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
		<create-petition v-if="isCreatingPetition" @newPetition="petitionCreated" />
		<petition-info v-else-if="selectedPetition" v-model="selectedPetition" :threshold="threshold" :user="user" />
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
			user: {
				id: null,
				role:null,
			},
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
				Object.assign(this.user, data);
			})
			.catch((err) => {
				console.error('Error in retrieving user:', err);
			});
		},
		getPetitions() {
			return axios.get('http://localhost:3000/slpp/petitions')
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
			return axios.get('http://localhost:3000/slpp/petitions/threshold')
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

	.el-col {
		margin-bottom: 1em;

		.el-card {
			height: 100%;

			cursor: pointer;
		}
	}


	.el-text {
		align-self: flex-start;
	}
}
</style>
