/* eslint-disable no-param-reassign */
import Spell from 'spell';

const NUMBER_OF_SLASHES = 4;

const animations = {
  summon: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35],
  idle: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  shatter: [48, 49, 50, 51, 52, 53, 54],
};

class Slash extends Spell {
  create() {
    // the slash spells spawn 4 slash stacks
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < NUMBER_OF_SLASHES; i++) {
      const slash = this.game.add.sprite(0, 0, 'slash');
      slash.anchor.set(0.5);

      // add the animations in
      const summon = slash.animations.add('summon', animations.summon);
      slash.animations.add('idle', animations.idle);
      slash.animations.add('shatter', animations.shatter);

      // when the summon completes
      // we play the idle animation
      summon.onComplete.add(() => {
        slash.play('idle', this.game.rnd.between(5, 10), true);
      });

      this.group.push(slash);
    }
  }

  perform() {
    this.group.forEach((slash) => {
      // pick a random target
      const target = this.game.rnd.pick(this.zombies.filter(e => e.alive));

      // flag it so we don't pick it out from the list again
      target.alive = false;

      // store a reference, we need to access it later on
      slash.target = target;

      // spawn the slash on the target's position
      // offset a bit so it appears below the target
      slash.x = target.x;
      slash.y = target.y + 20;

      // random size, revive and play the animation
      slash.scale.set(this.game.rnd.realInRange(0.5, 0.8));
      slash.alpha = 1;
      slash.revive();
      slash.play('summon', 25, false);

      // freeze the target after a few ms after the lightning plays
      this.game.time.events.add(300, () => {
        // tween the target to blue
        this.tweenTint(target, 0xffffff, 0xD10A10, 500);
        // and stop it's animation
        target.animations.paused = true;
      });
    });
  }

  expire() {
    this.group.forEach((slash) => {
      // after the spell expires, we play the shatter animation
      slash.play('shatter', 15, false, true);

      // can be re-targeted
      slash.target.alive = true;

      // tween the target back to its original color
      this.tweenTint(slash.target, 0xE8E2B0, 0xffffff, 500);

      // resume target's animation
      slash.target.animations.paused = false;
    });
  }

  tweenTint(obj, startColor, endColor, time) {
    // create an object to tween with our step value at 0
    const colorBlend = { step: 0 };

    // create the tween on this object and tween its step property to 100
    const colorTween = this.game.add.tween(colorBlend).to({ step: 100 }, time);

    // run the interpolateColor function every time the tween updates, feeding it the
    // updated value of our tween each time, and set the result as our tint
    colorTween.onUpdateCallback(() => {
      obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
    });

    // set the object to the start color straight away
    obj.tint = startColor;

    // start the tween
    colorTween.start();
  }
}

export default Slash;