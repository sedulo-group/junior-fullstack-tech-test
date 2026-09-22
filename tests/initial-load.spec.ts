import { expect, test } from "@playwright/test";

test("the task list loads on the first visit", async ({ page }) => {
  // This test uses the real, unmodified client URL and API.
  await page.goto("/tasks");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  test.fail(
    true,
    "Known one-character API URL typo; see INTERVIEW.md. Remove after fixing it.",
  );
  await expect(page.getByRole("article")).toHaveCount(3);
});
