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
    this.load.image('paddle', 'img/paddle.png');
}


// Fonction de chargement du jeu
function create() {
    // On appelle la fonction createPaddle afin d'afficher le paddle du joueur 1 a gauche et du joueur 2 a droite
    player1 = createPaddle(this, 'LEFT');
    player2 = createPaddle(this, 'RIGHT');

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
        // On fait monter la paddle
        player1.setVelocity(0, -100);
        // Sinon si la touche Q est enfoncée
    } else if (keyQ.isDown) {
        // On fait descendre le paddle
        player1.setVelocity(0, 100);
    }
    // Si la touche Haut est enfoncée
    if (keyUp.isDown) {
        // On fait monter le paddle
        player2.setVelocity(0, -100);
        // Sinon si la touche Bas est enfoncée
    } else if (keyDown.isDown) {
        // On fait descendre le paddle
        player2.setVelocity(0, 100);
    }
}

// Fonction définissant la position x du paddle droit ou gauche
function createPaddle(self, side) {
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
    return self.physics.add.image(x, y, 'paddle');
}


// On instancie un nouveau jeu en lui passant la config
var game = new Phaser.Game(config);
