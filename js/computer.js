/*global Player */
var Computer = function () {
    Player.call(this);
    this.names = ['Amiga', 'Atari', 'Z80'];
};


Computer.prototype = Object.create(Player.prototype);


Computer.prototype.createName =  function () {
       var number = Math.floor((Math.random() * 3));
       this.name = this.names[number];
};

Computer.prototype.calculateChoice = function (length) {
    return Math.floor((Math.random() * length));
};
