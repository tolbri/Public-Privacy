/* eslint-disable no-unused-vars */
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Component from '../classes/Component';
import Charts from './Charts';

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
    this.addScrollTrigger();
    this.addCharts();
  }

  addCharts() {
    ScrollTrigger.create({
      scroller: 'body',
      trigger: '#country__chart',
      start: 'center 80%',
      // markers: true,
      once: true,
      onEnter: () => {
        this.charts = new Charts();
      },
    });
  }

  addScrollTrigger() {
    ScrollTrigger.batch('.gallery__image__wrapper', {
      // interval: 0.1, // time window (in seconds) for batching to occur.
      // batchMax: 3, // maximum batch size (targets)
      onEnter: (batch) => GSAP.to(batch, { autoAlpha: 1, stagger: 0.1 }),
      // also onLeave, onEnterBack, and onLeaveBack
      // also most normal ScrollTrigger values like start, end, etc.
      scroller: 'body',
      ease: 'expo.inOut',
    });
  }

  show() {
    const overlay = document.querySelector('.overlay__active');
    if (overlay) {
      overlay.classList.remove('overlay__active');
    }
    this.classList.add('overlay__active');

    const commentImage = document.querySelector('.filter__preview__media');
    const commentContent = document.querySelector('.filter__comment__content');
    const commentDate = document.querySelector('.filter__date');
    const commentCountry = document.querySelector('.filter__flag');
    const commentSpend = document.querySelector('.filter__total__spend__value');
    const commentReward = document.querySelector(
      '.filter__total__reward__value'
    );

    const image = this.getAttribute('data-image');
    const content = this.getAttribute('data-review');
    const date = this.getAttribute('data-date');
    const country = this.getAttribute('data-country');
    const spend = this.getAttribute('data-spend');
    const reward = this.getAttribute('data-reward');

    commentImage.setAttribute('src', './img/600x800/' + image);
    commentContent.innerHTML = content;
    commentDate.innerHTML = date;
    commentCountry.setAttribute('src', './flags/' + country + '.svg');
    commentSpend.innerHTML = spend;
    commentReward.innerHTML = reward;
  }

  async destroy() {
    this.removeAllListeners();

    if (this.charts) {
      this.charts.destroy();
    }

    const tiles = document.querySelectorAll('.gallery__image__wrapper');

    const timeline = GSAP.timeline({
      duration: 1,
      ease: 'expo.inOut',
    }).to(
      tiles,
      {
        opacity: 0,
      },
      0
    );

    await timeline.play();
  }

  addEventListeners() {
    this.elements.images.forEach((elem) => {
      elem.addEventListener('click', this.show);
      // elem.addEventListener('touchenter', this.show);
    });
  }
}
