package security;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;


/*
    Tests for various valid and invalid combinations of login codes trying to access the Start Timer in the UI.
    Author: Eric Doppelt
 */

public class LoginTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_LOGIN_URL = "http://localhost:3000/";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";

    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String BUTTON_ID = "loginButton";

    private static final String VALID_CODE = "9878-1";
    private static final String INVALID_LOGIN_CODE = "CS307";
    private static final String EMPTY_LOGIN_CODE = " ";

    private static final int REROUTING_PAUSE = 1000;
    private static final String THREAD_SLEEP_ERROR_MESSAGE = "Error on the Thread Sleep call";

    private String duplicatedCode;
    private static final String TEST_PREFIX = "test";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_LOGIN_URL);
        duplicatedCode = TEST_PREFIX + Math.random();
    }

    // HAPPY PATH -- valid login code entered
    @Test
    public void testLoginValid() {
        testCode(LOCAL_HOST_LOBBY, VALID_CODE);
    }

    // SAD PATH -- user randomly clicks on textfield
    @Test
    public void testLoginRandomClick() {
        driver.findElement(By.id(TEXTFIELD_ID)).click();
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

    // SAD PATH -- invalid login code entered
    @Test
    public void testLoginInvalid() {
        testCode(LOCAL_LOGIN_URL, INVALID_LOGIN_CODE);
    }

    // SAD PATH -- empty login code entered
    @Test
    public void testEmptyLogin() {
        testCode(LOCAL_LOGIN_URL, EMPTY_LOGIN_CODE);
    }

    // HAPPY PATH -- check that the initial URL is correct
    @Test
    public void testInitialURL() {
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

    // SAD PATH -- test that a login code can only be used once
    @Test
    public void testDuplicatedCode() {
        testCode(LOCAL_HOST_LOBBY, duplicatedCode);
        resetDriver();
        testCode(LOCAL_LOGIN_URL, duplicatedCode);
    }

    private void resetDriver() {
        driver = new ChromeDriver();
        driver.get(LOCAL_LOGIN_URL);
    }

    private void testCode(String URL, String loginCode) {
        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys(loginCode);
        driver.findElement(By.id(BUTTON_ID)).click();
        try {
            Thread.sleep(REROUTING_PAUSE);
        } catch (InterruptedException e) {
            System.out.println(THREAD_SLEEP_ERROR_MESSAGE);
        }
        Assert.assertEquals(URL, driver.getCurrentUrl());
    }
}
