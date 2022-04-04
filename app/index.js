/* eslint-disable no-unused-vars */
/* eslint-disable no-new */

import each from 'lodash/each';

// import './utils/scroll';

import Navigation from './components/Navigation';
import Gallery from './components/Gallery';
import Header from './components/Header';

class App {
  constructor() {
    this.createContent();
    this.createNavigation();
    this.createHeader();
    this.createFilter();

    this.addLinkListeners();
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template,
    });
  }

  createHeader() {
    if (this.template === 'home') {
      this.header = new Header({
        template: this.template,
      });
    }
  }

  createFilter() {
    if (
      this.template === 'face' ||
      this.template === 'bedroom' ||
      this.template === 'nudity' ||
      this.template === 'outdoor' ||
      this.template === 'people' ||
      this.template === 'religion' ||
      this.template === 'tattoo'
    ) {
      this.gallery = new Gallery({
        template: this.template,
      });
    }
  }

  /*
   * Events
   */

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: true,
    });
  }

  async onChange({ url, push = true }) {
    document.querySelector('.content').scrollTo({ top: 0, behavior: 'smooth' });

    if (this.gallery) {
      await this.gallery.destroy();
    }

    const res = await window.fetch(url);

    if (res.status === 200) {
      const html = await res.text();
      const div = document.createElement('div');

      if (push) {
        window.history.pushState({}, '', url);
      }

      div.innerHTML = html;

      const divContent = div.querySelector('.content');

      this.template = divContent.getAttribute('data-template');

      this.navigation.onChange(this.template);

      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML;

      this.createHeader();
      this.createFilter();

      this.addLinkListeners();
    } else {
      console.error(`response status: ${res.status}`);
    }
  }

  /*
   * Listeners
   */

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    links.forEach((link) => {
      link.onclick = (event) => {
        event.preventDefault();

        const { href } = link;
        this.onChange({ url: href });
      };
    });
  }
}

new App();
