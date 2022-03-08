import GSAP from 'gsap';

import Component from 'classes/Component';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      elements: {
        links: '.navigation__list__item',
        toggle: '.navigation__mobile__toggle',
        language: '.navigation__langauge__item',
      },
    });

    this.onChange(template);
    this.changeLanguage();
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
    const isOpen = content.classList.contains('open');

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
          z: -100,
          filter: 'blur(5px)',
          opacity: 0.5,
        },
        0
      )
      .fromTo(
        this.elements.links,
        {
          display: 'none',
          z: 100,
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

    if (isOpen) {
      content.classList.remove('open');

      timeline.reverse(0);
    } else {
      content.classList.add('open');

      timeline.play();
    }
  }

  clickLanguageButton() {
    this.changeLanguage();
    setTimeout(() => {
      window.location.reload();
      return false;
    }, 100);
  }

  changeLanguage() {
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
  }
}
