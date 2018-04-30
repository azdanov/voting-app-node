import Chart from 'chart.js';
import palette from '../vendor/palette.js';

document.addEventListener('DOMContentLoaded', () => {
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0,
  );

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach($el => {
      $el.addEventListener('click', () => {
        const target = $el.dataset.target;
        const $target = document.getElementById(target);

        if ($target) {
          $el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        }
      });
    });
  }

  const $messageCloseButtons = Array.prototype.slice.call(
    document.querySelectorAll('.message-header .delete'),
    0,
  );

  if ($messageCloseButtons.length > 0) {
    // Add a click event on each of them
    $messageCloseButtons.forEach($element => {
      $element.addEventListener('click', () => {
        let $currentElement = $element;
        for (let i = 0; i < 10; i++) {
          if (
            $currentElement.className === 'columns' ||
            $currentElement.className === 'flash'
          ) {
            break;
          }
          $currentElement = $currentElement.parentElement;
        }
        $currentElement.remove();
      });
    });
  }

  const context: any = document.getElementById('results');
  if (context) {
    const labels = ['1', '2', '3', '4', '5', '6'];
    const data = [12, 19, 3, 5, 2, 3];

    const myChart = new Chart(context, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            label: 'Number of Votes',
            backgroundColor: palette(`cb-Set${Math.ceil(Math.random() * 3)}`, 6).map(
              hex => '#' + hex,
            ),
          },
        ],
      },
      options: {
        tooltips: {
          bodyFontSize: 16,
        },
        legend: { display: false, labels: { fontSize: 15 } },
        title: {
          display: true,
          text: 'Total number of votes',
          fontSize: 15,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
});
