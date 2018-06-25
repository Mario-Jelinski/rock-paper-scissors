var Player = function () {

    this.score = 0;
    this.name = "Player";
};

Player.prototype = {
    setScore: function (score) {
        this.score = score;
    },
    getScore: function () {
        return this.score;
    },
    setName: function (name) {
        this.name = name;
    },
    getName: function () {
        return this.name;
    }
};