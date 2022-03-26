import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Component from '../classes/Component';

GSAP.registerPlugin(ScrollTrigger);

export default class Gallery extends Component {
  constructor(template) {
    super({
      elements: {
        images: '.filter__overlay',
      },
    });

    this.template = template;
    this.addEventListeners();
    // this.addScrollTrigger();
  }

  addScrollTrigger() {
    ScrollTrigger.batch('.gallery__image__wrapper', {
      // interval: 0.1, // time window (in seconds) for batching to occur.
      // batchMax: 3, // maximum batch size (targets)
      onEnter: (batch) => GSAP.to(batch, { autoAlpha: 1, stagger: 0.1 }),
      // also onLeave, onEnterBack, and onLeaveBack
      // also most normal ScrollTrigger values like start, end, etc.
      scroller: '.content',
      ease: 'expo.inOut',
    });
  }

  show() {
    const commentImage = document.querySelector('.filter__preview__media');
    const commentContent = document.querySelector(
      '.filter__gallery__comment p'
    );
    const commentDate = document.querySelector('.filter__date');
    const commentCountry = document.querySelector('.filter__flag');
    const commentSpend = document.querySelector('.filter__total__spend span');

    const image = this.getAttribute('data-image');
    const content = this.getAttribute('data-review');
    const date = this.getAttribute('data-date');
    const country = this.getAttribute('data-country');
    const spend = this.getAttribute('data-spend');

    commentImage.setAttribute('src', './img/600x800/' + image);
    commentContent.innerHTML = content;
    commentDate.innerHTML = date;
    commentCountry.setAttribute('src', './flags/' + country + '.svg');
    commentSpend.innerHTML = spend;
  }

  addEventListeners() {
    this.elements.images.forEach((elem) => {
      elem.addEventListener('click', this.show);
      // elem.addEventListener('touchenter', this.show);
    });
  }
}
