const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testCalculatrice() {
    const options = new chrome.Options().headless().addArguments('--no-sandbox', '--disable-dev-shm-usage');
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.get("http://localhost:8080/index.html");

        async function runTest(number1, number2, operationSelector, expectedResult, description) {
            await driver.findElement(By.id('number1')).clear();
            await driver.findElement(By.id('number2')).clear();

            if (number1 !== null) await driver.findElement(By.id('number1')).sendKeys(number1);
            if (number2 !== null) await driver.findElement(By.id('number2')).sendKeys(number2);

            if (operationSelector) {
                await driver.findElement(By.css('#operation')).click();
                await driver.findElement(By.css(operationSelector)).click();
            }

            await driver.findElement(By.id('calculate')).click();

            const result = await driver.findElement(By.css('#result span')).getText();
            console.log(`${description}:`, result === expectedResult ? "Réussi ✅" : `Échoué ❌ (obtenu: ${result})`);
        }

        // --- Tests ---
        await runTest('10', '5', 'option[value="add"]', '15', 'Test Addition');
        await runTest('10', '0', null, 'Division par zéro impossible.', 'Test Division par Zéro');
        await runTest(null, '5', null, 'Veuillez entrer des nombres valides.', 'Test Entrée Non Valide');
        await runTest('50', '30', 'option[value="subtract"]', '20', 'Test Soustraction');

    } finally {
        await driver.quit();
    }
})();
