const puppeteer = require("puppeteer");

async function run() {
  const URL = "http://testeevandomirra2.fapemig.br";
  const EMAIL_AND_PASSWORD = "pucteste03";

  // Inicializa o navegador Puppeteer
  const browser = await puppeteer.launch();

  // Cria uma nova página
  const page = await browser.newPage();

  // Navega para um URL específico
  await page.goto("http://testeevandomirra2.fapemig.br");

  // Aguarda alguns segundos para a página carregar completamente
  await page.waitForTimeout(2000);

  // Seleciona o elemento de input do campo email
  await page.evaluate((value) => {
    const input = document.querySelector('input[formcontrolname="login"]');
    input.value = value;
    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);
  }, EMAIL_AND_PASSWORD);

  // Seleciona o elemento de input do campo senha
  await page.evaluate((value) => {
    const input = document.querySelector('input[formcontrolname="senha"]');
    input.value = value;
    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);
  }, EMAIL_AND_PASSWORD);

  // Clique no botão de submit
  await page.click('button[type="submit"]');

  // Aguarda alguns segundos para a página carregar completamente
  await page.waitForTimeout(2000);

  // Captura uma captura de tela da página e salva em um arquivo
  await page.screenshot({ path: "screenshot.png" });

  // Fecha o navegador
  await browser.close();

  console.log("Captura de tela concluída!");
}

run();
