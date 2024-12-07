<template>
	<el-text v-if="loading" size="large" class="loading">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="spinner"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
		Loading data analysis
	</el-text>
	<el-row class="charts">
		<el-col  :xs="24" :sm="11" :md="11" :lg="11" :xl="11">
			<el-text v-if="!loading">Top 3 Petitions</el-text>
			<canvas ref="signaturesChart" style="width: 100%;"></canvas>
		</el-col>
		<el-col  :xs="24" :sm="11" :md="11" :lg="11" :xl="11">
			<el-text v-if="!loading">Popular words</el-text>
			<canvas ref="wordCloud" style="width: 100%;"></canvas>
		</el-col>
	</el-row>
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
			loading: true,
		};
	},
	computed: {
		topPetitions() {
			return this.petitions.sort((a, b) => b.signatures.length - a.signatures.length).slice(0, 3);
		}
	},
	methods: {
		loadChart() {
			let titles = this.topPetitions.map(petition => petition.title);
			let signatureCounts = this.topPetitions.map(petition => petition.signatures.length);

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
		loadWordCloud() {
			let wordCounts = {};
			this.petitions.forEach(petition => {
				let words = petition.title.split(/\s+/);
				words.concat(petition.content.split(/\s+/));
				words.forEach(word => {
					let currentWord = word.toLowerCase();
					if (!wordCounts[currentWord]) {
						wordCounts[currentWord] = 0;
					}
					wordCounts[currentWord]++;
				});
			});
			let wordArray = Object.entries(wordCounts);

			WordCloud(this.$refs['wordCloud'], {
				list: wordArray,
				gridSize: 10,
				weightFactor: 10,
				color: () => `hsl(${Math.random() * 360}, 100%, 50%)`,
			});
		},
	},
	mounted() {
		setTimeout(() => {
			this.loadChart();
			this.loadWordCloud();
			this.loading = false;
		}, 1000)
	},
};
</script>
<style lang="scss" scoped>
.charts {
	.loading {
		.spinner {
			height: 1em;
			width: 1em;

			animation: rotation 2s infinite linear;
		}

		@keyframes rotation {
			from { transform: rotate(0deg); }
			to   { transform: rotate(359deg); }
		}
	}

	canvas {
		margin: auto;
	}
}
</style>
