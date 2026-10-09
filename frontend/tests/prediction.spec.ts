import { test, expect } from "@playwright/test";

test("vehicle form reaches the real API and shows the submitted result", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByLabel("Brand", { exact: true })).toBeVisible();
  await page.screenshot({
    path: `test-results/landing-${test.info().project.name}.png`,
    style: "nextjs-portal { display: none; }",
  });
  await page.getByRole("button", { name: "Predict price" }).click();
  await expect(page.getByTestId("predicted-price")).toContainText("95,724");
  await expect(
    page.getByRole("heading", { name: "Your submitted vehicle" }),
  ).toBeVisible();
  await page.getByLabel("Brand", { exact: true }).selectOption("dacia");
  await expect(page.getByLabel("Model", { exact: true })).not.toHaveValue(
    "clio",
  );
  await page.getByLabel("Model", { exact: true }).selectOption("duster");
  await page.getByRole("button", { name: "Predict price" }).click();
  await expect(page.locator(".result-car")).toContainText("Dacia Duster");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".prediction-grid")
    .screenshot({
      path: `test-results/prediction-panel-${test.info().project.name}.png`,
      style: "nextjs-portal { display: none; }",
    });
  await page.screenshot({
    path: `test-results/prediction-${test.info().project.name}.png`,
    fullPage: true,
    style: "nextjs-portal { display: none; }",
  });
});

test("numeric constraints prevent an invalid form submission", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Mileage (km)").fill("-1");
  await page.getByRole("button", { name: "Predict price" }).click();
  expect(
    await page
      .getByLabel("Mileage (km)")
      .evaluate((input: HTMLInputElement) => input.validity.valid),
  ).toBe(false);
  await expect(page.getByTestId("predicted-price")).toHaveCount(0);
});

test("unavailable prediction is readable and retry succeeds", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByLabel("Brand", { exact: true })).toBeVisible();
  await page.route("**/predict", (route) => route.abort());
  await page.getByRole("button", { name: "Predict price" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "could not reach",
  );
  await expect(
    page.getByRole("button", { name: "Predict price" }),
  ).toBeEnabled();
  await page.unroute("**/predict");
  await page.getByRole("button", { name: "Predict price" }).click();
  await expect(page.getByTestId("predicted-price")).toBeVisible();
});

test("catalog outage offers a working retry", async ({ page }) => {
  await page.route("**/metadata", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "could not reach",
  );
  await page.unroute("**/metadata");
  await page.getByRole("button", { name: "Retry connection" }).click();
  await expect(page.getByLabel("Brand", { exact: true })).toBeVisible();
});

test("pending request exposes a loading state and disables resubmission", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByLabel("Brand", { exact: true })).toBeVisible();
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/predict", async (route) => {
    await pending;
    await route.continue();
  });
  await page.getByRole("button", { name: "Predict price" }).click();
  await expect(
    page.getByRole("button", { name: "Estimating your vehicle" }),
  ).toBeDisabled();
  release();
  await expect(page.getByTestId("predicted-price")).toBeVisible();
});
