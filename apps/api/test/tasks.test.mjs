import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../dist/app.js";

let app;
let baseUrl;
before(async () => {
  app = await createApp();
  await app.listen(0, "127.0.0.1");
  baseUrl = await app.getUrl();
});
after(async () => { await app?.close(); });

function request(path, method, body) {
  if (!method) return fetch(`${baseUrl}${path}`);
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body !== undefined) options.body = JSON.stringify(body);
  return fetch(`${baseUrl}${path}`, options);
}

test("lists seeded tasks and creates, reads, updates and deletes a task", async () => {
  const list = await request("/tasks");
  assert.equal(list.status, 200);
  assert.equal((await list.json()).length, 3);

  const created = await request("/tasks", "POST", { title: "  Interview task  ", description: "  Some context  " });
  assert.equal(created.status, 201);
  const task = await created.json();
  assert.equal(task.title, "Interview task");
  assert.equal(task.description, "Some context");
  assert.equal(task.status, "todo");
  assert.equal((await (await request(`/tasks/${task.id}`)).json()).id, task.id);

  const updated = await request(`/tasks/${task.id}`, "PATCH", { status: "done" });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).status, "done");
  assert.equal((await (await request(`/tasks/${task.id}`)).json()).status, "done");

  const deleted = await request(`/tasks/${task.id}`, "DELETE");
  assert.equal(deleted.status, 204);
  assert.equal(await deleted.text(), "");
  assert.equal((await request(`/tasks/${task.id}`)).status, 404);
});

test("rejects blank, missing, non-string, oversized and unexpected input", async () => {
  for (const body of [
    { title: "   ", description: "" },
    { description: "" },
    { title: 123, description: "" },
    { title: "x".repeat(81), description: "" },
    { title: "Valid", description: "x".repeat(501) },
    { title: "Valid", description: "", status: "done" },
    { title: "Valid", description: null },
  ]) {
    assert.equal((await request("/tasks", "POST", body)).status, 400);
  }
  assert.equal((await request("/tasks/1", "PATCH", { status: "invalid" })).status, 400);
  assert.equal((await request("/tasks/1", "PATCH", {})).status, 400);
  assert.equal((await request("/tasks/1", "PATCH", { status: "done", title: "Changed" })).status, 400);
});

test("returns 404 for reads, updates and deletes of unknown tasks", async () => {
  assert.equal((await request("/tasks/missing")).status, 404);
  assert.equal((await request("/tasks/missing", "PATCH", { status: "done" })).status, 404);
  assert.equal((await request("/tasks/missing", "DELETE")).status, 404);
});
