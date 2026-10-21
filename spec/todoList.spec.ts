import { randomUUID } from 'node:crypto'
import { expect, type Page, test } from '@playwright/test'

// Tests run in parallel against the same database, so each test works on
// todos with a unique name instead of relying on what is already stored
const uniqueName = (prefix: string) => `${prefix} ${randomUUID()}`

// Dates are computed in UTC, like the PHP server in the docker container
const isoDate = (offsetDays = 0) => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + offsetDays)
  return date.toISOString().split('T')[0]
}

const submitTodo = async (page: Page, name: string, date: string) => {
  await page.goto('/writeTodoToDatabase.php')
  const form = page.locator('form')
  await form.locator('input[name="name"]').fill(name)
  await form.locator('input[name="date"]').fill(date)
  // Skip browser validation (required, min...) to test the server validation
  await form.evaluate((element: HTMLFormElement) => {
    element.noValidate = true
  })
  await form.locator('button[type="submit"]').click()
}

const createTodo = async (page: Page, name: string, date: string) => {
  await submitTodo(page, name, date)
  await page.waitForURL('/displayAllTodosFromDatabase.php')
}

const expectTodoNotSaved = async (page: Page, name: string) => {
  await page.goto('/displayAllTodosFromDatabase.php')
  await expect(page.locator('li').filter({ hasText: name })).toHaveCount(0)
}

test('create a new todo', async ({ page }) => {
  const name = uniqueName('Buy milk')
  await page.goto('/writeTodoToDatabase.php')
  const form = page.locator('form')
  const todoNameInput = form.locator('input[name="name"]')
  const todoDateInput = form.locator('input[name="date"]')

  await expect(form).toBeVisible()
  await expect(todoNameInput).toBeVisible()
  await expect(todoDateInput).toBeVisible()
  // Fill the form
  await todoNameInput.fill(name)
  await todoDateInput.fill('2099-12-24')
  // Submit the form
  await form.locator('button[type="submit"]').click()
  // Wait for the form to be hidden
  await page.waitForURL('/displayAllTodosFromDatabase.php')
  // Check that the todo is displayed
  await expect(page.locator('li').filter({ hasText: name })).toHaveCount(1)
})

test('accept todo with today date', async ({ page }) => {
  const name = uniqueName('Today todo')
  await createTodo(page, name, isoDate())
  await expect(page.locator('li').filter({ hasText: name })).toHaveCount(1)
})

test('reject todo with past date', async ({ page }) => {
  const name = uniqueName('Past date todo')
  await submitTodo(page, name, '2021-12-24')

  await expect(page).toHaveURL(/writeTodoToDatabase\.php/)
  await expect(page.locator('form')).toBeVisible()
  await expect(page.locator('p')).toBeVisible()
  await expectTodoNotSaved(page, name)
})

test('reject todo with yesterday date', async ({ page }) => {
  const name = uniqueName('Yesterday todo')
  await submitTodo(page, name, isoDate(-1))

  await expect(page).toHaveURL(/writeTodoToDatabase\.php/)
  await expect(page.locator('p')).toBeVisible()
  await expectTodoNotSaved(page, name)
})

test('reject todo with empty name', async ({ page }) => {
  await submitTodo(page, '', isoDate(1))

  await expect(page).toHaveURL(/writeTodoToDatabase\.php/)
  await expect(page.locator('form')).toBeVisible()
  await expect(page.locator('p')).toBeVisible()
})

test('todo name is displayed as text, not as html', async ({ page }) => {
  const id = randomUUID()
  await createTodo(page, `<b>Bold</b> ${id}`, '2099-12-24')
  const todo = page.locator('li').filter({ hasText: id })

  await expect(todo).toHaveCount(1)
  await expect(todo).toContainText(`<b>Bold</b> ${id}`)
  await expect(todo.locator('b')).toHaveCount(0)
})

test('sort todos by name and by date', async ({ page }) => {
  test.slow()
  const id = randomUUID()
  // Insertion, name and date orders are all different, so an ignored sort
  // parameter cannot pass by chance
  const todos = [
    { name: `MMM ${id}`, date: '2099-06-15' },
    { name: `ZZZ ${id}`, date: '2099-01-01' },
    { name: `AAA ${id}`, date: '2099-12-31' },
  ]
  for (const todo of todos) {
    await createTodo(page, todo.name, todo.date)
  }

  // Our todos in the order they are displayed, other todos are ignored
  const displayedOrder = async () =>
    (await page.locator('li').allTextContents())
      .map((text) => todos.find((todo) => text.includes(todo.name))?.name)
      .filter((name) => name !== undefined)

  await page.goto('/displayAllTodosFromDatabase.php?sort=name')
  expect(await displayedOrder()).toEqual([
    `AAA ${id}`,
    `MMM ${id}`,
    `ZZZ ${id}`,
  ])

  await page.goto('/displayAllTodosFromDatabase.php?sort=date')
  expect(await displayedOrder()).toEqual([
    `ZZZ ${id}`,
    `MMM ${id}`,
    `AAA ${id}`,
  ])
})

test('delete a todo', async ({ page }) => {
  test.slow()
  const name = uniqueName('Todo to delete')
  const kept = uniqueName('Todo to keep')
  await createTodo(page, name, '2099-12-24')
  await createTodo(page, kept, '2099-12-24')

  const todo = page.locator('li').filter({ hasText: name })
  await expect(todo).toHaveCount(1)
  const deleteButton = todo.locator('button')
  await expect(deleteButton).toBeVisible()
  const deleteRequest = page.waitForRequest(/deleteTodoFromDatabase\.php/)
  await deleteButton.click()
  const request = await deleteRequest
  // The id must be sent in the body of a POST request, not in the url
  expect(request.method()).toBe('POST')
  expect(new URL(request.url()).search).toBe('')
  expect(request.postData()).toBeTruthy()
  await page.waitForURL('/displayAllTodosFromDatabase.php')
  await expect(page.locator('li').filter({ hasText: name })).toHaveCount(0)
  // Only the selected todo is deleted
  await expect(page.locator('li').filter({ hasText: kept })).toHaveCount(1)
})

test('do not delete a todo with a GET request', async ({ page }) => {
  test.slow()
  const name = uniqueName('Todo not deleted by GET')
  await createTodo(page, name, '2099-12-24')

  // Send the delete form fields in the query string of a GET request
  const params = await page
    .locator('li')
    .filter({ hasText: name })
    .locator('form')
    .evaluate((form: HTMLFormElement) =>
      new URLSearchParams(
        [...new FormData(form)].map(([key, value]) => [key, String(value)]),
      ).toString(),
    )
  await page.goto(`/deleteTodoFromDatabase.php?${params}`)

  await page.goto('/displayAllTodosFromDatabase.php')
  await expect(page.locator('li').filter({ hasText: name })).toHaveCount(1)
})
