<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  startYear?: number
  activeDates: {
    date: string
    count: number
  }[]
}>()

interface clickActiveDateParams {
  date: string
  count: number
}

defineEmits<{
  clickActiveDate: [data: clickActiveDateParams]
}>()

interface DateItem {
  date: string | null
  day: number | null
  count: number
  isEmpty: boolean
  color?: string
}

const weeks = ref<DateItem[][]>([])

const activeColor = ['#0e4429', '#006d32', '#26a641', '#39d353']
const DAYS_IN_WEEK = 7

function createDateItem(date: dayjs.Dayjs, isEmpty = false): DateItem {
  return {
    date: isEmpty ? null : date.format('YYYY-MM-DD'),
    day: isEmpty ? null : date.day(),
    count: 0,
    isEmpty,
  }
}

function getWeeksByStartYear(
  startYear: number,
  dateMap: Record<string, DateItem> = {},
) {
  let isFirstStage = true
  const startYearDate = dayjs(`${startYear}-01-01`).startOf('year')
  const startYearDay = startYearDate.day()

  const weeks: DateItem[][] = []
  let currentDate = startYearDate
  while (true) {
    const week: DateItem[] = []
    for (let i = isFirstStage ? startYearDay : 0; i < DAYS_IN_WEEK; i++) {
      const item = createDateItem(currentDate)
      dateMap[item.date!] = item
      week.push(item)
      currentDate = currentDate.add(1, 'day')
      if (currentDate.year() === startYear + 1) break
    }

    if (isFirstStage) isFirstStage = false
    weeks.push(week)
    if (currentDate.year() === startYear + 1) break
  }

  const firstWeek = weeks[0]
  if (firstWeek && firstWeek.length < DAYS_IN_WEEK) {
    firstWeek.unshift(
      ...Array(DAYS_IN_WEEK - firstWeek.length).fill(
        createDateItem(currentDate, true),
      ),
    )
  }

  return weeks
}

function getWeeksByCurrentDay(dateMap: Record<string, DateItem> = {}) {
  let isFirstStage = true
  const currentDate = dayjs()
  const currentDay = currentDate.day()
  const startDate = currentDate.subtract(365, 'day')
  let headDate = currentDate

  const weeks: DateItem[][] = []
  while (true) {
    const week: DateItem[] = []
    for (let i = isFirstStage ? currentDay : DAYS_IN_WEEK - 1; i >= 0; i--) {
      const item = createDateItem(headDate)
      dateMap[item.date!] = item
      week.unshift(item)
      headDate = headDate.subtract(1, 'day')
    }
    if (isFirstStage) isFirstStage = false
    weeks.unshift(week)
    if (headDate.isBefore(startDate)) break
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
      if (!monthIndexes.some((i) => i.month === month)) {
        const maybeCancelItem = monthIndexes[monthIndexes.length - 1]
        if (maybeCancelItem && index - maybeCancelItem.index < 4) {
          monthIndexes.pop()
        }
        monthIndexes.push({ index, month })
      }
    }
  })
  return monthIndexes
}

function formatActiveDates() {
  // if (props.activeDates.length === 0) return

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
    const colorIndex = isNaN(normalizedCount)
      ? activeColor.length - 1
      : Math.floor(normalizedCount * (activeColor.length - 1))
    if (target) {
      target.color = activeColor[colorIndex]
      target.count = i.count
    }
  })

  weeks.value = ret
  monthIndexes.value = getMonthIndexes(ret)
}

watch([() => props.activeDates, () => props.startYear], formatActiveDates, {
  immediate: true,
})
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
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <div
          v-for="day of week.filter((i) => i.isEmpty)"
          class="size-3 rounded-sm bg-[#161b22]"
          :class="{ invisible: day.isEmpty }"
          :style="{ backgroundColor: day.color }"
        ></div>
        <UTooltip
          v-for="day of week.filter((i) => !i.isEmpty)"
          :key="day.date!"
          :popper="{ placement: 'top' }"
          @click="
            () =>
              day.count &&
              $emit('clickActiveDate', {
                date: day.date!,
                count: day.count,
              })
          "
        >
          <template #text>
            <span class="italic">{{ day.date! }}</span>
            <span class="italic"> count: {{ day.count }}</span>
          </template>
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
