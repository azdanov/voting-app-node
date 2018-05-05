import { initBurger } from './burger';
import { initChart } from './chart';
import { initModal } from './modal';

document.addEventListener('DOMContentLoaded', () => {
  initBurger();

  initModal();

  initChart();
});
