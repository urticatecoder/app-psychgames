package user_interface.lobby;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.junit.jupiter.api.Assertions;

/*
    Tests for the Start Timer in the UI
    Author: Eric Doppelt
 */

public class TimerTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";
    private static final String LOCAL_HOST_TUTORIAL = "http://localhost:3000/game-one-tutorial";
    private static final String TEXT_ID = "timerText";
    private static final String BUTTON_ID = "timerButton";
    private static final String THREAD_SLEEP_MESSAGE = "Error with Thread Sleep";
    private static final int TIMER_WAIT = 61000;


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

    // HAPPY PATH -- user waits the timer length and then clicks
    @Test
    public void testProperClick() {
        try {
            Thread.sleep(TIMER_WAIT);
        } catch (InterruptedException e) {
            System.out.println(THREAD_SLEEP_MESSAGE);
        }
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_HOST_TUTORIAL, driver.getCurrentUrl());
    }

    // SAD PATH -- user tries to move on before time goes off
    // Clicking a disabled Material UI button throws an error, so catching the error is the same as the button being disabled.
    @Test
    public void testEarlyClick() {
        Assertions.assertThrows(ElementClickInterceptedException.class, () -> driver.findElement(By.id(BUTTON_ID)).click());
    }


}