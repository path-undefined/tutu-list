<script setup lang="ts">
import { ref, type Ref, onBeforeMount } from "vue";
import TodoService, { type Todo } from "@/services/TodoService";

import TodoList from "@/components/TodoList.vue";

const root: Ref<Todo | null> = ref(null);

onBeforeMount(() => {
  TodoService.loadTodos();
  root.value = TodoService.getTodos();
  console.log("All TODOs loaded");
});

onbeforeunload = () => {
  TodoService.saveTodos();
  console.log("All TODOs saved");
};
</script>

<template>
  <main>
    <h1>TUTU List</h1>
    <todo-list
      v-if="root"
      :parent="root"
      :todos="root.children"
    />
  </main>
</template>
