export type Todo = {
  id: string;
  content: string;
  children: Todo[];
  done: boolean;
};

export class TodoService {
  private static LOCAL_STORAGE_KEY = "tutu-list__todos";
  private static ROOT_ID = "root";

  private root: Todo;

  public constructor() {
    this.root = {
      id: TodoService.ROOT_ID,
      content: "",
      children: [],
      done: false,
    };
  }

  public loadTodos() {
    const rootJson = localStorage.getItem(TodoService.LOCAL_STORAGE_KEY);
    if (!rootJson) {
      return;
    }

    this.root = JSON.parse(rootJson);
  }

  public saveTodos() {
    const rootJson = JSON.stringify(this.root);
    localStorage.setItem(TodoService.LOCAL_STORAGE_KEY, rootJson);
  }

  public loadTodosFromBase64String(base64: string) {
    this.root = JSON.parse(escape(atob(base64)));
  }

  public getTodosAsBase64String(): string {
    return btoa(unescape(JSON.stringify(this.root)));
  }

  public addTodo(parentId: string, todo: Todo) {
    const parent = this.searchTodoById(parentId);
    if (!parent) {
      throw Error(`Parent TODO item with ID "${parentId}" doesn't exist.`);
    }

    parent.children.push(todo);
  }

  public getTodos(): Todo {
    return this.deepClone(this.root);
  }

  public getTodo(id: string): Todo | null {
    return this.deepClone(this.searchTodoById(id));
  }

  public updateTodoContent(id: string, content: string) {
    const existingTodo = this.searchTodoById(id);
    if (!existingTodo) {
      throw Error(`TODO item with ID "${id}" doesn't exist.`);
    }

    existingTodo.content = content;
  }

  public updateTodoDone(id: string, done: boolean) {
    const existingTodo = this.searchTodoById(id);
    if (!existingTodo) {
      throw Error(`TODO item with ID "${id}" doesn't exist.`);
    }

    existingTodo.done = done;
  }

  public deleteTodo(id: string) {
    const parent = this.searchParentById(id);
    if (!parent) {
      throw Error(`Parent for TODO item with ID "${id}" doesn't exist.`);
    }

    parent.children = parent.children.filter((child) => child.id !== id);
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private searchParentById(id: string): Todo | null {
    const searchRecursively: ((todo: Todo) => Todo | null) = (todo: Todo) => {
      for (const child of todo.children) {
        if (child.id === id) {
          return todo;
        }

        const result = searchRecursively(child);
        if (result) {
          return result;
        }
      }

      return null;
    };

    return searchRecursively(this.root);
  }

  private searchTodoById(id: string): Todo | null {
    const searchRecursively: ((todo: Todo) => Todo | null) = (todo: Todo) => {
      if (todo.id === id) {
        return todo;
      }

      for (const child of todo.children) {
        const result = searchRecursively(child);
        if (result) {
          return result;
        }
      }

      return null;
    };

    return searchRecursively(this.root);
  }
}

export default new TodoService();
