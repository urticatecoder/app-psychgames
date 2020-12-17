# Install Instructions

1. Git clone the repository from Gitlab or from the private Github that will be created by Eric and Nick for their Winter work. Please contact them for access (eric.doppelt@duke.edu).
2. Once the repository is cloned, the required packages will need to be installed. This can be done by running npm install in the correct directory. More specific instructions for deployment are provided below:

1. Clone from Git to local machine.
- Run `git clone` https://github.com/ericdoppelt/psych-games.
2. In terminal, using command cd, open the psych-games directory on your local machine.
3. Install npm, using the following instructions provided here: https://www.npmjs.com/get-npm.
3. Before running application, install node modules and dependencies (backend).
- Run `npm install`.
4. Before running application, install node modules and dependencies (frontend).
- Run `cd frontend`.
- Run `npm install`.
3. Run application
- Run `npm start` in the main directory.
- Open a new terminal, and navigate to the main directory.
- Run `cd frontend`.
- Run `npm start`, open your browser and go to [http://localhost:3000/](http://localhost:3000/)

# Open Source Tools and Libraries

* React: MIT License
* Node.js: MIT License
* Express: MIT License
* Socket.io: MIT License
* Mongoose: MIT License
* Mocha: MIT License
* Axios: MIT License
* Moment: MIT License

Code from Stackoverflow:
Our code repo contains some code we found on Stackoverflow with slight modification. All of them are covered under MIT License based on Stackoverflow's code contribution policy. More details can be found [here](https://meta.stackexchange.com/questions/271080/the-mit-license-clarity-on-using-code-on-stack-overflow-and-stack-exchange).

In addition, our package.json lists all of the versions of any library used in our application.

# Data Changes
Currently, the only data that is used or collected is in mongoDB. In order to access this information that is created throughout each research study with the correct results information, our team has created a separate web route that has an intuitive UI. The '/adminLogin' and '/admin' route allow the researchers to download the data for each game during a given time window by means of a React webpage.

Over the winter break, Nick will be creating a mechanism that will store the accepted prolific IDs in mongoDB. Currently, all prolific IDs are accepted by the site. We envision adding in another feature to the Admin component where Mel will be able to add a Collection with acceptable prolific IDs once  users begin using the application.

In terms of parameters for the research study (such as the number of turns and payout odds in Game Two), these are all either hard-coded or random. This is due to thhe nature of the experiment, as once it begins, these variables cannot be changed (as it would ruin the study). So, these is no way to manipulate these variables.

If one wants to modify the tutorial, they will not have to change a single line of code. Instead, our clienst must simply upload a new video file to the Tutorials folder in public with the name "GameOneTutorial" or "GameTwoTutorial". Likewise, if our clienst prefer to display text instructions instead, they onle need to modify the .txt files given in the Instructions folder in the same package. Deprecated code still exists to display these instructions, although it was replaced by the videos. However, if our cliens change their mind and prefer written text, all of the code needed exists, as it was developed in Spint 3. 
