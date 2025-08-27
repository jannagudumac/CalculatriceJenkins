const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testCalculatrice() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // L’app est dans le même conteneur → port 8080 exposé vers 8081 par Jenkins
        await driver.get("http://localhost:8080/index.html");

        // --- Test 1 : Addition ---
        await driver.findElement(By.id('number1')).sendKeys('10');
        await driver.findElement(By.id('number2')).sendKeys('5');
        await driver.findElement(By.css('#operation')).click();
        await driver.findElement(By.css('#operation option[value="add"]')).click();
        await driver.findElement(By.id('calculate')).click();

        let resultAdd = await driver.findElement(By.css('#result span')).getText();
        console.log("Test Addition : ", resultAdd === '15' ? "Réussi ✅" : `Échoué ❌ (obtenu: ${resultAdd})`);

        // --- Test 2 : Division par zéro ---
        await driver.findElement(By.id('number1')).clear();
        await driver.findElement(By.id('number2')).clear();
        await driver.findElement(By.id('number1')).sendKeys('10');
        await driver.findElement(By.id('number2')).sendKeys('0');
        await driver.findElement(By.css('#operation')).sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ARROW_DOWN);
        await driver.findElement(By.id('calculate')).click();

        let resultDivZero = await driver.findElement(By.css('#result span')).getText();
        console.log("Test Division par Zéro : ", resultDivZero === 'Division par zéro impossible.' ? "Réussi ✅" : `Échoué ❌ (obtenu: ${resultDivZero})`);

        // --- Test 3 : Entrée non valide ---
        await driver.findElement(By.id('number1')).clear();
        await driver.findElement(By.id('number2')).clear();
        await driver.findElement(By.id('number2')).sendKeys('5');
        await driver.findElement(By.id('calculate')).click();

        let resultInvalid = await driver.findElement(By.css('#result span')).getText();
        console.log("Test Entrée Non Valide : ", resultInvalid === 'Veuillez entrer des nombres valides.' ? "Réussi ✅" : `Échoué ❌ (obtenu: ${resultInvalid})`);

        // --- Test 4 : Soustraction ---
        await driver.findElement(By.id('number1')).clear();
        await driver.findElement(By.id('number2')).clear();
        await driver.findElement(By.id('number1')).sendKeys('50');
        await driver.findElement(By.id('number2')).sendKeys('30');
        await driver.findElement(By.css('#operation')).click();
        await driver.findElement(By.css('#operation option[value="subtract"]')).click();
        await driver.findElement(By.id('calculate')).click();

        let resultSub = await driver.findElement(By.css('#result span')).getText();
        console.log("Test Soustraction : ", resultSub === '20' ? "Réussi ✅" : `Échoué ❌ (obtenu: ${resultSub})`);

    } finally {
        await driver.quit();
    }
})();
