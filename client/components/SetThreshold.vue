<template>
	<el-container class="set-threshold" direction="vertical">
		<el-form ref="form" status-icon label-width="80px" label-position="right">
			<el-form-item label="Threshold" prop="threshold">
				<el-input v-model="newThreshold" type="number" pattern="[0-9]*" inputmode="numeric" />
			</el-form-item>
		</el-form>
		<el-row justify="end">
			<el-button @click="setThreshold" :disabled="!newThreshold || newThreshold === threshold" type="primary">Update Threshold</el-button>
			<el-alert :type="alertStatus" :title="alertMessage" />
		</el-row>
	</el-container>
</template>
<script>
export default {
	props: {
		modelValue: {
			type: Number,
		},
	},
	data() {
		return {
			newThreshold: null,
			alertMessage: null,
			alertStatus: null,
		};
	},
	computed: {
		threshold: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit('update:modelValue', value);
			},
		},
	},
	methods: {
		setThreshold() {
			axios.post('http://localhost:3000/slpp/petitions/threshold', {threshold: this.newThreshold}, { withCredentials: true })
			.then(({data}) => {
				this.setAlert('success');
				this.threshold = Number(data.threshold);
			})
			.catch((err) => {
				this.setAlert('danger');
				console.error('Error in updating threshold:', err);
			});
		},
		setAlert(status) {
			this.alertMessage = status === 'success' ? 'Threshold changed successfully' : 'Error setting threshold, please try again.';
			this.alertStatus = status;

			setTimeout(() => {
				this.alertMessage = null;
				this.alertStatus = null;
			}, 3000);
		},
	},
	mounted() {
		this.newThreshold = this.threshold;
	},
};
</script>
<style lang="scss" scoped>
.set-threshold {
	margin-top: 1em;
}
</style>
