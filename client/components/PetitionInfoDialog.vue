<template>
	<el-container class="petition-info" direction="vertical">
		<el-text>{{petition.content}}</el-text>
		<el-divider />
		<el-row justify="space-evenly" align="middle">
			<el-col :xs="24" :sm="7" :md="7" :lg="7" :xl="7">
				<el-progress type="dashboard" :percentage="percentage">
					<template #default>
						<el-text>{{petition?.signatureCount}}</el-text>
						<el-text size="small">Signatures</el-text>
					</template>
				</el-progress>
			</el-col>
			<el-col v-if="petition?.response" :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
				<el-text tag="i">Response:</el-text>
				<el-text>{{petition?.response}}</el-text>
			</el-col>
		</el-row>
		<el-divider />
		<el-checkbox v-model="acknowledged" size="small" label="I understand that once I sign this petition I cannot withdraw my signature." />
		<el-button type="primary" :disabled="!acknowledged">Sign Petition</el-button>
	</el-container>
</template>
<script>
export default {
	props: {
		petition: {
			type: Object,
		},
		threshold: {
			type: Number,
		},
		userId: {
			type: String,
		},
	},
	data() {
		return {
			acknowledged: false,
		};
	},
	computed: {
		percentage() {
			return this.petition.signatures ? this.petition?.signatures / this.threshold * 100 : 0;
		},
		// signed() {
		// 	return this.petition.signatures.includes();
		// },
	},
	methods: {
		signPetition() {

		},
	},
};
</script>
<style lang="scss" scoped>
.petition-info {
	gap: 1em;

	.el-text {
		align-self: flex-start;
	}

	.el-button {
		margin: 1em 0 0 auto;
	}
}
</style>
