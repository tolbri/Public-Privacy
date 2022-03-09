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

    if (!Detection.isPhone()) {
      this.onScroll();
    }

    this.onChange(template);
    this.updateLanguage();
  }

  onScroll() {
    const navigation = document.querySelector('.navigation');
    const timeline = GSAP.timeline({
      scrollTrigger: {
        scroller: '.content',
        trigger: '#trigger',
        start: 'top 100',
        end: '+=10',
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
      template === 'faces' ||
      template === 'indoor' ||
      template === 'nudity' ||
      template === 'outdoor' ||
      template === 'people' ||
      template === 'religion' ||
      template === 'tattoos'
    ) {
      document
        .querySelector('#' + template)
        .classList.add('navigation__list__item__active');
    }
  }

  toggleNavigation() {
    const content = document.querySelector('.content');

    const timeline = GSAP.timeline({
      duration: 0.1,
      ease: 'expo.inOut',
    })
      .fromTo(
        content,
        {
          z: 0,
          filter: 'blur(0px)',
          opacity: 1,
        },
        {
          z: -200,
          filter: 'blur(5px)',
          opacity: 0.2,
        },
        0
      )
      .fromTo(
        this.elements.links,
        {
          display: 'none',
          z: 200,
          opacity: 0,
          filter: 'blur(5px)',
        },
        {
          display: 'block',
          z: 0,
          opacity: 1,
          filter: 'blur(0px)',
        },
        0
      );

    if (this.isOpen) {
      this.isOpen = false;
      timeline.reverse(0);
      content.style.overflow = 'auto';
    } else {
      this.isOpen = true;
      content.style.overflow = 'hidden';
      // timeline.play();
    }
  }

  clickLanguageButton() {
    this.updateLanguage();
    setTimeout(() => {
      window.location.reload();
      return false;
    }, 100);
  }

  updateLanguage() {
    const current = document.querySelector(
      '.navigation__langauge__item__active'
    );

    if (current) {
      current.classList.remove('navigation__langauge__item__active');
    }

    setTimeout(() => {
      const cookie = {};
      document.cookie.split(';').forEach((elem) => {
        const [key, value] = elem.split('=');
        cookie[key.trim()] = value;
      });

      document
        .querySelector('#' + cookie.language)
        .classList.add('navigation__langauge__item__active');
    }, 100);
  }

  addEventListeners() {
    this.elements.toggle.addEventListener(
      'click',
      this.toggleNavigation.bind(this)
    );

    this.elements.language.forEach((elem) =>
      elem.addEventListener('click', this.clickLanguageButton.bind(this))
    );

    if (Detection.isPhone()) {
      this.elements.links.forEach((elem) =>
        elem.addEventListener('click', this.toggleNavigation.bind(this))
      );
    }
  }
}
