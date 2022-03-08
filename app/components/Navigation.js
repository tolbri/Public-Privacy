import GSAP from 'gsap';

import Component from 'classes/Component';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      elements: {
        links: '.navigation__list__item',
        active: '#' + template,
        toggle: '.navigation__mobile__toggle',
      },
    });

    this.onChange(template);
  }

  onChange(template) {
    this.elements.links.forEach((elem) =>
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
      this.elements.active.classList.add('navigation__list__item__active');
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

  addEventListeners() {
    this.elements.toggle.addEventListener(
      'click',
      this.toggleNavigation.bind(this)
    );
  }
}
