<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import TodoService, { type Todo } from "@/services/TodoService";
import TodoItem from "@/components/TodoItem.vue";

const props = defineProps<{
  parent: Todo,
  todos: Todo[],
}>();

const emit = defineEmits<{
  updateParent: [],
}>();

const displayedTodos: Ref<Todo[]> = ref(props.todos);
const newContent: Ref<string> = ref("");

watch(props.todos, () => {
  displayedTodos.value = props.todos;
});

function onInputNewContentEnterKeyup () {
  if (!newContent.value.trim()) {
    return;
  }

  const newTodo: Todo = {
    id: Date.now().toString(),
    content: newContent.value.trim(),
    children: [],
    done: false,
  };

  TodoService.addTodo(props.parent.id, newTodo);

  newContent.value = "";

  updateData();
  updateParent();
}

function updateData() {
  displayedTodos.value = TodoService.getTodo(props.parent.id)?.children ?? [];
}

function updateParent() {
  emit("updateParent");
}
</script>

<template>
  <ul class="list">
    <li
      v-for="todo of displayedTodos"
      :key="todo.id"
      class="list-item"
    >
      <todo-item
        :parent="parent"
        :todo="todo"
        @updateList="updateData"
        @updateParent="updateParent"
      />
    </li>
    <li class="list-item">
      <input
        class="input-new-content"
        v-model="newContent"
        placeholder="Type something, and press Enter to add an TODO item"
        @keyup.enter="onInputNewContentEnterKeyup"
      />
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style-type: none;
  padding-left: 16px;
}
.list-item {
  margin: 4px 0;
}

.input-new-content {
  width: 400px;
}
</style>