package Lobby;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;


public class TimerTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/Downloads/chromedriver85";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";

    private static final String TEXT_ID = "timerText";
    private static final String BUTTON_ID = "timerButton";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_HOST_LOBBY);
    }

    // SAD PATH -- user clicks randomly
    @Test
    public void testRandomClick() {
        driver.findElement(By.id(TEXT_ID)).click();
        Assert.assertEquals(LOCAL_HOST_LOBBY, driver.getCurrentUrl());
    }
}

    // FOLLOWING TESTS NEED TO RESOLVE THE ELEMENT CLICK INTERCEPTED PROBLEM
    // SAD PATH -- user tries to move on before time goes off
//    @Test
//    public void testEarlyClick() {
//        driver.findElement(By.id(BUTTON_ID)).click();
//        Assert.assertEquals(LOCAL_HOST_LOBBY, driver.getCurrentUrl());
//