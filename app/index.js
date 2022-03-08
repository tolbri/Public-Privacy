/* eslint-disable no-unused-vars */
/* eslint-disable no-new */

import each from 'lodash/each';

import Navigation from './components/Navigation';

class App {
  constructor() {
    this.createContent();
    this.createNavigation();

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

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();

        const { href } = link;
        this.onChange({ url: href });
      };
    });
  }
}

new App();