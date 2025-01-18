<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  startYear?: number
  activeDates: {
    date: string
    count: number
  }[]
}>()

interface DateItem {
  date: string
  day: number | null
  isEmpty: boolean
  color?: string
}

const weeks = ref<DateItem[][]>([])

const activeColor = ['#0e4429', '#006d32', '#26a641', '#39d353']

function getWeeksByStartYear(
  startYear: number,
  dateMap: Record<string, DateItem> = {},
) {
  const startOfYear = dayjs(`${startYear}-01-01`).startOf('year')
  const startOfDay = startOfYear.day()
  let isFirstStage = true

  const weeks: DateItem[][] = []
  let currentDate = startOfYear
  while (true) {
    const week: DateItem[] = []
    for (let i = isFirstStage ? startOfDay : 0; i < 7; i++) {
      const item: DateItem = {
        date: currentDate.format('YYYY-MM-DD'),
        day: currentDate.day(),
        isEmpty: false,
      }
      dateMap[item.date!] = item
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

function getWeeksByCurrentDay(dateMap: Record<string, DateItem> = {}) {
  let isFirstStage = true
  const currentDate = dayjs()
  const currentDay = currentDate.day()
  const startDate = currentDate.subtract(365, 'day')
  const startDateFormat = startDate.format('YYYY-MM-DD')
  let headDate = currentDate

  const weeks: DateItem[][] = []
  while (true) {
    const week: DateItem[] = []
    for (let i = isFirstStage ? currentDay : 6; i >= 0; i--) {
      const item: DateItem = {
        date: headDate.format('YYYY-MM-DD'),
        day: headDate.day(),
        isEmpty: false,
      }
      dateMap[item.date!] = item
      week.unshift(item)
      headDate = headDate.subtract(1, 'day')
    }
    isFirstStage = false
    weeks.unshift(week)
    if (headDate.isBefore(startDateFormat)) break
  }
  return weeks
}

interface MonthIndex {
  index: number
  month: string
}

const monthIndexes = ref<MonthIndex[]>([])

function getMonthIndexes(data: DateItem[][]) {
  const monthIndexes: MonthIndex[] = []
  data.forEach((week, index) => {
    const last = week[week.length - 1]
    if (last) {
      const month = dayjs(last.date!).format('MMM')
      if (!monthIndexes.find((i) => i.month === month)) {
        const maybeCancelItem = monthIndexes[monthIndexes.length - 1]
        if (maybeCancelItem && index - maybeCancelItem.index < 4) {
          monthIndexes.pop()
        }
        monthIndexes.push({
          index,
          month,
        })
      }
    }
  })
  return monthIndexes
}

function formatActiveDates() {
  const maxCount = Math.max(...props.activeDates.map((item) => item.count))
  const minCount = Math.min(...props.activeDates.map((item) => item.count))
  const dateMap: Record<string, DateItem> = {}
  let ret: DateItem[][] = []
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

  monthIndexes.value = getMonthIndexes(ret)
  console.log(monthIndexes)
}
watch(() => props, formatActiveDates, { immediate: true })
formatActiveDates()
</script>

<template>
  <div class="relative">
    <div
      v-for="item of monthIndexes"
      :key="item.month"
      class="absolute text-xs"
      :style="{ left: item.index * 14 + 32 + 'px', top: '-30px' }"
    >
      {{ item.month }}
    </div>
    <div class="absolute text-xs" style="top: 12px">Mon</div>
    <div class="absolute text-xs" style="top: 40px">Wed</div>
    <div class="absolute text-xs" style="top: 68px">Fri</div>
    <div class="ml-8 mt-[40px] flex gap-[2px]">
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="week of weeks" class="flex flex-col gap-[2px]">
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
