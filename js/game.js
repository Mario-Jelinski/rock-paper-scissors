/*global Player, Computer, Solver, module */
var Game = function () {
    
    this.config = {
        game_start:    "game-start",
        radio_button:   "game-mode",
        radio_choice:   "choice",
        result_box:     "result-box",
        game_result:    "game-result",
        game_score:    "game-score",
        mode_button:    "switch-mode",
        extended_mode:  "extended-mode",
        choices_box:    "choices-box"
    };

    this.player = null;
    this.computer1 = null;
    this.computer2 = null;

    this.isRunning = false;
    this.solver = null;
    this.framecounter = 0;
    this.intervalID = null;
    
    this.result_box1 = null;
    this.result_box2 = null;
    this.imgArray = [];
    this.choices = ["rock", "paper", "scissors", "lizard", "spock"];
    this.gameMode = "p-vs-c";
    this.maxChoices = 3;
};

Game.prototype = {
    init: function () {
        this.player = new Player;
        this.computer1 = new Computer;
        this.computer2 = new Computer;
        this.solver = new Solver;
        this.solver.init();

        this.computer1.setName('Computer 1');
        this.computer2.setName('Computer 2');

        this.result_box1 = document.getElementById(this.config.result_box + '1');
        this.result_box2 = document.getElementById(this.config.result_box + '2');

        this.initImageElements();
        var game_button_elem = document.getElementById(this.config.game_start);
        game_button_elem.addEventListener("click", this.handler.start.bind(this), false);

        var mode_button_elem = document.getElementById(this.config.mode_button);
        mode_button_elem.addEventListener("click", this.handler.toggleChoices.bind(this), false);

        var game_modes_buttons = document.querySelectorAll('input[name="' + this.config.radio_button + '"]');
        
        for (var i = 0; i < game_modes_buttons.length; i++) {
            game_modes_buttons[i].addEventListener("change", this.handler.toggleMode.bind(this), false);
        }
        
    },    
    initImageElements: function () {    
        this.imgArray[0] = '<img src="img/rock.jpg">';
        this.imgArray[1] = '<img src="img/paper.jpg">';
        this.imgArray[2] = '<img src="img/scissors.jpg">';
        this.imgArray[3] = '<img src="img/lizard.jpg">';
        this.imgArray[4] = '<img src="img/spock.jpg">';
    },
    handler: {
        start: function () {
            if(!this.isRunning) {
                this.isRunning = true;
                document.getElementById(this.config.game_result).innerHTML = '';
                this.gameMode = document.querySelector('input[name="' + this.config.radio_button + '"]:checked').value;
                this.intervalID = setInterval(this.run.bind(this), 100);
            }
        },
        toggleChoices: function () {
            var display = 'none';
            if(this.maxChoices == 3) {
                this.maxChoices = 5;
                display = 'inline';
            }
            else {
                this.maxChoices = 3;
            }

            var extended_buttons = document.getElementsByClassName(this.config.extended_mode);
            for (var i = 0; i < extended_buttons.length; i++) {
                extended_buttons[i].style.display = display;
            }
        },
        toggleMode: function() {
            var display = 'none';
            if(this.gameMode == 'p-vs-c') {
                this.gameMode = 'c_vs_c';
            }
            else {
                this.gameMode = 'p-vs-c';
                display = 'block';
            }
            document.getElementById(this.config.game_score).innerHTML = '';
            document.getElementById(this.config.game_result).innerHTML = '';
            document.getElementById(this.config.choices_box).style.display = display;
            this.player.setScore(0);
            this.computer1.setScore(0);
            this.computer2.setScore(0);
        }
    },
    setRandomPics: function() {
        var number1 = Math.floor((Math.random() * this.maxChoices));
        var number2 = Math.floor((Math.random() * this.maxChoices));
        this.result_box1.innerHTML = this.imgArray[number1];
        this.result_box2.innerHTML = this.imgArray[number2];
    },
    printResult: function (result) {
        var message = '';
        var score1 = 0;
        var score2 = 0;

        if(this.gameMode == 'p-vs-c') {
            if(result == 0)                
                message = 'Tie';
            else if (result == 1) {
                this.player.setScore(this.player.getScore() + 1);
                message = 'You won';
            }
            else {
                this.computer2.setScore(this.computer2.getScore() + 1);
                message = 'You lost';
            }
            score1 = this.player.getScore();
            score2 = this.computer2.getScore();
        }
        else {
            if(result == 0)
                message = 'Tie';
            else {
                var name = '';
                if(result == 1) {
                    this.computer1.setScore(this.computer1.getScore() + 1);
                    name = this.computer1.getName();
                }
                else {
                    this.computer2.setScore(this.computer2.getScore() + 1);
                    name = this.computer2.getName();
                }
                message = name + ' won';
            }

            score1 = this.computer1.getScore();
            score2 = this.computer2.getScore();
        }
        
        document.getElementById(this.config.game_result).innerHTML = message;
        document.getElementById(this.config.game_score).innerHTML = score1 + ' : ' + score2;
    },
    findIndex: function (choice) {
        for (var i = 0; i < this.choices.length; i++) {
            if(this.choices[i] == choice)            
                return i;
        }
        return 0;
    },
    run: function() {
        if (this.framecounter == 30) {
            this.isRunning = false;
            this.framecounter = 0;
            clearInterval(this.intervalID);
            var choice = null;
            if(this.gameMode == 'p-vs-c')
                choice = document.querySelector('input[name="' + this.config.radio_choice + '"]:checked').value;
            else
                choice = this.choices[this.computer1.calculateChoice(this.maxChoices)];

            var choice2 = this.choices[this.computer2.calculateChoice(this.maxChoices)];           
            var result = this.solver.compare(choice, choice2);            
            this.result_box1.innerHTML = this.imgArray[this.findIndex(choice)];
            this.result_box2.innerHTML = this.imgArray[this.findIndex(choice2)];
            this.printResult(result);
        } 
        else {            
            this.setRandomPics();
            this.framecounter++;
        }
    },
};

if (typeof (module) !== 'undefined') {
    module.exports = Game;
}
