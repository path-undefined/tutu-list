<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import TodoService, { type Todo } from "@/services/TodoService";
import TodoList from "@/components/TodoList.vue";

const props = defineProps<{
  parent: Todo,
  todo: Todo,
}>();

const emit = defineEmits<{
  updateList: [],
  updateParent: [],
}>();

const expanded: Ref<boolean> = ref(false);
const editing: Ref<boolean> = ref(false);
  const newContent: Ref<string> = ref("");
const displayedTodo: Ref<Todo> = ref(props.todo);

watch(props.todo, () => {
  displayedTodo.value = props.todo;
});

function onInputItemDoneChange() {
  TodoService.updateTodoDone(displayedTodo.value.id, !displayedTodo.value.done);
  updateData();
  updateParent();
}

function onButtonExpandClick() {
  expanded.value = !expanded.value;
}

function onButtonEditClick() {
  editing.value = true;
  newContent.value = displayedTodo.value.content;
}

function onInputNewContentEnterKeyup () {
  if (!newContent.value.trim()) {
    return;
  }

  TodoService.updateTodoContent(displayedTodo.value.id, newContent.value.trim());

  newContent.value = "";
  editing.value = false;

  updateData();
}

function onButtonDeleteClick() {
  TodoService.deleteTodo(displayedTodo.value.id);
  updateList();
  updateParent();
}

function updateData() {
  displayedTodo.value = TodoService.getTodo(displayedTodo.value.id)!;
}

function updateList() {
  emit("updateList");
}

function updateParent() {
  emit("updateParent");
}
</script>

<template>
  <div class="item-container">
    <div
      v-if="editing"
      class="item-editor"
    >
      <input
        class="input-new-content"
        v-model="newContent"
        placeholder="Type something, and press Enter to add an TODO item"
        @keyup.enter="onInputNewContentEnterKeyup"
      />
    </div>
    <div
      v-else
      class="item"
    >
      <span class="item-content-area">
        <label>
          <input
            class="input-item-done"
            type="checkbox"
            :checked="displayedTodo.done"
            @change="onInputItemDoneChange"
          />
          {{ displayedTodo.content }}
          ({{ displayedTodo.children.filter((child) => child.done).length }}/{{ displayedTodo.children.length }})
        </label>
      </span>
      <span class="item-action-area">
        <button
          class="button-expand button-action"
          @click="onButtonExpandClick"
        >{{ expanded ? "-" : "+" }}</button>
        <button
          class="button-edit button-action"
          @click="onButtonEditClick"
        >Edit</button>
        <button
          class="button-delete button-action"
          @click="onButtonDeleteClick"
        >Del</button>
      </span>
    </div>

    <todo-list
      v-if="expanded"
      class="sublist"
      :parent="displayedTodo"
      :todos="displayedTodo.children"
      @updateParent="updateData"
    />
  </div>
</template>

<style scoped>
.item {
  padding: 4px;
}
.item:hover {
  background-color: lightsalmon;
}

.item-action-area {
  padding-left: 12px;
}

.button-action {
  font-size: 60%;
}
.input-new-content {
  width: 400px;
}
</style>