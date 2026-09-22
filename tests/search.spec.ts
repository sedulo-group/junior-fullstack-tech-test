import { expect, test } from "@playwright/test";

test("typing a search immediately filters task cards", async ({ page }) => {
  await page.goto("/tasks");
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByLabel("Search tasks").fill("welcome");

  // Intentionally failing interview exercise; setup failures must still fail CI.
  test.fail(
    true,
    "Known search defect documented in INTERVIEW.md. Remove after fixing it.",
  );
  await expect(page.getByRole("article")).toHaveCount(1);
});
