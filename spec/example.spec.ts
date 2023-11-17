import { test, expect } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("/")

  // Expect a title "to contain" a substring.
  await expect(page.locator("h1")).toHaveText(/Some php exercises/)
})

test("current time page", async ({ page }) => {
  await page.goto("/getCurrentTime.php")
  const h1 = page.locator("h1")

  const time = new Date().toISOString()
  await expect(h1).toBeVisible()
  await expect(h1).toHaveText(time.split(".")[0].split("T").join(" "))
})

test("get query parameters", async ({ page }) => {
  const name = "John"
  const age = 30
  await page.goto(`/queryParameterDisplay.php?name=${name}&age=${age}`)
  const h1 = page.locator("h1")
  const ul = page.locator("ul")

  await expect(h1).toBeVisible()
  await expect(h1).toHaveText(`${name} is ${age} years old`)
  await expect(ul).toHaveCount(0)
})

test("no query parameters", async ({ page }) => {
  await page.goto(`/queryParameterDisplay.php`)
  const h1 = page.locator("h1")
  const li = page.locator("li")

  await expect(h1).toBeVisible()
  await expect(h1).toHaveText(`No query parameters found`)
  await expect(li).toHaveCount(2)
  await expect(li.first()).toHaveText(`Missing name`)
  await expect(li.last()).toHaveText(`Missing age`)
})

test("missing age query parameter", async ({ page }) => {
  await page.goto(`/queryParameterDisplay.php?name=Toto`)
  const h1 = page.locator("h1")
  const li = page.locator("li")

  await expect(h1).toBeVisible()
  await expect(h1).toHaveText(`No query parameters found`)
  await expect(li).toHaveCount(1)
  await expect(li.last()).toHaveText(`Missing age`)
})

test("missing name query parameter", async ({ page }) => {
  await page.goto(`/queryParameterDisplay.php?age=12`)
  const h1 = page.locator("h1")
  const li = page.locator("li")

  await expect(h1).toBeVisible()
  await expect(h1).toHaveText(`No query parameters found`)
  await expect(li).toHaveCount(1)
  await expect(li.last()).toHaveText(`Missing name`)
})
