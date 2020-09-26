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
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/Downloads/chromedriver85";
    private static final String LOCAL_LOGIN_URL = "http://localhost:3000/";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";

    private static final String TEXT_ID = "loginText";
    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String BUTTON_ID = "loginButton";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_LOGIN_URL);
    }

    // SAD PATH -- user randomly clicks on textfield
    @Test
    public void testLoginRandomClick() {
        driver.findElement(By.id(TEXTFIELD_ID)).click();
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

    // HAPPY PATH -- login code entered
    @Test
    public void testLoginValid() {
        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys("123");
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_HOST_LOBBY, driver.getCurrentUrl());
    }

    // FOLLOWING TESTS NEED TO RESOLVE THE ELEMENT CLICK INTERCEPTED PROBLEM
    // SAD PATH -- '' code entered
//    @Test
//    public void testLoginInvalid() {
//        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys("");
//        driver.findElement(By.id(BUTTON_ID)).click();
//        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
//
//    }
//
//    // SAD PATH -- no code entered
//    @Test
//    public void testLoginNoCode() {
//        driver.findElement(By.id(BUTTON_ID)).click();
//        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
//    }
}
