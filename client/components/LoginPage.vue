<template>
	<el-container class="login" direction="vertical">
		<el-text size="large">Login</el-text>
		<el-form ref="form" status-icon :rules="rules" label-width="200px" :model="loginDetails">
			<el-form-item label="Username" prop="username">
				<el-input v-model="loginDetails.username" type="email" placeholder="Enter your email"></el-input>
			</el-form-item>
			<el-form-item label="Password" prop="password">
				<el-input v-model="loginDetails.password" type="password" placeholder="Enter your password"></el-input>
			</el-form-item>
		</el-form>
		<el-button @click="login" :disabled="!valid">Login</el-button>
	</el-container>
</template>
<script>
export default {
	data() {
		return {
			valid: false,
			loginDetails : {
				username: null,
				password: null,
			},
			rules: {
				username: [
					{required: true, message: 'Username is required'},
					{type: 'email', message: 'Please enter a valid email'},
				],
				password: [
					{required: true, message: 'Password is required'},
					{validator: this.checkEmptyString, trigger: 'blur'},
				],
			},
		};
	},
	watch: {
		user: {
			handler(newValue, oldValue) {
				this.$refs['form'].validate(valid => valid ? this.valid = true : this.valid = false);
			},
			deep: true,
		},
	},
	methods: {
		login() {

		},
		checkEmptyString(rule, value, callback) {
			if (!value.trim()) {
				callback(new Error('Please enter a password'));
			} else {
				callback();
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.login {
	align-items: center;
	gap: 4em;

	.el-form {
		max-width: 600px;
		width: 90%;
	}
}
</style>
