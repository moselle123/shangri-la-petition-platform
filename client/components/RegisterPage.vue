<template>
	<el-container class="register" direction="vertical">
		<el-text size="large">Register</el-text>
		<el-form ref="form" status-icon :rules="rules" label-width="150px" :model="user">
			<el-alert v-if="errorMessage" :title="errorMessage" type="error" />
			<el-row justify="space-evenly">
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="Email" prop="email">
						<el-input v-model="user.email" type="email" placeholder="Enter your email"></el-input>
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
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<div v-if="!scanSuccessful" id="reader" class="qrReader"></div>
					<el-alert v-else type="success" title="QR code scanned successfully." />
					<el-form-item label="Biometric ID" prop="bioId">
						<el-input v-model="user.bioId" placeholder="Enter your ID or scan the QR code above."/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-button @click="register" type="primary">Register</el-button>
		<el-text class="login-link" @click="login">Already have an account? Login here.</el-text>
	</el-container>
</template>
<script>
export default {
	data() {
		return {
			valid: false,
			user : {
				email: null,
				name: null,
				dob: null,
				password: null,
				bioId: null,
			},
			errorMessage: null,
			confirmPasswordField: null,
			qrCodeReader: null,
			scanSuccessful: null,
			rules: {
				email: [
					{required: true, message: 'Email is required'},
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
					{ min: 10, max: 10, message: 'Length should be 10 digits', trigger: 'blur'},
				],
			},
		};
	},
	methods: {
		register() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.errorMessage = null;
					axios.post('http://localhost:3000/slpp/auth/register', this.user)
					.then(() => {
						this.$router.push('/login');
					})
					.catch((err) => {
						if (err.status === 400) {
							this.errorMessage = err.response.data;
						} else if (err.status === 500) {
							this.errorMessage = 'Error creating user, please try again.'
						}
					});
				}
			});
		},
		login() {
			this.stopQrScanner();
			setTimeout(() => {
				this.$router.push('login');
			}, 500);
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
		onScanSuccess(decodedText, decodedResult) {
			this.user.bioId = decodedText;
			this.qrCodeReader.stop()
			.catch((err) => {
				console.error("Failed to stop scanning:", err);
			});
			this.scanSuccessful = true;
		},
		startQrScanner() {
			navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				stream.getTracks().forEach((track) => track.stop());
				this.qrCodeReader.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, this.onScanSuccess.bind(this))
				.catch((err) => {
					console.error("Failed to start QR code scanning:", err);
				});
			})
			.catch((err) => {
				console.error("Camera permission denied:", err);
				alert(
					"Camera access is required to scan QR codes. Please enable camera permissions in your browser settings."
				);
			});
		},
		stopQrScanner() {
			if (this.qrCodeReader) {
				this.qrCodeReader.stop()
				.catch((err) => {
					console.error('Error stopping QR code scanner:', err);
				});
			}

			navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream) => {
				stream.getTracks().forEach((track) => track.stop());
			})
			.catch((err) => console.error('Error stopping camera tracks:', err));
		},
	},
	mounted() {
		this.qrCodeReader = new Html5Qrcode("reader");
		this.startQrScanner();
	},
	beforeDestroy() {
        	this.stopQrScanner();
	},
};
</script>
<style lang="scss" scoped>
.register {
	align-items: center;
	gap: 4em;

	.el-alert {
		margin-bottom: 1em;
	}

	.divider {
		height: 100%;
		width: 1px;

		background-color: var(--el-border-color);
	}

	.el-form {
		width: 90%;

		.el-form-item {
			margin-bottom: 1em;
		}
	}

	.login-link {
		margin-top: 1em;

		color: #333;
		text-decoration: underline;

		cursor: pointer;
	}

	.qrReader {
		margin: 0 auto 1em;
		width: 300px;

		border: 2px solid var(--el-border-color);
	}
}
</style>
