import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Component from 'classes/Component';
import Detection from '../classes/Detection';

GSAP.registerPlugin(ScrollTrigger);

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      elements: {
        links: '.navigation__list__item',
        toggle: '.navigation__mobile__toggle',
        language: '.navigation__langauge__item',
      },
    });

    this.isOpen = false;
    this.language = '';

    if (!Detection.isPhone()) {
      this.onScroll();
    }

    this.onChange(template);
    this.getLanguageCookie();
    this.addEventListeners();
  }

  onScroll() {
    const navigation = document.querySelector('.navigation');
    const timeline = GSAP.timeline({
      scrollTrigger: {
        scroller: 'body',
        trigger: '#trigger',
        start: 'top 80rem',
        end: '+=50',
        // markers: true,
        toggleActions: 'play none reverse',
      },
    });

    timeline.to(navigation, {
      padding: '2.5rem 0',
      ease: 'expo.inOut',
    });
  }

  onChange(template) {
    document
      .querySelectorAll('.navigation__list__item__active')
      .forEach((elem) =>
        elem.classList.remove('navigation__list__item__active')
      );

    if (
      template === 'face' ||
      template === 'bedroom' ||
      template === 'nudity' ||
      template === 'outdoor' ||
      template === 'people' ||
      template === 'religion' ||
      template === 'tattoo'
    ) {
      document
        .querySelector('#' + template)
        .classList.add('navigation__list__item__active');
    }
  }

  toggleNavigation() {
    const content = document.querySelector('.content');

    const timeline = GSAP.timeline({
      duration: 0.2,
      ease: 'expo.inOut',
    })
      .fromTo(
        content,
        {
          opacity: 1,
          filter: 'blur(0px)',
        },
        {
          opacity: 0.1,
          filter: 'blur(5px)',
        },
        0
      )
      .fromTo(
        this.elements.links,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          stagger: 0.1,
        },
        0
      );

    if (this.isOpen) {
      this.isOpen = false;
      timeline.reverse(0).then(() => {
        this.elements.links.forEach((elem) => {
          elem.style.display = 'none';
        });
      });
    } else {
      this.isOpen = true;
      this.elements.links.forEach((elem) => {
        elem.style.display = 'block';
      });
      // timeline.play();
    }
  }

  clickLanguageButton() {
    document
      .querySelectorAll('.navigation__langauge__item__active')
      .forEach((elem) =>
        elem.classList.remove('navigation__langauge__item__active')
      );

    this.classList.add('navigation__langauge__item__active');
  }

  getLanguageCookie() {
    const cookie = {};
    document.cookie.split(';').forEach((elem) => {
      const [key, value] = elem.split('=');
      cookie[key.trim()] = value;
    });
    this.language = cookie.language;

    document
      .querySelector('#' + this.language)
      .classList.add('navigation__langauge__item__active');
  }

  addEventListeners() {
    this.elements.toggle.addEventListener(
      'click',
      this.toggleNavigation.bind(this)
    );

    this.elements.language.forEach((elem) =>
      elem.addEventListener('click', this.clickLanguageButton)
    );

    if (Detection.isPhone()) {
      this.elements.links.forEach((elem) =>
        elem.addEventListener('click', this.toggleNavigation.bind(this))
      );
    }
  }
}
