package user_interface.lobby;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

/**
    Tests for the Lobby Text in the UI
    @author: Eric Doppelt
 */
 
public class LobbyTest {
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3000/lobby";

    private static final String TEXT_ID = "timerText";

    private static final String PLAYERS_TEXT_FIRST = "Please wait while ";
    private static final String PLAYERS_TEXT_SECOND = " other players join in.";

    private static final int FIVE_PLAYERS = 5;

    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String LOGIN_BUTTON_ID = "loginButton";

    private static final String PLAYER_ID = "timerText";

    private static final String LOCAL_LOGIN_URL = "http://localhost:3002/lobby/";

    private WebDriver driver;

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

    // HAPPY PATH -- test the counter in the lobby goes down by 1 when the first player joins
    @Test
    public void testFivePlayers() {
        String fivePlayersText = PLAYERS_TEXT_FIRST + FIVE_PLAYERS + PLAYERS_TEXT_SECOND;
        Assert.assertEquals(fivePlayersText , getText(PLAYER_ID));
    }

    private String getText(String labelID) {
        return driver.findElement(By.id(labelID)).getText();
    }
}
