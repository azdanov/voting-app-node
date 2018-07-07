import { library } from '@fortawesome/fontawesome';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import faAt from '@fortawesome/fontawesome-free-solid/faAt';
import faBug from '@fortawesome/fontawesome-free-solid/faBug';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faFileAlt from '@fortawesome/fontawesome-free-solid/faFileAlt';
import faKey from '@fortawesome/fontawesome-free-solid/faKey';
import faSignInAlt from '@fortawesome/fontawesome-free-solid/faSignInAlt';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faUserSecret from '@fortawesome/fontawesome-free-solid/faUserSecret';
import { initBurger } from './burger';
import { initModal } from './modal';

library.add(
  faTwitter,
  faGithub,
  faFileAlt,
  faUser,
  faUserSecret,
  faSignInAlt,
  faAt,
  faKey,
  faEnvelope,
  faBug,
);

document.addEventListener('DOMContentLoaded', () => {
  initBurger();

  initModal();

  if (window.location.pathname.includes('/poll/')) {
    import('./chart').then(chart => {
      chart.initChart();
    });
  }
});
