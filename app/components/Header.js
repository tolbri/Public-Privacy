import GSAP from 'gsap';

import Component from '../classes/Component';
import Detection from '../classes/Detection';

export default class Header extends Component {
  constructor(template) {
    super({
      elements: {
        stream: '.home__image__stream',
        media: '.home__stream__media',
      },
    });

    this.start = {
      x: 0,
      y: 0,
    };

    this.end = {
      x: 1000,
      y: 1000,
    };

    this.streamWidth = window.innerWidth;
    this.streamHeight = window.innerHeight;

    this.media = this.elements.media;
    this.template = template;
    this.boundingRectangle();
    this.animateImages();
  }

  animateImages() {
    let stagger;
    if (Detection.isPhone()) {
      stagger = 6;
    } else {
      stagger = 3;
    }

    const numberOfTargets = this.media.length;
    const duration = this.media.length;

    const repeatDelay = duration * (numberOfTargets - 1);

    GSAP.fromTo(
      this.media,
      {
        scale: 2,
        x: -400,
        y: this.streamHeight,
        rotateZ: 90,
        duration: duration,
        ease: 'slow (0.1, 0.7, false)',
        stagger: {
          each: stagger,
          repeat: 1,
          repeatDelay: repeatDelay,
        },
      },
      {
        scale: 0.5,
        x: this.streamWidth + 200,
        y: this.streamHeight / 2,
        rotateZ: -45,
        duration: duration,
        ease: 'slow (0.1, 0.7, false)',
        stagger: {
          each: stagger,
          repeat: 1,
          repeatDelay: repeatDelay,
        },
      }
    );
  }

  boundingRectangle() {
    const box = this.elements.stream.getBoundingClientRect();

    /* this.streamWidth = box.width;
    this.streamWidth = box.height; */
  }
}
