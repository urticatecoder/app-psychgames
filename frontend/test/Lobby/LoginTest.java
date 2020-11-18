package Lobby;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;


public class LoginTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_LOGIN_URL = "http://localhost:3000/";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";

    private static final String TEXT_ID = "loginText";
    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String BUTTON_ID = "loginButton";

    private static final String VALID_LOGIN_CODE = "CS408";
    private static final String SECOND_VALID_CODE = "CS500";
    private static final String THIRD_VALID_CODE = "9878";
    private static final String INVALID_LOGIN_CODE = "CS307";
    private static final String EMPTY_LOGIN_CODE = " ";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_LOGIN_URL);
    }

//    // HAPPY PATH -- valid login code entered
//    @Test
//    public void testLoginValid() {
//        testCode(LOCAL_HOST_LOBBY, THIRD_VALID_CODE);
//    }

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

    // SAD PATH -- invalid login code entered
    @Test
    public void testEmptyLogin() {
        testCode(LOCAL_LOGIN_URL, EMPTY_LOGIN_CODE);
    }

    // SAD PATH -- no code entered
    @Test
    public void testInitialURL() {
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

//    @Test
//    public void testDuplicatedCode() {
//        enterValidCode(LOCAL_HOST_LOBBY);
//        enterValidCode(LOCAL_LOGIN_URL);
//    }

    private void enterValidCode(String URL) {
        WebDriver tempDriver = new ChromeDriver();
        tempDriver.get(LOCAL_LOGIN_URL);
        tempDriver.findElement(By.id(TEXTFIELD_ID)).sendKeys(VALID_LOGIN_CODE);
        tempDriver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(URL, tempDriver.getCurrentUrl());

    }
    private void testCode(String URL, String loginCode) {
        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys(loginCode);
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(URL, driver.getCurrentUrl());
    }
}
