package GameOneSummary.Summary;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class SummaryText {

    private WebDriver driver;
    private static final String CHROME_DRIVER = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "/Users/ericdoppelt/CS408/app_psychgames/frontend/node_modules/chromedriver/lib/chromedriver/chromedriver";
    private static final String LOCAL_SUMMARY_URL = "http://localhost:3000/summary";

    private static final String WIZARD_ID = "wizard";
    private static final String WIZARD_LABEL = "Wizard";
    private static final String WIZARD_LABEL_ID = "labelWizard";
    private static final String WIZARD_MEDIA_URL = "http://localhost:3000/static/media/wizard.5b1a6397.png";

    private static final String KNIGHT_ID = "knight";
    private static final String KNIGHT_LABEL = "Knight";
    private static final String KNIGHT_LABEL_ID = "labelKnight";
    private static final String KNIGHT_MEDIA_URL = "http://localhost:3000/static/media/knight.9ea63d38.png";

    private static final String SCIENTIST_ID = "scientist";
    private static final String SCIENTIST_LABEL = "Scientist";
    private static final String SCIENTIST_LABEL_ID = "labelScientist";
    private static final String SCIENTIST_MEDIA_URL = "http://localhost:3000/static/media/scientist.b7eaaa81.png";

    private static final String ROBOT_ID = "robot";
    private static final String ROBOT_LABEL = "Robot";
    private static final String ROBOT_LABEL_ID = "labelRobot";
    private static final String ROBOT_MEDIA_URL = "http://localhost:3000/static/media/robot.123bfc63.png";

    private static final String ASTRONAUT_ID = "astronaut";
    private static final String ASTRONAUT_LABEL = "Astronaut";
    private static final String ASTRONAUT_LABEL_ID = "labelAstronaut";
    private static final String ASTRONAUT_MEDIA_URL = "http://localhost:3000/static/media/astronaut.dff6e3fe.png";

    private static final String ALIEN_ID = "alien";
    private static final String ALIEN_LABEL = "Alien";
    private static final String ALIEN_LABEL_ID = "labelAlien";
    private static final String ALIEN_MEDIA_URL = "http://localhost:3000/static/media/alien.7df8c8b4.png";

    private static final int AVATAR_HEIGHT = 100;
    private static final int AVATAR_WIDTH = 100;

    private static final String SOURCE_ATTRIBUTE = "src";
    private static final String HEIGHT_ATTRIBUTE = "height";
    private static final String WIDTH_ATTRIBUTE = "width";

    @Before
    public void init() {
        System.setProperty(CHROME_DRIVER, CHROME_DRIVER_PATH);
        driver = new ChromeDriver();
        driver.get(LOCAL_SUMMARY_URL);
    }

    // HAPPY PATH -- check the image of the avatar
    @Test
    public void testWizard() {
        testAvatar(WIZARD_MEDIA_URL, WIZARD_ID, WIZARD_LABEL, WIZARD_LABEL_ID);
    }

    @Test
    public void testKnight() {
        testAvatar(KNIGHT_MEDIA_URL, KNIGHT_ID, KNIGHT_LABEL, KNIGHT_LABEL_ID);
    }

    @Test
    public void testScientist() {
        testAvatar(SCIENTIST_MEDIA_URL, SCIENTIST_ID, SCIENTIST_LABEL, SCIENTIST_LABEL_ID);
    }

    @Test
    public void testRobot() {
        testAvatar(ROBOT_MEDIA_URL, ROBOT_ID, ROBOT_LABEL, ROBOT_LABEL_ID);
    }

    @Test
    public void testAstronaut() {
        testAvatar(ASTRONAUT_MEDIA_URL, ASTRONAUT_ID, ASTRONAUT_LABEL, ASTRONAUT_LABEL_ID);
    }

    @Test
    public void testAlien() {
        testAvatar(ALIEN_MEDIA_URL, ALIEN_ID, ALIEN_LABEL, ALIEN_LABEL_ID);
    }

    private void testAvatar(String mediaURL, String imageID, String label, String labelID) {
        Assert.assertEquals(mediaURL, getAttribute(imageID, SOURCE_ATTRIBUTE));
        Assert.assertEquals(AVATAR_HEIGHT, Integer.parseInt(getAttribute(imageID, HEIGHT_ATTRIBUTE)));
        Assert.assertEquals(AVATAR_WIDTH, Integer.parseInt(getAttribute(imageID, WIDTH_ATTRIBUTE)));
        Assert.assertEquals(label, getText(labelID));
    }

    private String getAttribute(String imageID, String attributeName) {
        return driver.findElement(By.id(imageID)).getAttribute(attributeName);
    }

    private String getText(String labelID) {
        System.out.println(labelID);
        return driver.findElement(By.id(labelID)).getText();
    }
}