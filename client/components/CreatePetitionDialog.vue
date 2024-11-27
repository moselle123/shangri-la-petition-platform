<template>
	<el-container class="create-petition" direction="vertical">
		<el-form ref="form" status-icon :rules="rules" label-width="80px" label-position="right" :model="petition">
			<el-form-item label="Title" prop="title">
				<el-input v-model="petition.title"></el-input>
			</el-form-item>
			<el-form-item label="Content" prop="content">
				<el-input type="textarea" v-model="petition.content"></el-input>
			</el-form-item>
		</el-form>
		<el-row justify="end">
			<el-button @click="createPetition" type="primary">Create</el-button>
		</el-row>
	</el-container>
</template>
<script>
export default {
	data() {
		return {
			petition: {
				title: null,
				content: null,
			},
			rules: {
				title: [
					{required: true, message: 'Title is required'},
				],
				content: [
					{required: true, message: 'Content is required'},
				],
			},
		};
	},
	methods: {
		createPetition() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					axios.post('http://localhost:3000/slpp/petitions/create', this.petition, { withCredentials: true })
					.then(({data}) => {
						this.petition.title = null;
						this.petition.content = null;
						this.$emit('newPetition', data.petition);
					})
					.catch((err) => {
						console.debug('Error in creating petition:', err);
					});
				} else {
					this.isValidAlert = true;
				}
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.create-petition {
	margin-top: 1em;
}
</style>
