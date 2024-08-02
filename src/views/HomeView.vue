<script setup lang="ts">
import { ref, onBeforeMount } from "vue";

import TodoService, { type Todo } from "@/services/TodoService";

import TodoList from "@/components/TodoList.vue";

const root = ref<Todo>(TodoService.getTodos());

onBeforeMount(() => {
  TodoService.loadTodos();
  root.value = TodoService.getTodos();
});

onbeforeunload = () => {
  TodoService.saveTodos();
};

const onSaveButtonClick = () => {
  TodoService.saveTodos();
};

const onDownloadButtonClick = () => {
  const todosJson = TodoService.getTodosAsBase64String();

  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(todosJson));
  element.setAttribute("download", `tutu-list-${Date.now()}`);
  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const onUploadButtonClick = async () => {
  const element = document.createElement("input");
  element.setAttribute("type", "file");
  element.style.display = "none";

  const fileContentPromise = new Promise((resolve, reject) => {
    element.addEventListener("change", (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "utf8");
        reader.onload = (event) => {
          resolve(event.target!.result);
        };
        reader.onerror = () => {
          reject();
        };
      }
    });
  });

  document.body.appendChild(element);

  element.click();
  const fileContent = (await fileContentPromise) as string;

  document.body.removeChild(element);

  TodoService.loadTodosFromBase64String(fileContent);
  root.value = TodoService.getTodos();
};
</script>

<template>
  <main>
    <h1>TUTU List</h1>
    <div>
      <button @click="onSaveButtonClick">
        Save
      </button>
      <button @click="onDownloadButtonClick">
        Download as File
      </button>
      <button @click="onUploadButtonClick">
        Upload from File
      </button>
    </div>
    <todo-list
      :parent="root"
      :todos="root.children"
    />
  </main>
</template>
