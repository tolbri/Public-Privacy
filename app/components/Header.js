import GSAP from 'gsap';

import Component from '../classes/Component';
import Detection from '../classes/Detection';
import Type from './Type';

export default class Header extends Component {
  constructor(template) {
    super({
      elements: {
        stream: '.home__image__stream',
        media: '.home__stream__media',
        description: '.home__description',
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

    this.description = this.elements.description;
    this.media = this.elements.media;
    this.template = template;

    this.animateImages();
    this.animateType();
    this.addSample();
  }

  animateImages() {
    let stagger;
    if (Detection.isPhone()) {
      stagger = 1;
    } else {
      stagger = 0.5;
    }

    const duration = this.media.length / 4;

    GSAP.fromTo(
      this.media,
      {
        scale: 2,
        x: -400,
        y: this.streamHeight,
        z: 1,
        rotateZ: 90,
        duration: duration,
        ease: 'slow (0.1, 0.7, false)',
        stagger: {
          each: stagger,
          repeat: -1,
          repeatDelay: duration,
        },
      },
      {
        scale: 0.5,
        x: this.streamWidth + 200,
        y: this.streamHeight / 2,
        z: -1,
        rotateZ: -45,
        duration: duration,
        ease: 'slow (0.1, 0.7, false)',
        stagger: {
          each: stagger,
          repeat: -1,
          repeatDelay: duration,
        },
      }
    );
  }

  animateType() {
    const typeElement = document.getElementById('typewrite');

    const toRotate = typeElement.getAttribute('data-type');
    const period = typeElement.getAttribute('data-period');

    if (toRotate) {
      this.type = new Type(typeElement, JSON.parse(toRotate), period);
    }
  }

  showHighlight() {
    const currentPointer = document.querySelector('.home__pointer');
    if (currentPointer) {
      currentPointer.remove();
    }

    const id = this.getAttribute('data-highlight');
    const target = document.querySelector('#' + id);

    const elementsToHide = document.querySelectorAll(
      '#preview, #spend, #reward, #date, #comment'
    );
    elementsToHide.forEach((elem) => {
      elem.style.opacity = '0.2';
    });

    const bordersToHide = document.querySelectorAll(
      '.home__preview__wrapper, .filter__gallery__comment__wrapper, .filter__comment__header'
    );
    bordersToHide.forEach((elem) => {
      elem.style.borderColor = 'rgba(0,0,0, 0.5)';
    });

    const box = target.getBoundingClientRect();
    const position = {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2,
    };

    const pointer = document.createElement('div');
    pointer.classList.add('home__pointer');
    document.body.append(pointer);
    pointer.style.left = position.x + 'px';
    pointer.style.top = position.y + 'px';

    target.style.opacity = '1';
  }

  addSample() {
    this.description.forEach((elem) => {
      const html = elem.textContent;
      const domElement = document.createElement('div');

      domElement.classList.add('home__description');
      domElement.innerHTML = html;

      elem.replaceWith(domElement);
    });

    const buttons = document.querySelectorAll('[data-highlight]');
    buttons.forEach((button) => {
      button.addEventListener('click', this.showHighlight);
    });
  }
}
