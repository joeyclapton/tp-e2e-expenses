const puppeteer = require("puppeteer");

async function run() {
  const URL = "http://testeevandomirra2.fapemig.br";
  const EMAIL_AND_PASSWORD = "pucteste03";

  // Inicializa o navegador Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
  });

  // Cria uma nova página
  const page = await browser.newPage();

  // Habilita a coleta de informações de cobertura
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ]);

  // Obtém as dimensões da página
  const { width, height } = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }));

  // Configura as dimensões da janela do navegador para o tamanho da página
  await page.setViewport({
    width: 1000,
    height: 1000,
  });

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

  await page.waitForTimeout(2000);

  // Clique no botão de submit
  await page.click('button[type="submit"]');

  // Aguardar até que a lista com a classe "list-group list-group-flush" seja carregada
  await page.waitForSelector(".list-group.list-group-flush");

  // Selecionar o link com o texto "Prestação Financeira"
  const listItem = await page.$(
    "ul.list-group.list-group-flush li.list-group-item.text-primary.d-flex.border-0.ps-0.ng-star-inserted"
  );

  const link = await listItem.$("a.text-decoration-none");

  await link.click();

  await page.goto(
    "http://testeevandomirra2.fapemig.br/#/servicos/meus-processos"
  );

  await page.waitForSelector("tr.ng-star-inserted a.text-blue-pool.fw-bold");

  // Selecionar o link com o texto "APQ-00133-22"
  const seeProccess = await page.$(
    "tr.ng-star-inserted a.text-blue-pool.fw-bold"
  );

  seeProccess.click();
  await page.goto(
    "http://testeevandomirra2.fapemig.br/#/servicos/meus-processos/visualizar-processo?p=APQ-00133-22#monitoramento-pcfinanceira"
  );

  await page.waitForSelector("button.btn.btn-primary.ng-star-inserted");

  // Clicar no botão
  await page.click("button.btn.btn-primary.ng-star-inserted");

  await new Promise((resolve) => setTimeout(resolve, 9000));

  // Avalia se o elemento com o texto específico está presente na página
  const isElementPresent = await page.evaluate(() => {
    const element = document.querySelector("small.d-block.text-secondary");
    return element && element.textContent.includes("Débito");
  });

  if (isElementPresent) {
    await page.click(".p-checkbox-box");

    console.log("O elemento está presente na página.");
  } else {
    console.log("O elemento não está presente na página.");
  }

  await new Promise((resolve) => setTimeout(resolve, 9000));

  // Clicar no botão
  await page.click('button[ng-reflect-label="Sim"]');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Captura uma captura de tela da página e salva em um arquivo
  await page.screenshot({ path: "screenshot.png" });

  // Pare a coleta de informações de cobertura
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  // Gere relatórios de cobertura para JavaScript e CSS
  generateCoverageReportForType(jsCoverage, "js");
  generateCoverageReportForType(cssCoverage, "css");

  console.log({
    jsCoverage,
    cssCoverage,
  });

  await browser.close();

  console.log("Captura de tela concluída!");
}
run();

function generateCoverageReportForType(coverage, type) {
  const fs = require("fs");
  fs.writeFileSync(`coverage-${type}.json`, JSON.stringify(coverage, null, 2));

  const usedBytes = coverage.reduce(
    (total, entry) =>
      total + entry.text.length * (entry.ranges.length > 0 ? 1 : 0),
    0
  );
  const totalBytes = coverage.reduce(
    (total, entry) => total + entry.text.length,
    0
  );
  const percentUsed = (usedBytes / totalBytes) * 100;

  console.log(`Cobertura de ${type.toUpperCase()}: ${percentUsed.toFixed(2)}%`);
}
