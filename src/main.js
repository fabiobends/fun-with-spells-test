import 'babel-polyfill';
import DemoState from 'demo';

class Game extends Phaser.Game {
  constructor() {
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
    const width = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth,
    );

    super(width, height, Phaser.AUTO, 'test', null, true, false);
  }
}

const game = new Game();
game.state.add('DemoState', DemoState, false);
game.state.start('DemoState');
