// Config du jeu
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 300,
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};


// Fonction de préchargement du jeu
function preload() {

}

// Fonction de chargement du jeu
function create() {

}

// Fonction d'éxécution du jeu
function update() {

}

// On instancie un nouveau jeu en lui passant la config
var game = new Phaser.Game(config);
