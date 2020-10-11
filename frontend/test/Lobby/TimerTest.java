package Lobby;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.junit.jupiter.api.Assertions;

public class TimerTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";
    private static final String LOCAL_HOST_WELCOME = "http://localhost:3000/one-welcome";
    private static final String TEXT_ID = "timerText";
    private static final String BUTTON_ID = "timerButton";
    private static final String THREAD_SLEEP_MESSAGE = "Error with Thread Sleep";
    private static final int TIMER_LENGTH = 6000;

    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String LOGIN_BUTTON_ID = "loginButton";

    private static final String LOCAL_LOGIN_URL = "http://localhost:3000/";

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

    @Test
    public void testProperClick() {
        try {
            Thread.sleep(TIMER_LENGTH);
        } catch (InterruptedException e) {
            System.out.println(THREAD_SLEEP_MESSAGE);
        }
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_HOST_WELCOME, driver.getCurrentUrl());
    }

    // SAD PATH -- user tries to move on before time goes off
    // Clicking a disabled Material UI button throws an error, so catching the error is the same as the button being disabled.
    @Test
    public void testEarlyClick() {
        Assertions.assertThrows(ElementClickInterceptedException.class, () -> driver.findElement(By.id(BUTTON_ID)).click());
    }


}