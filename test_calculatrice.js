const { Builder, By, Key } = require("selenium-webdriver");
const assert = require("assert");
const path = require("path");

(async function testCalculatrice() {
  // Initialiser le driver avec les bonnes options
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Afficher les résultats

    // Construire le chemin d'accès local au fichier HTML
    const localFilePath = "http://localhost:8080";

    // Accéder au site
    await driver.get(localFilePath);

    // --- Test 1 : Vérifier l'Addition ---
    console.log("--- Test 1 : Vérifier l'Addition (10 + 5) ---");
    await driver.findElement(By.id("number1")).sendKeys("10");
    await driver.findElement(By.id("operation")).sendKeys("add");
    await driver.findElement(By.id("number2")).sendKeys("5");
    await driver.findElement(By.id("calculate")).click();

    // Afficher les résultats
    let result1 = await driver.findElement(By.css("#result span")).getText();
    assert.strictEqual(result1, "15", "L'addition a échoué.");
    console.log(`Résultat obtenu : ${result1} ✅`);

    // --- Test 2 : Division par Zéro ---
    console.log("\n--- Test 2 : Division par Zéro (8 / 0) ---");
    await driver.findElement(By.id("number1")).clear();
    await driver.findElement(By.id("number1")).sendKeys("8");
    await driver.findElement(By.id("operation")).sendKeys("divide");
    await driver.findElement(By.id("number2")).clear();
    await driver.findElement(By.id("number2")).sendKeys("0");
    await driver.findElement(By.id("calculate")).click();

    // Afficher les résultats
    let result2 = await driver.findElement(By.css("#result span")).getText();
    assert.strictEqual(
      result2,
      "Division par zéro impossible.",
      "Le test de division par zéro a échoué."
    );
    console.log(`Résultat obtenu : "${result2}" ✅`);

    // --- Test 3 : Entrée Non Valide ---
    console.log("\n--- Test 3 : Entrée Non Valide ('abc' * 3) ---");
    await driver.findElement(By.id("number1")).clear();
    await driver.findElement(By.id("number1")).sendKeys("abc");
    await driver.findElement(By.id("operation")).sendKeys("multiply");
    await driver.findElement(By.id("number2")).clear();
    await driver.findElement(By.id("number2")).sendKeys("3");
    await driver.findElement(By.id("calculate")).click();

    // Afficher les résultats

    let result3 = await driver.findElement(By.css("#result span")).getText();
    assert.strictEqual(
      result3,
      "Veuillez entrer des nombres valides.",
      "Le test d'entrée non valide a échoué."
    );
    console.log(`Résultat obtenu : "${result3}" ✅`);

    // --- Test 4 : Vérifier la Soustraction ---
    console.log("\n--- Test 4 : Vérifier la Soustraction (20 - 7) ---");
    await driver.findElement(By.id("number1")).clear();
    await driver.findElement(By.id("number1")).sendKeys("20");
    await driver.findElement(By.id("operation")).sendKeys("subtract");
    await driver.findElement(By.id("number2")).clear();
    await driver.findElement(By.id("number2")).sendKeys("7");
    await driver.findElement(By.id("calculate")).click();

    // Afficher les résultats

    let result4 = await driver.findElement(By.css("#result span")).getText();
    assert.strictEqual(result4, "13", "La soustraction a échoué.");
    console.log(`Résultat obtenu : ${result4} ✅`);
  } finally {
    // Fermer le navigateur

    await driver.quit();
  }
})();
