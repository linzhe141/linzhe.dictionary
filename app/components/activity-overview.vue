<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  startYear?: number
  activeDates: {
    date: string
    count: number
  }[]
}>()
// const months = [
//   'Jan',
//   'Feb',
//   'Mar',
//   'Apr',
//   'May',
//   'Jun',
//   'Jul',
//   'Aug',
//   'Sep',
//   'Oct',
//   'Nov',
//   'Dec',
// ]
// const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const weeks = ref([]) as any

const activeColor = ['#0e4429', '#006d32', '#26a641', '#39d353']

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

function getWeeksByCurrentDay(
  dateMap: Record<string, Record<string, any>> = {},
) {
  const currentDate = dayjs()
  const currentDateFormat = currentDate.format('YYYY-MM-DD')
  const currentDateDay = currentDate.day()

  const startDate = currentDate.subtract(365, 'day')
  let headDate = startDate

  const weeks = []
  while (true) {
    const week = []
    for (let i = 0; i < 7; i++) {
      const item = {
        date: headDate.format('YYYY-MM-DD'),
        day: headDate.day(),
      }
      dateMap[item.date] = item
      week.push(item)
      headDate = headDate.add(1, 'day')
      if (headDate.format('YYYY-MM-DD') === currentDateFormat) break
    }

    weeks.push(week)
    if (headDate.format('YYYY-MM-DD') === currentDateFormat) break
  }
  const lastWeek = weeks[weeks.length - 1]
  if (lastWeek) {
    lastWeek.push({
      date: currentDateFormat,
      day: currentDateDay,
    })
  }
  return weeks
}

function formatActiveDates() {
  const maxCount = Math.max(...props.activeDates.map((item) => item.count))
  const minCount = Math.min(...props.activeDates.map((item) => item.count))
  const dateMap: Record<string, Record<string, any>> = {}
  let ret = [] as any
  if (props.startYear) {
    ret = getWeeksByStartYear(props.startYear, dateMap)
  } else {
    ret = getWeeksByCurrentDay(dateMap)
  }
  props.activeDates.forEach((i) => {
    const target = dateMap[i.date]
    const normalizedCount = (i.count - minCount) / (maxCount - minCount)
    const colorIndex = Math.floor(normalizedCount * (activeColor.length - 1))
    if (target) {
      target.color = activeColor[colorIndex]
    }
  })
  weeks.value = ret
}
watch(() => props, formatActiveDates, { immediate: true })
formatActiveDates()
</script>

<template>
  <div>
    <div class="flex gap-[3px]">
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="week of weeks" class="flex flex-col gap-[3px]">
        <UTooltip
          v-for="day of week"
          :key="day.date"
          :text="day.date"
          :popper="{ placement: 'top' }"
        >
          <div
            class="size-3 rounded-sm bg-[#161b22]"
            :class="{ invisible: day.isEmpty }"
            :style="{ backgroundColor: day.color }"
          ></div>
        </UTooltip>
      </div>
    </div>
  </div>
</template>
