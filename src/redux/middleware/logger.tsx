import { Middleware } from "@reduxjs/toolkit";

const logger: Middleware = (store) => (next) => (action) => {
  console.log("Dispatching", action);
  const results = next(action);
  console.log("Next State", store.getState());
  return results;
};

export default logger;
