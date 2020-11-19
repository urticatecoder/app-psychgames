package security;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

/**
    Tests for various valid and invalid combinations of login codes trying to access the Prolific Code in the UI
    @author: Eric Doppelt
 */

public class ProlificCodeTest {
    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_LOGIN_URL = "http://localhost:3000/";

    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String BUTTON_ID = "loginButton";
    private static final String PROLIFIC_CODE_ID = "prolificCode";

    private static final String TEST_PREFIX = "test:";
    private static final String VALID_LOGIN_CODE = "valid";
    private static final String INVALID_LOGIN_CODE = "CS307";
    private static final String EMPTY_LOGIN_CODE = "";

    private static final String PROLIFIC_CODE_PREFIX = "Prolific Code: ";
    private static final String VALID_MESSAGE = PROLIFIC_CODE_PREFIX + "CS408";
    private static final String INVALID_MESSAGE = PROLIFIC_CODE_PREFIX + "INVALID_CODE";

    private static final int REROUTING_PAUSE = 1000;
    private static final String THREAD_SLEEP_ERROR_MESSAGE = "Error on the Thread Sleep call";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_LOGIN_URL);
    }

    // HAPPY PATH -- check the initial URL is valid
    @Test
    public void testInitialURL() {
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

    // HAPPY PATH -- valid login code entered
    @Test
    public void testValidProlificCode() {
        testCode(VALID_MESSAGE, VALID_LOGIN_CODE);
    }

    // SAD PATH -- invalid login code entered
    @Test
    public void testInvalidProlificCode() {
        testCode(INVALID_MESSAGE, INVALID_LOGIN_CODE);
    }

    // SAD PATH -- empty login code entered
    @Test
    public void testEmptyProlificCode() {
        testCode(INVALID_MESSAGE, EMPTY_LOGIN_CODE);
    }

    private void testCode(String code, String loginCode) {
        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys(TEST_PREFIX + loginCode);
        driver.findElement(By.id(BUTTON_ID)).click();
        try {
            Thread.sleep(REROUTING_PAUSE);
        } catch (InterruptedException e) {
            System.out.println(THREAD_SLEEP_ERROR_MESSAGE);
        }
        driver.findElement(By.id(PROLIFIC_CODE_ID)).getText();
        System.out.println(driver.findElement(By.id(PROLIFIC_CODE_ID)).getText());
    }
}
