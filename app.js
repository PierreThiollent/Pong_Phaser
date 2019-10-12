// Config du jeu
const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	parent: 'phaser',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 0
			}
		}
	},
	backgroundColor: '#2A363B',
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

/* ------------
    VARIABLES
  ------------- */

const PADDLE = {
	width: 14,
	height: 400,
	speed: 400
};
const BALL = {
	speed: 400
};
let player1, player2, ball;
let keyA, keyQ, keyUp, keyDown;

// Fonction de préchargement du jeu
function preload() {
	// On charge l'image du paddle
	this.load.image('paddle', 'img/paddle.png');

	// On charge l'image de la balle
	this.load.image('ball', 'img/ball.png');
}

// Fonction de chargement du jeu
function create() {
	// On instancie deux nouveaux joueurs : un a gauche et un a droite
	player1 = new Player(this, 'LEFT');
	player2 = new Player(this, 'RIGHT');

	// On instancie une nouvelle balle
	ball = new Ball(this);

	// On définit les touches pour déplacer les paddles
	keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
	keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
	keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

	// On ajoute la collision de la balle avec les paddles
	this.physics.add.collider(ball.ball, player1.paddle, () => {
		ball.accelerate();
	});

	this.physics.add.collider(ball.ball, player2.paddle, () => {
		ball.accelerate();
	});
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

	// Si la balle touche le côté droit
	if (ball.ball.body.blocked.right) {
		// On ajoute un point au joueur 1
		player1.win();
		// On remet la balle au milieu
		ball.init();
		// Sinon si la balle touche le côté gauche
	} else if (ball.ball.body.blocked.left) {
		// On ajoute un point au joueur 2
		player2.win();
		// On remet la balle au milieu
		ball.init();
	}

	if (player1.points > 5 || player2.points > 5) {
		initGame();
	}
}


class Player {
	// On initialise notre objet paddle
	constructor(self, side) {
		this.paddle = this.createPaddle(self, side);
		this.points = 0;
		this.text = this.createText(self, side);
	}

	// Méthode définissant la position x du paddle (droit ou gauche)
	createPaddle(self, side) {
		let x;
		let y = game.canvas.height / 2;

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

		// On empeche les paddle de sortir du jeu
		paddle.body.collideWorldBounds = true;

		// Le padlle ne peut plus etre déplacé par la balle
		paddle.body.immovable = true;

		return paddle;
	}

	// Methode gerant la montée des paddles
	toTop() {
		this.paddle.setVelocity(0, -PADDLE.speed);
	}

	// Methode gerant la descente des paddles
	toBottom() {
		this.paddle.setVelocity(0, PADDLE.speed);
	}

	// Mise a jour du score et du texte
	win() {
		this.points++;
		this.updateScore();
	}

	// Ajout du texte pour les points
	createText(self, side) {
		let textConfig = {
			x: game.canvas.width / 4,
			y: game.canvas.height / 2,
			text: this.points,
			style: {
				fontSize: '65px',
				color: '#FFFFFF30',
				fontFamily: 'Arial'
			}
		};

		if (side == 'RIGHT') {
			textConfig.x = (game.canvas.width / 4) * 3;
		}

		let text = self.make.text(textConfig);
		return text;
	}

	updateScore() {
		this.text.setText(this.points);
	}

	init() {
		this.points = 0;
		this.updateScore();
		let y = game.canvas.height / 2;
		this.paddle.setY(y);
	}
}

class Ball {
	// On construit notre objet ball
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

	// Methode qui initialise le déplacement de la balle
	init() {
		let x = game.canvas.width / 2;
		let y = game.canvas.height / 2;
		this.ball.setX(x);
		this.ball.setY(y);

		// On calcule la vitesse de la balle au carré
		let ball_speed_square = Math.pow(BALL.speed, 2);

		// On lui génére une vitesse aléatoire
		let velocity_x = random(ball_speed_square / 3, ball_speed_square);
		let velocity_y = ball_speed_square - velocity_x;

		// On divise la vitesse afin que ça ne soit pas trop rapide
		velocity_x = Math.sqrt(velocity_x);
		velocity_y = Math.sqrt(velocity_y);

		// Génération d'une trajectoire aléatoire pour la balle
		let rand_bool_x = Math.random() >= 0.5;
		let rand_bool_y = Math.random() >= 0.5;

		if (rand_bool_x) {
			velocity_x = -velocity_x;
		}

		if (rand_bool_y) {
			velocity_y = -velocity_y;
		}

		this.ball.setVelocity(velocity_x, velocity_y);
	}

	// Fonction permettant d'accélérer la balle a chaque collision avec les paddles
	accelerate() {
		// On récupère sa vitesse
		let velocity = this.ball.body.velocity;
		// On définit l'accélération
		let acceleration = Math.floor(BALL.speed / 7);

		// Si l'accélération n'est pas négative on l'additionne sinon son contraire
		velocity.x += velocity > 0 ? velocity : -acceleration;
		velocity.y += velocity > 0 ? velocity : -acceleration;

		// On set la nouvelle vitesse
		this.ball.setVelocity(velocity.x, velocity.y);
	}
}

// Méthode pour la vitesse aléatoire
function random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function initGame() {
	ball.init();
	player1.init();
	player2.init();
}

// On instancie un nouveau jeu en lui passant la config
var game = new Phaser.Game(config);
