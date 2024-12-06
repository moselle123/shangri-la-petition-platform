<template>
	<el-container class="charts">
		<canvas ref="signaturesChart" style="max-width: 100%; height: 400px;"></canvas>
	</el-container>
</template>
<script>
export default {
	props: {
		petitions: {
			type: Object,
		},
	},
	data() {
		return {

		};
	},
	methods: {
		loadChart() {
			let titles = this.petitions.map(petition => petition.title);
			let signatureCounts = this.petitions.map(petition => petition.signatures.length);
			console.log(titles, signatureCounts)

          		let context = this.$refs['signaturesChart'].getContext('2d');
			new Chart(context, {
				type: 'bar',
				data: {
					labels: titles,
					datasets: [{
						label: 'Signatures',
						data: signatureCounts,
						backgroundColor: 'rgba(75, 192, 192, 0.6)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1
					}],
				},
				options: {responsive: true, scales: {y: {beginAtZero: true}}},
			});
		},

	},
	mounted() {
		this.loadChart();
	},
};
</script>
<style lang="scss" scoped>
.charts {

}
</style>
