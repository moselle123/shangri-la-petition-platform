<template>
	<el-container class="petition-info" direction="vertical">
		<el-text>{{petition.content}}</el-text>
		<el-divider />
		<el-row justify="space-evenly" align="middle">
			<el-col :xs="24" :sm="7" :md="7" :lg="7" :xl="7">
				<el-progress type="dashboard" :percentage="percentage">
					<template #default>
						<el-text>{{petition?.signatures.length}}</el-text>
						<el-text size="small">Signatures</el-text>
					</template>
				</el-progress>
			</el-col>
			<el-col v-if="petition?.response" class="response" :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
				<el-text tag="i">Response:</el-text>
				<el-text>{{petition?.response}}</el-text>
			</el-col>
		</el-row>
		<template v-if="user.role === 'petitioner' && petition.status === 'open' && !signed">
			<el-divider />
			<el-checkbox v-model="acknowledged" size="small" label="I understand that once I sign this petition I cannot withdraw my signature." />
			<el-button @click="signPetition" type="primary" :disabled="!acknowledged">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
				Sign Petition
			</el-button>
		</template>
		<template v-if="user.role === 'committee' && !petition?.response && petition?.signatures.length >= threshold">
			<el-divider />
			<el-input type="textarea" v-model="newResponse" placeholder="Write a response to this petition."></el-input>
			<el-button @click="respondToPetition" type="primary" :disabled="!newResponse">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
				Send Response
			</el-button>
		</template>
		<el-alert v-if="signed" type="success" title="You have signed this petition." show-icon :closable="false" />
		<el-alert v-if="petition.status === 'closed' && user.role ==='petitioner'" type="info" title="This petition has received a response and is no longer open for signatures." show-icon :closable="false" />
	</el-container>
</template>
<script>
export default {
	props: {
		modelValue: {
			type: Object,
		},
		threshold: {
			type: Number,
		},
		user: {
			type: Object,
		},
	},
	data() {
		return {
			acknowledged: false,
			newResponse: null,
		};
	},
	computed: {
		petition: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit('update:modelValue', value);
			},
		},
		percentage() {
			if (this.petition.signatures.length > this.threshold) {
				return 100;
			}
			return this.petition.signatures.length ? this.petition?.signatures.length / this.threshold * 100 : 100;

		},
		signed() {
			return this.petition.signatures.includes(this.user.email)
		}
	},
	methods: {
		signPetition() {
			return axios.put('http://localhost:3000/slpp/petitions/sign/' + this.petition._id, {}, { withCredentials: true })
			.then(({data}) => {
				this.petition = data.petition;
				this.$emit('petitionUpdated');
				this.acknowledged = false;
			})
			.catch((err) => {
				console.error('Error in retrieving petition threshold:', err);
				this.acknowledged = false;
			});
		},
		respondToPetition() {
			return axios.put('http://localhost:3000/slpp/petitions/respond/' + this.petition._id, {response: this.newResponse}, { withCredentials: true })
			.then(({data}) => {
				this.newResponse = null;
				this.petition = data.petition;
				this.$emit('petitionUpdated');
			})
			.catch((err) => {
				console.error('Error in retrieving responding to petition:', err);
			});
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

	.el-col {
		display: flex;
		justify-content: center;
	}

	.response {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.el-button, .el-checkbox {
		margin: 0 auto;
	}
}
</style>
