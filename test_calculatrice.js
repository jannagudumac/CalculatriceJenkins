// Импортируем необходимые классы из библиотеки selenium-webdriver
const { Builder, By, Key } = require("selenium-webdriver");
// Импортируем настройки Chrome
const chrome = require("selenium-webdriver/chrome");

(async function testCalculatrice() {
  // -----------------------------
  // 1. Настройка браузера Chrome
  // -----------------------------
  // Создаём объект с настройками Chrome
  const options = new chrome.Options();

  // '--headless' → запускаем браузер без графического интерфейса (фоновые тесты)
  options.addArguments("--headless");

  // '--no-sandbox' → обязательно для Docker, иначе Chrome может не запуститься
  options.addArguments("--no-sandbox");

  // '--disable-dev-shm-usage' → обходит ограничение памяти /dev/shm в контейнере
  options.addArguments("--disable-dev-shm-usage");

  // Создаём драйвер (экземпляр браузера) с заданными настройками
  const driver = await new Builder()
    .forBrowser("chrome") // используем Chrome
    .setChromeOptions(options) // применяем настройки headless и Docker-специфичные
    .build(); // строим драйвер

  try {
    // -----------------------------
    // 2. Открываем страницу калькулятора
    // -----------------------------
    // driver.get() → переходит по URL
    await driver.get("http://localhost:8080/index.html");

    // -----------------------------
    // 3. Тест 1: Сложение 10 + 5
    // -----------------------------
    // Находим поле ввода первого числа по id и вводим "10"
    await driver.findElement(By.id("number1")).sendKeys("10");

    // Находим поле ввода второго числа по id и вводим "5"
    await driver.findElement(By.id("number2")).sendKeys("5");

    // Выбираем операцию: кликаем по выпадающему списку
    await driver.findElement(By.css("#operation")).click();

    // Выбираем "Сложение" (option с value="add")
    await driver.findElement(By.css('option[value="add"]')).click();

    // Нажимаем кнопку "Вычислить"
    await driver.findElement(By.id("calculate")).click();

    // Получаем текст результата из элемента <span> с id=result
    let result = await driver.findElement(By.css("#result span")).getText();

    // Сравниваем результат с ожидаемым и выводим в консоль
    console.log(
      "Addition 10 + 5:",
      result === "15" ? "OK ✅" : `FAIL ❌ (got: ${result})`
    );

    // -----------------------------
    // 4. Тест 2: Деление на 0
    // -----------------------------
    // Очищаем поля ввода перед новым тестом
    // Деление на ноль
    await driver.findElement(By.id("number1")).clear();
    await driver.findElement(By.id("number2")).clear();
    await driver.findElement(By.id("number1")).sendKeys("10");
    await driver.findElement(By.id("number2")).sendKeys("0");

    // Выбираем операцию "деление"
    await driver.findElement(By.css("#operation")).click();
    await driver
      .findElement(By.css('#operation option[value="divide"]'))
      .click();

    await driver.findElement(By.id("calculate")).click();

    let resultDivZero = await driver
      .findElement(By.css("#result span"))
      .getText();
    console.log(
      "Test Division par Zéro : ",
      resultDivZero === "Division par zéro impossible."
        ? "Réussi ✅"
        : `Échoué ❌ (obtenu: ${resultDivZero})`
    );

    // -----------------------------
    // 5. Тест 3: Некорректный ввод
    // -----------------------------
    // Очищаем поля
    await driver.findElement(By.id("number1")).clear();
    await driver.findElement(By.id("number2")).clear();

    // Вводим только второе число, первое оставляем пустым
    await driver.findElement(By.id("number2")).sendKeys("5");

    // Нажимаем "Вычислить"
    await driver.findElement(By.id("calculate")).click();

    // Проверяем, что выводится сообщение об ошибке
    result = await driver.findElement(By.css("#result span")).getText();
    console.log(
      "Invalid input:",
      result === "Veuillez entrer des nombres valides."
        ? "OK ✅"
        : `FAIL ❌ (got: ${result})`
    );

    // -----------------------------
    // 6. Тест 4: Вычитание 50 - 30
    // -----------------------------
    // Очищаем поля
    await driver.findElement(By.id("number1")).clear();
    await driver.findElement(By.id("number2")).clear();

    // Вводим числа
    await driver.findElement(By.id("number1")).sendKeys("50");
    await driver.findElement(By.id("number2")).sendKeys("30");

    // Выбираем операцию вычитания
    await driver.findElement(By.css("#operation")).click();
    await driver.findElement(By.css('option[value="subtract"]')).click();

    // Нажимаем кнопку "Вычислить"
    await driver.findElement(By.id("calculate")).click();

    // Получаем результат и проверяем
    result = await driver.findElement(By.css("#result span")).getText();
    console.log(
      "Subtraction 50 - 30:",
      result === "20" ? "OK ✅" : `FAIL ❌ (got: ${result})`
    );
  } finally {
    // -----------------------------
    // 7. Закрываем браузер
    // -----------------------------
    // В любом случае, даже если тесты упали, драйвер нужно закрыть
    await driver.quit();
  }
})();
