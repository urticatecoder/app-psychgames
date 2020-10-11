package GameOneSummary;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class AvatarsTest {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_LOGIN_URL = "http://localhost:3000/";
    private static final String LOCAL_SUMMARY_URL = "http://localhost:3000/summary";

    private static final String TEXT_ID = "loginText";
    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String BUTTON_ID = "loginButton";

    private static final String VALID_LOGIN_CODE = "CS408";
    private static final String INVALID_LOGIN_CODE = "CS307";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_SUMMARY_URL);
    }

    // HAPPY PATH -- check the image of the avatar
    @Test
    public void testLoginRandomClick() {
        driver.findElement(By.id(TEXTFIELD_ID)).click();
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

    // HAPPY PATH -- valid login code entered
    @Test
    public void testLoginValid() {
        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys(VALID_LOGIN_CODE);
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_HOST_LOBBY, driver.getCurrentUrl());
    }

    //     SAD PATH -- invalid login code entered
    @Test
    public void testLoginInvalid() {
        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys(INVALID_LOGIN_CODE);
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }

    // SAD PATH -- no code entered
    @Test
    public void testLoginNoCode() {
        driver.findElement(By.id(BUTTON_ID)).click();
        Assert.assertEquals(LOCAL_LOGIN_URL, driver.getCurrentUrl());
    }
}
