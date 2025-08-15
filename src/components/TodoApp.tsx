import type { Collection } from "@tanstack/react-db";
import type React from "react";
import type { FormEvent } from "react";
import { useState } from "react";

import type { SelectConfig, SelectTodo } from "@/db/validation";
import { getComplementaryColor } from "@/lib/color";

interface TodoAppProps {
  todos: Array<SelectTodo>;
  configData: Array<SelectConfig>;
  todoCollection: Collection<SelectTodo>;
  configCollection: Collection<SelectConfig>;
  title: string;
}

export function TodoApp({ todos, configData, todoCollection, configCollection, title }: TodoAppProps) {
  const [newTodo, setNewTodo] = useState("");

  // Define a type-safe helper function to get config values
  const getConfigValue = (key: string): string | undefined => {
    for (const config of configData) {
      if (config.key === key) {
        return config.value;
      }
    }
    return undefined;
  };

  // Define a helper function to update config values
  const setConfigValue = (key: string, value: string): void => {
    for (const config of configData) {
      if (config.key === key) {
        configCollection.update(config.id, (draft) => {
          draft.value = value;
        });
        return;
      }
    }

    // If the config doesn't exist yet, create it
    configCollection.insert({
      id: Math.round(Math.random() * 1000000),
      key,
      value,
      created_at: new Date(),
      updated_at: new Date(),
    });
  };

  const backgroundColor = getConfigValue("backgroundColor");
  const titleColor = getComplementaryColor(backgroundColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setConfigValue("backgroundColor", newColor);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const todo = newTodo.trim();
    setNewTodo("");

    if (todo) {
      todoCollection.insert({
        text: todo,
        completed: false,
        id: Math.round(Math.random() * 1000000),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <main className="flex h-dvh justify-center overflow-auto py-8" style={{ backgroundColor }}>
      <div className="w-[550px]">
        <h1 className="mb-4 text-center font-bold text-[70px]" style={{ color: titleColor }}>
          {title}
        </h1>

        <div className="flex justify-end py-4">
          <div className="flex items-center">
            <label
              htmlFor="colorPicker"
              className="mr-2 font-medium text-gray-700 text-sm"
              style={{ color: titleColor }}
            >
              Background Color:
            </label>
            <input
              type="color"
              id={`colorPicker-${Math.random()}`}
              value={backgroundColor}
              onChange={handleColorChange}
              className="cursor-pointer rounded border border-gray-300"
            />
          </div>
        </div>

        <div className="relative bg-white shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]">
          <form onSubmit={handleSubmit} className="relative">
            <button
              type="button"
              className="absolute h-full w-12 text-[#e6e6e6] text-[30px] hover:text-[#4d4d4d]"
              disabled={todos.length === 0}
              onClick={() => {
                const todosToToggle = activeTodos.length > 0 ? activeTodos : completedTodos;

                todoCollection.update(
                  todosToToggle.map((todo) => todo.id),
                  (drafts) =>
                    drafts.forEach((draft) => {
                      draft.completed = !draft.completed;
                    }),
                );
              }}
            >
              ❯
            </button>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="box-border h-[64px] w-full border-none pr-4 pl-[60px] font-light text-2xl shadow-[inset_0_-2px_1px_rgba(0,0,0,0.03)]"
            />
          </form>

          <ul className="list-none">
            {todos.map((todo) => (
              <li key={`todo-${todo.id}`} className="group relative border-[#ededed] border-b last:border-none">
                <div className="flex h-[58px] items-center gap-1.2 pl-[60px]">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      todoCollection.update(todo.id, (draft) => {
                        draft.completed = !draft.completed;
                      })
                    }
                    className="absolute left-[12px] size-[40px] cursor-pointer"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`block p-[15px] text-2xl transition-colors ${todo.completed ? "text-[#d9d9d9] line-through" : ""}`}
                  >
                    {todo.text}
                  </label>
                  <button
                    type="button"
                    onClick={() => todoCollection.delete(todo.id)}
                    className="absolute right-[20px] hidden text-[#cc9a9a] text-[30px] transition-colors hover:text-[#af5b5e] group-hover:block"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <footer className="flex h-[40px] items-center justify-between border-[#e6e6e6] border-t px-[15px] text-[#777] text-[14px]">
            <span>{`${activeTodos.length} ${activeTodos.length === 1 ? "item" : "items"} left`}</span>

            {completedTodos.length > 0 && (
              <button
                type="button"
                onClick={() => todoCollection.delete(completedTodos.map((todo) => todo.id))}
                className="hover:underline"
              >
                Clear completed
              </button>
            )}
          </footer>
        </div>
      </div>
    </main>
  );
}
