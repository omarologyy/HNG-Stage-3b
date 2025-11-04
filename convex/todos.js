// import { query, mutation } from "./_generated/server";

// export const getTodos = query(async ({ db }) => {
//   return await db.query("todos").collect();
// });

// export const createTodo = mutation(async ({ db }, { text }) => {
//   await db.insert("todos", {
//     text,
//     completed: false,
//     createdAt: Date.now(),
//   });
// });

// export const toggleTodo = mutation(async ({ db }, { id }) => {
//   const todo = await db.get(id);
//   await db.patch(id, { completed: !todo.completed });
// });

// export const deleteTodo = mutation(async ({ db }, { id }) => {
//   await db.delete(id);
// });

import { query, mutation } from "./_generated/server";

export const getTodos = query(async ({ db }) => {
  return await db.query("todos").collect();
});

export const createTodo = mutation(
  async ({ db }, { text, description, dueDate }) => {
    await db.insert("todos", {
      text,
      description,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    });
  }
);

export const toggleTodo = mutation(async ({ db }, { id }) => {
  const todo = await db.get(id);
  await db.patch(id, { completed: !todo.completed });
});

export const deleteTodo = mutation(async ({ db }, { id }) => {
  await db.delete(id);
});
