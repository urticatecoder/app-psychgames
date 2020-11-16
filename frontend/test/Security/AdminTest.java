package Security;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class AdminTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_ADMIN_LOGIN_URL = "http://localhost:3002/adminLogin";
    private static final String LOCAL_ADMIN_URL = "http://localhost:3002/admin";

    private static final String USERNAME_ID = "admin-username";
    private static final String PASSWORD_ID = "admin-password";
    private static final String BUTTON_ID = "admin-button";

    private static final String VALID_USERNAME = "mel";
    private static final String INVALID_USERNAME = "Invalid";
    private static final String EMPTY_USERNAME = " ";

    private static final String VALID_PASSWORD = "CS408";
    private static final String INVALID_PASSWORD = "Invalid";
    private static final String EMPTY_PASSWORD = " ";

    private static final int REROUTING_PAUSE = 1000;
    private static final String THREAD_SLEEP_ERROR_MESSAGE = "Error on the Thread Sleep call";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_ADMIN_LOGIN_URL);
    }

    // HAPPY PATH -- valid login code entered
    @Test
    public void testAdminValid() {
        testCode(LOCAL_ADMIN_URL, VALID_USERNAME, VALID_PASSWORD);
    }

    // SAD PATH -- user randomly clicks on textfield
    @Test
    public void testAdminRandomClick() {
        driver.findElement(By.id(USERNAME_ID)).click();
        Assert.assertEquals(LOCAL_ADMIN_LOGIN_URL, driver.getCurrentUrl());
    }

    @Test
    public void testAdminClickBeforeInput() {
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_ADMIN_LOGIN_URL, driver.getCurrentUrl());
    }

    // SAD PATH -- invalid login code entered
    @Test
    public void testAdminInvalidUsername() {
        testCode(LOCAL_ADMIN_LOGIN_URL, INVALID_USERNAME, VALID_PASSWORD);
    }

    // SAD PATH -- invalid login code entered
    @Test
    public void testAdminInvalidPassword() {
        testCode(LOCAL_ADMIN_LOGIN_URL, VALID_USERNAME, INVALID_PASSWORD);
    }

    // SAD PATH -- no code entered
    @Test
    public void testAdminInvalidBoth() {
        testCode(LOCAL_ADMIN_LOGIN_URL, INVALID_USERNAME, INVALID_PASSWORD);
    }

    @Test
    public void testAdminEmptyUsername() {
        testCode(LOCAL_ADMIN_LOGIN_URL, EMPTY_USERNAME, VALID_PASSWORD);
    }

    // SAD PATH -- invalid login code entered
    @Test
    public void testAdminEmptyPassword() {
        testCode(LOCAL_ADMIN_LOGIN_URL, VALID_USERNAME, EMPTY_PASSWORD);
    }

    // SAD PATH -- no code entered
    @Test
    public void testAdminEmptyBoth() {
        testCode(LOCAL_ADMIN_LOGIN_URL, EMPTY_USERNAME, EMPTY_PASSWORD);
    }

    private void testCode(String URL, String username, String password) {
        driver.findElement(By.id(USERNAME_ID)).sendKeys(username);
        driver.findElement(By.id(PASSWORD_ID)).sendKeys(password);
        driver.findElement(By.id(BUTTON_ID)).click();
        try {
            Thread.sleep(REROUTING_PAUSE);
        } catch (InterruptedException e) {
            System.out.println(THREAD_SLEEP_ERROR_MESSAGE);
        }
        Assert.assertEquals(URL, driver.getCurrentUrl());
    }
}