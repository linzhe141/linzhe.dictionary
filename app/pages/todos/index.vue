<script setup lang="ts">
definePageMeta({
  layout: 'root-layout',
})
const loading = ref(false)
const newTodo = ref('')
const newTodoInput = ref(null)

const { data: todos, refresh } = await useFetch('/api/todos')

async function addTodo() {
  if (!newTodo.value.trim()) return

  loading.value = true

  const todo = await $fetch('/api/todos', {
    method: 'POST',
    body: {
      content: newTodo.value,
      completed: 0,
    },
  })
  todos.value!.push(todo)
  await refresh()
  newTodo.value = ''
  nextTick(() => {
    // @ts-expect-error
    newTodoInput.value?.input?.focus()
  })
  loading.value = false
}
// @ts-expect-error
async function toggleTodo(todo) {
  todo.completed = Number(!todo.completed)
  await $fetch(`/api/todos/${todo.id}`, {
    method: 'PATCH',
    body: {
      completed: todo.completed,
    },
  })
  await refresh()
}
// @ts-expect-error
async function deleteTodo(todo) {
  await $fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
  todos.value = todos.value!.filter((t) => t.id !== todo.id)
  await refresh()
  // @ts-expect-error
  toast.add({ title: `Todo "${todo.title}" deleted.` })
}
</script>

<template>
  <div class="p-2">
    <UCard @submit.prevent="addTodo">
      <template #header>
        <h3 class="text-lg font-semibold leading-6">Todo List</h3>
      </template>

      <div class="flex items-center gap-2">
        <UInput
          ref="newTodoInput"
          v-model="newTodo"
          name="todo"
          :disabled="loading"
          class="flex-1"
          placeholder="Make a Nuxt demo"
          autocomplete="off"
          autofocus
          :ui="{ wrapper: 'flex-1' }"
        />

        <UButton
          type="submit"
          icon="i-heroicons-plus-20-solid"
          :loading="loading"
          :disabled="newTodo.trim().length === 0"
        />
      </div>

      <ul class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="todo of todos"
          :key="todo.id"
          class="flex items-center gap-4 py-2"
        >
          <span
            class="flex-1 font-medium"
            :class="[todo.completed ? 'text-gray-500 line-through' : '']"
            >{{ todo.content }}</span
          >

          <UToggle
            :model-value="Boolean(todo.completed)"
            @update:model-value="toggleTodo(todo)"
          />

          <UButton
            color="red"
            variant="soft"
            size="2xs"
            icon="i-heroicons-x-mark-20-solid"
            @click="deleteTodo(todo)"
          />
        </li>
      </ul>
    </UCard>
  </div>
</template>
