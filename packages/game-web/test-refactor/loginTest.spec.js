const { By, Builder } = require('selenium-webdriver');
const { suite } = require('selenium-webdriver/testing');
const assert = require("assert");

suite(function(env) {
    describe('First script', function() {
        this.timeout(10000);

        let driver;

        before(async function() {
            driver = await new Builder().forBrowser('chrome').build();
        });

        after(async () => await driver.quit());

        it('First Selenium script', async function() {
            await driver.get('http://localhost:3000');

            let title = await driver.getTitle();
            assert.equal("Web form", title);

            await driver.manage().setTimeouts({ implicit: 500 });

            let textBox = await driver.findElement(By.name('my-text'));
            let submitButton = await driver.findElement(By.css('button'));

            await textBox.sendKeys('Selenium');
            await submitButton.click();

            let message = await driver.findElement(By.id('message'));
            let value = await message.getText();
            assert.equal("Received!", value);
        });

    });
});