import { Howl, Howler } from 'howler';
import { chooseSound } from './chooseSound.js';

// 1 pu pu pu
// 2 cough
// 3 hmm
// 4 - counting cards
// 5 hmmmmmmmm ne tak ne paidet
// 6 hmm vot ono chto
// 7 tak a che ze mne delat
// 8 bitbox

class Sounds {
    constructor(options) {
        this.gameContext = options.context;

        this.random = ['2.mp3', '8.mp3'];

        this.thinking = ['1.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3'];

        this.phrasesCounter = Object.fromEntries(
            [...this.random, ...this.thinking].map((key) => [key, 0]),
        );

        this.playArraySound = this.playArraySound.bind(this);
    }

    playArraySound(array) {
        Howler.stop();

        const selectedSound = chooseSound(array, this.phrasesCounter);

        const endCallback = () => this.gameContext.stopBotAnimation();

        var sound = new Howl({
            src: [`/src/assets/sounds/${selectedSound}`],
            onend: endCallback,
        });

        this.phrasesCounter[selectedSound]++;
        sound.play();
    }

    playRandomSound = () => this.playArraySound(this.random);

    playThinkingSound = () => this.playArraySound(this.thinking);
}

export default Sounds;
