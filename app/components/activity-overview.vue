<script setup lang="ts">
import dayjs from 'dayjs'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const activeColor = ['#0e4429', '#006d32', '#26a641', '#39d353']
const activeDates = [
  { date: '2020-01-01', count: 1 },
  { date: '2020-01-06', count: 1 },
  { date: '2020-01-07', count: 2 },
  { date: '2020-01-22', count: 4 },
  { date: '2020-02-2', count: 5 },
  { date: '2020-02-12', count: 1 },
  { date: '2020-02-22', count: 1 },
  { date: '2020-03-04', count: 4 },
  { date: '2020-03-17', count: 1 },
]

function getWeeksByStartYear(
  startYear: number,
  dateMap: Record<string, Record<string, any>> = {},
) {
  const startOfYear = dayjs(`${startYear}-01-01`).startOf('year')
  const startOfDay = startOfYear.day()
  let isFirstStage = true

  const weeks = []
  let currentDate = startOfYear
  while (true) {
    const week = []
    for (let i = isFirstStage ? startOfDay : 0; i < 7; i++) {
      const item = {
        date: currentDate.format('YYYY-MM-DD'),
        day: currentDate.day(),
        isEmpty: false,
      }
      dateMap[item.date] = item
      week.push(item)
      currentDate = currentDate.add(1, 'day')
      if (currentDate.year() === startYear + 1) break
    }

    isFirstStage = false
    weeks.push(week)
    if (currentDate.year() === startYear + 1) break
  }
  const firstWeek = weeks[0]
  if (firstWeek) {
    const firstWeekLen = firstWeek.length
    if (firstWeekLen != 7) {
      firstWeek.unshift(
        ...Array(7 - firstWeekLen).fill({
          date: null,
          day: null,
          isEmpty: true,
        }),
      )
    }
  }
  return weeks
}
const weeks = ref([]) as any
function formatActiveDates() {
  const maxCount = Math.max(...activeDates.map((item) => item.count))
  const minCount = Math.min(...activeDates.map((item) => item.count))
  const dateMap: Record<string, Record<string, any>> = {}
  const x = getWeeksByStartYear(2020, dateMap)
  activeDates.forEach((i) => {
    const target = dateMap[i.date]
    const normalizedCount = (i.count - minCount) / (maxCount - minCount)
    const colorIndex = Math.floor(normalizedCount * (activeColor.length - 1)) // 映射到颜色数组的索引

    if (target) {
      target.color = activeColor[colorIndex]
    }
  })
  debugger
  weeks.value = x
}
formatActiveDates()
</script>

<template>
  <div>
    <div class="flex gap-[3px]">
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="week of weeks" class="flex flex-col gap-[3px]">
        <div
          v-for="day of week"
          :key="day.date"
          :title="day.date"
          class="size-3 rounded-sm bg-[#161b22]"
          :class="{ invisible: day.isEmpty }"
          :style="{ backgroundColor: day.color }"
        ></div>
      </div>
    </div>
  </div>
</template>
