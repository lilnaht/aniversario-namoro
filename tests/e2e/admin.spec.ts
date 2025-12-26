import { test, expect } from "@playwright/test";

test("admin flow updates settings and timeline", async ({ page }) => {
  await page.goto("/admin");

  await page.getByLabel("Senha").fill("testpass");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Painel Admin")).toBeVisible();

  const settingsSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Configuracoes" }),
  });
  const settingsForm = settingsSection.locator("form");

  await settingsForm.getByLabel("Data de inicio do namoro").fill("2024-01-01");
  await settingsForm
    .getByLabel("Link do Spotify")
    .fill("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT");
  await settingsForm.getByRole("button", { name: "Salvar" }).click();

  const timelineSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Nossa historia" }),
  });
  const timelineForm = timelineSection.locator("form").first();

  await timelineForm.getByLabel("Imagem do post").setInputFiles("tests/fixtures/sample.png");
  await timelineForm.getByRole("button", { name: "Salvar recorte" }).click();
  await expect(
    timelineForm.getByRole("button", { name: "Salvar recorte" }),
  ).toBeHidden();

  await timelineForm.getByLabel("Data").fill("2024-02-14");
  await timelineForm.getByLabel("Titulo").fill("Nosso primeiro jantar");
  await timelineForm.getByLabel("Texto").fill("Foi uma noite especial.");

  await timelineForm.getByRole("button", { name: "Adicionar post" }).click();

  await page.goto("/historia");
  await expect(page.getByText("Nosso primeiro jantar")).toBeVisible();
  const imageCount = await page.locator("img").count();
  expect(imageCount).toBeGreaterThan(0);

  await page.goto("/");
  await expect(page.getByText("Tempo de namoro")).toBeVisible();
  await expect(page.locator("iframe[title='Spotify']")).toBeVisible();
});
