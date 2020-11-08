import { writable } from "svelte/store";

export const user = writable(
  process.browser ? JSON.parse(localStorage.getItem("user")) : null
);

user.subscribe((val) => {
  if (process.browser) {
    localStorage.setItem("user", JSON.stringify(val));
  }
});
