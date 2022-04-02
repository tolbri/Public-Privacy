import Component from '../classes/Component';

export default class Header extends Component {
  constructor(template) {
    super({
      elements: {
        stream: '.home__image__stream',
      },
    });

    this.template = template;
    this.addImages();
  }

  addImages() {}
}
