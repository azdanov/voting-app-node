import fontawesome from '@fortawesome/fontawesome';
import { faGithub, faTwitter } from '@fortawesome/fontawesome-free-brands';
import {
  faAt,
  faEnvelope,
  faFileAlt,
  faKey,
  faSignInAlt,
  faUserSecret,
} from '@fortawesome/fontawesome-free-solid';

import { initBurger } from './burger';
import { initChart } from './chart';
import { initModal } from './modal';

fontawesome.library.add(
  faTwitter,
  faGithub,
  faFileAlt,
  faUserSecret,
  faSignInAlt,
  faAt,
  faKey,
  faEnvelope,
);

document.addEventListener('DOMContentLoaded', () => {
  initBurger();

  initModal();

  initChart();
});
