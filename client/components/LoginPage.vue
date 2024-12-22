<template>
	<el-container class="login" direction="vertical">
		<el-text size="large" tag="b">Login</el-text>
		<el-form ref="form" status-icon :rules="rules" label-width="80px" :model="loginDetails">
			<el-alert v-if="errorMessage" :title="errorMessage" type="error" />
			<el-form-item label="Email" prop="email">
				<el-input v-model="loginDetails.email" type="email" placeholder="Enter your email"></el-input>
			</el-form-item>
			<el-form-item label="Password" prop="password">
				<el-input v-model="loginDetails.password" type="password" placeholder="Enter your password"></el-input>
			</el-form-item>
		</el-form>
		<el-button @click="login" type="primary">Login</el-button>
		<el-text class="register-link" @click="register">Don't have an account? Register here.</el-text>
	</el-container>
</template>
<script>
export default {
	data() {
		return {
			loginDetails : {
				email: null,
				password: null,
			},
			isAccessDenied: false,
			isServerError: false,
			rules: {
				email: [
					{required: true, message: 'Email is required'},
					{type: 'email', message: 'Please enter a valid email'},
				],
				password: [
					{required: true, message: 'Password is required'},
					{validator: this.checkEmptyString, trigger: 'blur'},
				],
			},
			errorMessage: null,
		};
	},
	methods: {
		login() {
			this.$refs['form'].validate((valid) => {
				this.isValidAlert, this.isAccessDenied, this.isServerError = false;
				if (valid) {
					axios.post('http://localhost:3000/slpp/auth/login', this.loginDetails)
					.then(() => {
						this.$router.push('/');
					})
					.catch((err) => {
						console.error(err);
						if (err.status === 401) {
							this.errorMessage = 'Email or password incorrect, please try again.';
						}
						if (err.status === 500) {
							this.errorMessage = 'Server error, please try again later.';
						}
					});
				} else {
					this.errorMessage = 'Fix errors in form before continuing';
				}
			});
		},
		register() {
			this.$router.push('register');
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

	.el-alert {
		margin-bottom: 1em;
	}

	.el-form {
		max-width: 600px;
		width: 90%;
		margin: 4em 0;
	}

	.register-link {
		margin-top: 1em;

		color: #333;
		text-decoration: underline;

		cursor: pointer;
	}
}
</style>
