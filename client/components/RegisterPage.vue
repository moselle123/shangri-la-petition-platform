<template>
	<el-container class="register" direction="vertical">
		<el-text size="large">Register</el-text>
			<el-alert v-if="isExistingUser" title="These credentials match an existing user, please login." type="error" />
			<el-alert v-if="isValidAlert" title="Fix errors in form before continuing" type="error" />
			<el-alert v-if="isServerError" title="Server error, please try again later." type="error" />
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="user.name" placeholder="Enter your Full Name"/>
			</el-form-item>
			<el-form-item label="Date of Birth" prop="dob">
						<el-date-picker v-model="user.dob" type="date" placeholder="Enter your Date of Birth (DD/MM/YYYY)" format="DD/MM/YYYY" value-format="YYYY/MM/DD" popper-class="popover-hidden"/>
			</el-form-item>
			<el-form-item label="Password" prop="password">
				<el-input v-model="user.password" type="password" placeholder="Enter your password"></el-input>
			</el-form-item>
			<el-form-item label="Confirm Password" prop="password">
				<el-input v-model="confirmPasswordField" type="password" placeholder="Enter your password again"></el-input>
			</el-form-item>
			<el-form-item label="Biometric ID" prop="bioId">
				<el-input v-model="user.bioId" type="number" pattern="[0-9]*" placeholder="Enter your ID or scan the QR code below."/>
			</el-form-item>
		</el-form>
		<el-button @click="register" :disabled="!valid">Register</el-button>
	</el-container>
</template>
<script>
export default {
	data() {
		return {
			valid: false,
			user : {
				username: null,
				name: null,
				dob: null,
				password: null,
				bioId: null,
			},
			isValidAlert: false,
			isExistingUser: false,
			isServerError: false,
			confirmPasswordField: null,
			rules: {
				username: [
					{required: true, message: 'Username is required'},
					{type: 'email', message: 'Please enter a valid email'},
				],
				name: [
					{required: true, message: 'Name is required'},
					{validator: this.checkEmptyString, trigger: 'change'},
				],
				dob: [
					{required: true, message: 'Date of Birth is required'},
				],
				password: [
					{required: true, message: 'Password is required'},
					{validator: this.checkEmptyString, trigger: 'change'},
					{validator: this.confirmPassword, trigger: 'change'},
				],
				bioId: [
					{required: true, message: 'Biometric ID is required'},
					{type: 'number', message: 'Biometric ID must contain numerical characters only.'},
					{ min: 10, max: 10, message: 'Length should be 10 digits', trigger: 'blur'},
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
		register() {

		},
		checkEmptyString(rule, value, callback) {
			if (!value.trim()) {
				callback(new Error('Please enter a value.'));
			} else {
				callback();
			}
		},
		confirmPassword(rule, value, callback) {
			if (value !== this.confirmPasswordField) {
				callback(new Error('Passwords don\'t match'));
			} else {
				callback();
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.register {
	align-items: center;
	gap: 4em;

	.el-form {
		max-width: 600px;
		width: 90%;

		.el-form-item {
			margin-bottom: 1em;
		}
	}
}
</style>
