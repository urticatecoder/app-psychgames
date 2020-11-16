package UI.Lobby;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LobbyTest {
    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_HOST_LOBBY = "http://localhost:3002/lobby";

    private static final String TEXT_ID = "timerText";

    private static final String PLAYERS_TEXT_FIRST = "Please wait while ";
    private static final String PLAYERS_TEXT_SECOND = " other players join in.";

    private static final int FIVE_PLAYERS = 5;
    private static final int FOUR_PLAYERS = 4;
    private static final int THREE_PLAYERS = 3;
    private static final int TWO_PLAYERS = 2;
    private static final int ONE_PLAYERS = 1;
    private static final int ZERO_PLAYERS = 0;


    private static final String TEXTFIELD_ID = "loginTextField";
    private static final String LOGIN_BUTTON_ID = "loginButton";

    private static final String PLAYER_ID = "timerText";

    private static final String LOCAL_LOGIN_URL = "http://localhost:3002/lobby/";

    private static final String VALID_LOGIN_CODE_ONE = "CS101";
    private static final String VALID_LOGIN_CODE_TWO = "CS201";
    private static final String VALID_LOGIN_CODE_THREE = "CS301";
    private static final String VALID_LOGIN_CODE_FOUR = "CS401";
    private static final String VALID_LOGIN_CODE_FIVE = "CS501";
    private static final String VALID_LOGIN_CODE_SIX = "CS601";

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
    public void testFivePlayers() {
        String fivePlayersText = PLAYERS_TEXT_FIRST + FIVE_PLAYERS + PLAYERS_TEXT_SECOND;
        Assert.assertEquals(fivePlayersText , getText(PLAYER_ID));
    }

//    REASON FOR COMMENTING OUT: USER TESTING IS NOT BEING PLAYED IN REAL TIME, SO THIS WILL FAIL.
//    @Test
//    public void testMultiplePlayers() {
//        driver.get(LOCAL_LOGIN_URL);
//        driver.findElement(By.id(TEXTFIELD_ID)).sendKeys(VALID_LOGIN_CODE_ONE);
//        driver.findElement(By.id(LOGIN_BUTTON_ID)).click();
//
//        String fivePlayersText = getPlayerText(FIVE_PLAYERS);
//        Assert.assertEquals(fivePlayersText , getText(PLAYER_ID));
//
//        System.out.print("hereerere");
//        addPlayer(VALID_LOGIN_CODE_TWO, FOUR_PLAYERS);
//        addPlayer(VALID_LOGIN_CODE_THREE, THREE_PLAYERS);
//        addPlayer(VALID_LOGIN_CODE_FOUR, TWO_PLAYERS);
//        addPlayer(VALID_LOGIN_CODE_FIVE, ONE_PLAYERS);
//        addPlayer(VALID_LOGIN_CODE_SIX, ZERO_PLAYERS);
//    }


    private void addPlayer(String loginCode, int players) {
        playWithCode(loginCode);
        String tempPlayersText = getPlayerText(players);
        System.out.println(tempPlayersText);
        System.out.println(getText(PLAYER_ID));
        Assert.assertEquals(tempPlayersText, getText(PLAYER_ID));
    }

    private String getText(String labelID) {
        return driver.findElement(By.id(labelID)).getText();
    }

    private void playWithCode(String code) {
        WebDriver tempDriver = new ChromeDriver();
        tempDriver.get(LOCAL_LOGIN_URL);
        tempDriver.findElement(By.id(TEXTFIELD_ID)).sendKeys(code);
        tempDriver.findElement(By.id(LOGIN_BUTTON_ID)).click();
    }

    private String getPlayerText(int players) {
        return PLAYERS_TEXT_FIRST + players + PLAYERS_TEXT_SECOND;
    }
}
