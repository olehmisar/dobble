import App from "./App.svelte";
import "./db";

var app = new App({
  target: document.getElementById("app")!,
});

export default app;
