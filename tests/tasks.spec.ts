import { expect, test } from "@playwright/test";

test("search, filter, create, navigate, update, reload and delete", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });

  await page.goto("/");
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByText("3 tasks shown · 1 of 3 complete")).toBeVisible();
  await page.getByLabel("Search tasks").fill("welcome");
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(1);
  await page.getByLabel("Search tasks").fill("missing title");
  await expect(page.getByRole("heading", { name: "No matching tasks" })).toBeVisible();
  await page.getByLabel("Search tasks").fill("");
  await page.getByLabel("Filter by status").selectOption("done");
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(1);
  await page.getByLabel("Filter by status").selectOption("all");

  await page.getByRole("navigation").getByRole("link", { name: "Add task" }).click();
  await expect(page.getByLabel("Title", { exact: false })).toBeFocused();
  await page.getByLabel("Title", { exact: false }).fill("Interview browser task");
  await page.getByLabel("Description").fill("Created through the real NestJS API.");
  await page.getByRole("button", { name: "Create task" }).click();
  await expect(page.getByRole("heading", { name: "Interview browser task" })).toBeVisible();
  const detailUrl = page.url();
  await expect(page.getByRole("button", { name: "Save status" })).toBeDisabled();
  await page.getByLabel("Status", { exact: true }).selectOption("done");
  await page.getByRole("button", { name: "Save status" }).click();
  await expect(page.getByRole("status")).toHaveText("Status saved.");
  await page.reload();
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue("done");
  await page.getByRole("link", { name: "Back to tasks" }).click();
  await expect(page.getByText("4 tasks shown · 2 of 4 complete")).toBeVisible();
  await page.getByRole("link", { name: "Interview browser task", exact: true }).click();
  await expect(page).toHaveURL(detailUrl);

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Delete task" }).click();
  await expect(page.getByRole("heading", { name: "Interview browser task" })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete task" }).click();
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByText("3 tasks shown · 1 of 3 complete")).toBeVisible();
  await expect(page.getByRole("link", { name: "Interview browser task", exact: true })).toHaveCount(0);
  expect(browserErrors).toEqual([]);
});

test("loading, API error, retry and an empty list", async ({ page }) => {
  let release!: () => void;
  const hold = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/tasks", async (route) => {
    await hold;
    await route.fulfill({ status: 503, json: { message: "API temporarily unavailable" } });
  });
  await page.goto("/tasks");
  await expect(page.getByRole("status")).toHaveText("Loading tasks…");
  release();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("API temporarily unavailable");
  await page.unroute("**/api/tasks");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("3 tasks shown · 1 of 3 complete")).toBeVisible();
  await page.route("**/api/tasks", (route) => route.fulfill({ json: [] }));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your first task starts here" })).toBeVisible();
});

test("failed create keeps form values and allows a retry", async ({ page }) => {
  await page.goto("/tasks/new");
  await page.getByLabel("Title", { exact: false }).fill("Keep my draft");
  await page.getByLabel("Description").fill("Do not lose this text.");
  await page.route("**/api/tasks", (route) => route.fulfill({ status: 500, json: { message: "Could not save task" } }));
  await page.getByRole("button", { name: "Create task" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Could not save task");
  await expect(page.getByLabel("Title", { exact: false })).toHaveValue("Keep my draft");
  await expect(page.getByLabel("Description")).toHaveValue("Do not lose this text.");
  await expect(page.getByRole("button", { name: "Create task" })).toBeEnabled();
});

test("failed status update keeps the saved status, and missing tasks explain the error", async ({ page }) => {
  await page.goto("/tasks/1");
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue("todo");
  await page.route("**/api/tasks/1", (route) => route.fulfill({ status: 500, json: { message: "Could not save status" } }));
  await page.getByLabel("Status", { exact: true }).selectOption("done");
  await page.getByRole("button", { name: "Save status" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Could not save status");
  await expect(page.getByText("To do", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Save status" })).toBeEnabled();
  await page.goto("/tasks/missing");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Task not found");
  await expect(page.getByRole("link", { name: "Back to tasks" })).toBeVisible();
});

test("mobile layout fits and all three pages render", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/tasks", "/tasks/new", "/tasks/1"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Loading tasks…")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.screenshot({ path: "test-results/mobile-detail.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/tasks");
  await expect(page.getByText("3 tasks shown · 1 of 3 complete")).toBeVisible();
  await page.screenshot({ path: "test-results/desktop-tasks.png", fullPage: true });
});
