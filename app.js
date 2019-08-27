// Config du jeu
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 300,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

/* ------------
    VARIABLES
  ------------- */

const PADDLE = { width: 14, height: 100, speed: 200 };
const BALL = { speed: 200 };
let player1, player2, ball;
let keyA, keyQ, keyUp, keyDown;


// Fonction de préchargement du jeu
function preload() {
    // On charge l'image du paddle
    this.load.image('paddle', 'img/paddle.png')

    // On charge l'image de la balle
    this.load.image('ball', 'img/ball.png')

}


// Fonction de chargement du jeu
function create() {
    // On instancie deux nouveaux joueurs : un a gauche et un a droite
    player1 = new Player(this, 'LEFT');
    player2 = new Player(this, 'RIGHT');

    ball = new Ball(this);

    // On définit les touches pour déplacer les paddle
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
}


// Fonction d'éxécution du jeu
function update() {
    // Si la touche A est enfoncée
    if (keyA.isDown) {
        // On fait monter le paddle
        player1.toTop();
        // Sinon si la touche Q est enfoncée
    } else if (keyQ.isDown) {
        // On fait descendre le paddle
        player1.toBottom();
    }
    // Si la touche Haut est enfoncée
    if (keyUp.isDown) {
        // On fait monter le paddle
        player2.toTop();
        // Sinon si la touche Bas est enfoncée
    } else if (keyDown.isDown) {
        // On fait descendre le paddle
        player2.toBottom();
    }
}

class Player {
    // On initialise notre objet paddle
    constructor(self, side) {
        this.paddle = this.createPaddle(self, side);
    }

    // Méthode définissant la position x du paddle droit ou gauche
    createPaddle(self, side) {
        let x;
        let y = game.canvas.height / 2

        // Si le coté est left
        if (side == 'LEFT') {
            // On calcule la position x en divisant la largeur de l'image par 2
            x = PADDLE.width / 2;
            // Sinon si le coté est droit
        } else if (side == 'RIGHT') {
            // On calcule la position x en soustrayant la taille du paddle/2 a la largeur du canvas
            x = game.canvas.width - PADDLE.width / 2;
        }

        let paddle = self.physics.add.image(x, y, 'paddle');
        paddle.body.collideWorldBounds = true;

        return paddle;
    }

    // Methode gerant la montée du paddle
    toTop() {
        this.paddle.setVelocity(0, -PADDLE.speed);
    }

    // Methode gerant la descente du paddle
    toBottom() {
        this.paddle.setVelocity(0, PADDLE.speed);
    }

}


class Ball {
    // On initialise notre objet ball
    constructor(self) {
        this.ball = this.createBall(self);
        this.init();
    }

    // Méthode définissant la position x et y de la balle
    createBall(self) {
        let x = game.canvas.width / 2;
        let y = game.canvas.height / 2;

        let ball = self.physics.add.image(x, y, 'ball');
        ball.body.collideWorldBounds = true;
        ball.setBounce(1);

        return ball;
    }

    init() {
        this.ball.setVelocity(BALL.speed, BALL.speed);
    }
}


// On instancie un nouveau jeu en lui passant la config
var game = new Phaser.Game(config);
