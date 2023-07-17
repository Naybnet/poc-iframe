<script setup lang="ts">
import { NAlert, NGi, NGrid, NPageHeader, NSpin, NStatistic } from 'naive-ui'
import { createFetch } from '@vueuse/core'
import { Bar, Line } from 'vue-chartjs'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js'

import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

const statisticsEndPoint = createFetch({
  baseUrl: 'http://localhost:3000/api/statistics',
})
const { isFinished: isFinishedCountryStats, isFetching: isFetchingCountryStats, error: errorCountryStats, data: countryStats } = statisticsEndPoint('/').get().json()
const { isFinished: isFinishedUserStats, isFetching: isFetchingUserStats, error: errorUserStats, data: userStats } = statisticsEndPoint('/user-1').get().json()

const chartLabels = {
  'sem-1': 'Semester 1',
  'sem-2': 'Semester 2',
  'sem-3': 'Semester 3',
  'sem-4': 'Semester 4',
}

function getChartOptions(title: string, stack = true) {
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        stacked: stack,
      },
      y: {
        stacked: stack,
      },
    },
  }
  return chartOptions
}

function formatData(data: any) {
  const res = {
    ninterNoCompl: [] as number[],
    ninterWithCompl: [] as number[],
    ninterPlanned: [] as number[],
    ninterUnplanned: [] as number[],
    autonomy: [] as number[],
    confidence: [] as number[],
  }

  if (!data)
    return res

  Object.keys(chartLabels).forEach((key) => {
    res.ninterNoCompl.push(data[key].ninter - data[key].ninterWithCompl)
    res.ninterWithCompl.push(data[key].ninterWithCompl)

    res.ninterPlanned.push(data[key].ninter - data[key].ninterUnplanned)
    res.ninterUnplanned.push(data[key].ninterUnplanned)

    res.autonomy.push(data[key].autonomy)
    res.confidence.push(data[key].confidence)
  })

  return res
}

const chartData = computed(() => {
  const country = formatData(countryStats.value)
  const user = formatData(userStats.value)

  return {
    compl: {
      labels: Object.values(chartLabels),
      datasets: [
        {
          label: 'w/ compl',
          backgroundColor: '#f6bd00',
          data: user.ninterWithCompl,
          stack: 'user',
        },
        {
          label: 'no compl',
          backgroundColor: '#fef08a',
          data: user.ninterNoCompl,
          stack: 'user',
        },
        {
          label: 'national w/ compl',
          backgroundColor: '#0284c7',
          data: country.ninterWithCompl,
          stack: 'country',
        },
        {
          label: 'national no compl',
          backgroundColor: '#67e8f9',
          data: country.ninterNoCompl,
          stack: 'country',
        },

      ],
    },
    unplanned: {
      labels: Object.values(chartLabels),
      datasets: [
        {
          label: 'unplanned',
          backgroundColor: '#ea580c',
          data: user.ninterUnplanned,
          stack: 'user',
        },
        {
          label: 'planned',
          backgroundColor: '#fdba74',
          data: user.ninterPlanned,
          stack: 'user',
        },
        {
          label: 'national unplanned',
          backgroundColor: '#7c3aed',
          data: country.ninterUnplanned,
          stack: 'country',
        },
        {
          label: 'national planned',
          backgroundColor: '#c7d2fe',
          data: country.ninterPlanned,
          stack: 'country',
        },
      ],
    },
    autonomy: {
      labels: Object.values(chartLabels),
      datasets: [
        {
          label: 'user',
          borderColor: '#f6bd00',
          backgroundColor: '#fffbeb',
          data: user.autonomy,
        },
        {
          label: 'national',
          borderColor: '#0284c7',
          backgroundColor: '#e0f2fe',
          data: country.autonomy,
        },
      ],
    },
    confidence: {
      labels: Object.values(chartLabels),
      datasets: [
        {
          label: 'user',
          borderColor: '#ea580c',
          backgroundColor: '#ffedd5',
          data: user.autonomy,
        },
        {
          label: 'national',
          borderColor: '#7c3aed',
          backgroundColor: '#ede9fe',
          data: country.autonomy,
        },
      ],
    },
  }
})
</script>

<template>
  <main class="px-12 pt-6 pb-4">
    <NSpin v-if="isFetchingCountryStats || isFetchingUserStats || !isFinishedCountryStats || !isFinishedUserStats" size="large" />

    <NAlert v-else-if="errorCountryStats || errorUserStats" title="Could not fetch data" type="error">
      Failure in retrieving user statistics
    </NAlert>

    <div v-else>
      <NPageHeader class="m-b-6">
        <!--  <template #avatar>
        <NAvatar src="@/assets/logo.png" />
      </template>  -->

        <template #title>
          Statistics for {{ chartLabels['sem-4'] }}
        </template>

        <NGrid :cols="5">
          <NGi>
            <NStatistic label="Number of interventions" :value="userStats['sem-4'].ninter" />
          </NGi>

          <NGi>
            <NStatistic label="Interventions with complications" :value="userStats['sem-4'].ninterWithCompl" />
          </NGi>

          <NGi>
            <NStatistic label="Unplanned interventions" :value="userStats['sem-4'].ninterUnplanned" />
          </NGi>

          <NGi>
            <NStatistic label="Autonomy level" :value="`${userStats['sem-4'].autonomy} / 3`" />
          </NGi>

          <NGi>
            <NStatistic label="Confidence level" :value="`${userStats['sem-4'].confidence} / 5`" />
          </NGi>
        </NGrid>
      </NPageHeader>

      <NPageHeader class="m-b-[20px]">
        <template #title>
          Global view
        </template>
      </NPageHeader>

      <div class="flex space-x-8">
        <div class="w-[600px]">
          <Bar
            id="compl"
            :options="getChartOptions('User interventions with complications')"
            :data="chartData.compl"
          />
        </div>
        <div style="width: 600px;">
          <Bar
            id="unplanned"
            :options="getChartOptions('User interventions unplanned')"
            :data="chartData.unplanned"
          />
        </div>
      </div>

      <div class="flex space-x-8">
        <div class="min-w-[600px]">
          <Line
            id="autonomy"
            :options="getChartOptions('User autonomy level', false)"
            :data="chartData.autonomy"
          />
        </div>
        <div style="width: 600px;">
          <Line
            id="confidence"
            :options="getChartOptions('User confidence level', false)"
            :data="chartData.confidence"
          />
        </div>
      </div>
    </div>
  </main>
</template>
