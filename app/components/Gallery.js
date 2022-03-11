import Component from '../classes/Component';

export default class Gallery extends Component {
  constructor(template) {
    super({
      elements: {
        images: '.filter__price',
      },
    });

    this.addEventListeners();
  }

  show() {
    const preview = document.querySelector('.filter__preview__media');
    const image = this.getAttribute('data-image');
    preview.setAttribute('src', './img/600x800/' + image);
  }

  addEventListeners() {
    this.elements.images.forEach((elem) => {
      elem.addEventListener('mouseenter', this.show);
      elem.addEventListener('touchenter', this.show);
    });
  }
}
