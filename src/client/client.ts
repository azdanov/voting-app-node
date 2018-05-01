import Chart from 'chart.js';
import palette from './palette.js';

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
    const { votes } = (window as any).chart;

    const { labels, data } = votes.reduce(
      (accumulator, item) => {
        accumulator.labels.push(item.option);
        accumulator.data.push(item.votes);
        return accumulator;
      },
      { labels: [], data: [] },
    );

    const total = data.reduce((accumulator, vote) => accumulator + vote);

    const myChart = new Chart(context, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            label: 'Number of Votes',
            backgroundColor: palette('cb-Set1', 6).map(hex => '#' + hex),
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
          text: `Total number of votes: ${total}`,
          fontSize: 15,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                // @ts-ignore
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }
});
