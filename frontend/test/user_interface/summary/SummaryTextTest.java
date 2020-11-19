package user_interface.summary;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

/*
    Tests for the Summary Text in the UI shown after Game One
    Author: Eric Doppelt
 */
public class SummaryTextTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_SUMMARY_URL = "http://localhost:3000/summary";

    private static final String WINNING_TEXT_ID = "winnerText";
    private static final String LOSING_TEXT_ID = "loserText";
    private static final String WINNING_TEXT = "Winning Players";
    private static final String LOSING_TEXT = "Losing Players";


    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_SUMMARY_URL);
    }

    // HAPPY PATH -- check the winning text
    @Test
    public void testWinning() {
        Assert.assertEquals(WINNING_TEXT, getText(WINNING_TEXT_ID));
    }

    // HAPPY PATH -- check the losing text
    @Test
    public void testLosing() {
        Assert.assertEquals(LOSING_TEXT, getText(LOSING_TEXT_ID));
    }

    private String getText(String labelID) {
        return driver.findElement(By.id(labelID)).getText();
    }
}