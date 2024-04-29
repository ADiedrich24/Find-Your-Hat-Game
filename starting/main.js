//const prompt = require('prompt-sync')({sigint: true});
const keypress = require('keypress');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


class Field {
    constructor() {
        this.field = [];
        this.current = [0, 0];
        this.gameOver = false;
        this.inCommandMode = true;
    }

    listenForKeyPress() {
        process.stdin.on('keypress', (ch, key) => {
            if (key) {
                if (key.ctrl && key.name === 'c') {
                    console.log('Exiting game...')
                    process.exit();
                } else if (!this.inCommandMode) {
                    const directionMap = {left: 'left', right: 'right', up: 'up', down: 'down', w: 'up', a: 'left', s: 'down', d: 'right'};
                    const direction = directionMap[key.name];
                    if (direction && !myField.gameOver) {
                        this.move(direction);
                    }
                }
            }
        });
    }

//Initiates the game with a warm welcome and some directions
    start() {
        this.field = [];
        this.current = [0, 0];
        this.gameOver = false;

        console.log('You are now playing: Find Your Hat');
        console.log('The goal of the game is to get to your hat (^) without falling off the board or in the holes (O). Your character is (*).');
        this.askQuestion();
    }
//Asks the user what difficulty they would like to play on
    askQuestion() {
        rl.question('Please type easy, medium, or hard to select your level: ', (answer) => {
            const level = answer.toLowerCase();
    //Based on difficulty selected, generates the field accordingly.    
            switch(level) {
                case 'easy':
                    this.generateField(20, 5, 0.2);
                    console.log('\nLet the game begin!');
                    this.print();
                    this.inCommandMode = false;
                    break;
                case 'medium':
                    this.generateField(40, 7, 0.4);
                    console.log('\nLet the game begin!');
                    this.print();
                    this.inCommandMode = false;
                    break;
                case 'hard':
                    this.generateField(60, 10, 0.6);
                    console.log('\nLet the game begin!');
                    this.print()
                    this.inCommandMode = false;
                    break;
                default:
                    console.log('Invalid entry. Type (easy, medium, or hard)');
                    this.askQuestion();
                    break;
            }
        }
    )}
//Returns a random number for various uses throughout the project    
    generateRandom(num) {
        return Math.floor(Math.random() * num);
    }

//Generates the field based on input from difficulty selected
    generateField(width, height, numHoles) {
        let holes = Math.floor((width + height) * numHoles);
        let field = new Array(height).fill(null).map(() => new Array(width).fill(fieldCharacter));
        let hatPosition, playerPosition;

    //Makes sure hat and player do not start in the same spot
        do {
            hatPosition = [this.generateRandom(height), this.generateRandom(width)];
            playerPosition = [this.generateRandom(height), this.generateRandom(width)];
        } while (hatPosition[0] === playerPosition[0] && hatPosition[1] === playerPosition[1]);

    //Places hat
        field[hatPosition[0]][hatPosition[1]] = hat;

    //Places holes
        for (let i = 0; i < holes; i++) {
            let holePosition;

            do {
                holePosition = [this.generateRandom(height), this.generateRandom(width)];
            } while (
                (holePosition[0] === hatPosition[0] && holePosition[1] === hatPosition[1]) || (holePosition[0] === playerPosition[0] && holePosition[1] === playerPosition[1]) || field[holePosition[0]][holePosition[1]] === hole
            );

            field[holePosition[0]][holePosition[1]] = hole;
        };

    //Places the player
        this.current = playerPosition;
        field[playerPosition[0]][playerPosition[1]] = pathCharacter;

        this.field = field;
    }

//General print statement to log elements    
    print() {
        console.clear();
        this.field.forEach(row => console.log(row.join(' ')));
    }

//Moves the pathCharacter depending on input
    move(direction) {
        let [i, j] = this.current;

        switch (direction) {
            case 'left':
                j--;
                break;
            case 'right':
                j++;
                break;
            case 'up':
                i--;
                break;
            case 'down':
                i++;
                break;
            default:
                console.log('Invalid direction');
                return;
        }

        if (i < 0 || i >= this.field.length || j < 0 || j >= this.field[i].length) {
            console.log('\nWomp... womp... womppp you fell off the board. GAME OVER!');
            this.gameOver = true;
        } else if (this.field[i][j] === hole) {
            console.log('\nYou fell in a hole, farewell. GAME OVER!');
            this.gameOver = true;
        } else if (this.field[i][j] === hat) {
            console.log('\nYou found your hat. CONGRATS!');
            this.gameOver = true;
        } else {
            this.field[this.current[0]][this.current[1]] = fieldCharacter;
            this.field[i][j] = pathCharacter;
            this.current = [i, j];
            this.print();
        }

        if (this.gameOver) {
            process.stdin.pause();
            rl.close();
        }
    }
}

keypress(process.stdin);

const myField = new Field();
myField.listenForKeyPress();
process.stdin.setRawMode(true);
process.stdin.resume();

myField.start();