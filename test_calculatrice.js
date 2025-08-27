const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testCalculatrice() {
    // Создаём браузер в фоне (headless)
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build();

    try {
        // Открываем страницу калькулятора
        await driver.get("http://localhost:8080/index.html");

        // --- Тест 1: Сложение 10 + 5 ---
        await driver.findElement(By.id('number1')).sendKeys('10');
        await driver.findElement(By.id('number2')).sendKeys('5');
        await driver.findElement(By.css('#operation')).click();
        await driver.findElement(By.css('option[value="add"]')).click();
        await driver.findElement(By.id('calculate')).click();
        let result = await driver.findElement(By.css('#result span')).getText();
        console.log("Addition 10 + 5:", result === '15' ? "OK ✅" : `FAIL ❌ (got: ${result})`);

        // --- Тест 2: Деление на 0 ---
        await driver.findElement(By.id('number1')).clear();
        await driver.findElement(By.id('number2')).clear();
        await driver.findElement(By.id('number1')).sendKeys('10');
        await driver.findElement(By.id('number2')).sendKeys('0');
        await driver.findElement(By.id('calculate')).click();
        result = await driver.findElement(By.css('#result span')).getText();
        console.log("Division by zero:", result === 'Division par zéro impossible.' ? "OK ✅" : `FAIL ❌ (got: ${result})`);

        // --- Тест 3: Некорректный ввод ---
        await driver.findElement(By.id('number1')).clear();
        await driver.findElement(By.id('number2')).clear();
        await driver.findElement(By.id('number2')).sendKeys('5');
        await driver.findElement(By.id('calculate')).click();
        result = await driver.findElement(By.css('#result span')).getText();
        console.log("Invalid input:", result === 'Veuillez entrer des nombres valides.' ? "OK ✅" : `FAIL ❌ (got: ${result})`);

        // --- Тест 4: Вычитание 50 - 30 ---
        await driver.findElement(By.id('number1')).clear();
        await driver.findElement(By.id('number2')).clear();
        await driver.findElement(By.id('number1')).sendKeys('50');
        await driver.findElement(By.id('number2')).sendKeys('30');
        await driver.findElement(By.css('#operation')).click();
        await driver.findElement(By.css('option[value="subtract"]')).click();
        await driver.findElement(By.id('calculate')).click();
        result = await driver.findElement(By.css('#result span')).getText();
        console.log("Subtraction 50 - 30:", result === '20' ? "OK ✅" : `FAIL ❌ (got: ${result})`);

    } finally {
        // Закрываем браузер
        await driver.quit();
    }
})();
