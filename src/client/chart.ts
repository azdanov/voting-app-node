import Chart from 'chart.js';
import palette from './palette.js';

function decodeEntity(option) {
  const elem = document.createElement('textarea');
  elem.innerHTML = option;
  return elem.value;
}

export const initChart = () => {
  const context: any = document.getElementById('results');
  if (context) {
    // @ts-ignore
    const { votes, options } = window.votingAppChart;

    const { data, labels } = options.reduce(
      (acc, option) => {
        const decoded = decodeEntity(option);

        acc.labels.push(decoded);
        votes.hasOwnProperty(option) ? acc.data.push(votes[option]) : acc.data.push(0);

        return acc;
      },
      { data: [], labels: [] },
    );

    const total = data.reduce((acc, vote) => acc + vote);

    const myChart = new Chart(context, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            label: 'Number of Votes',
            backgroundColor: palette('mpn65', data.length).map(hex => '#' + hex),
          },
        ],
      },
      options: {
        animation: {
          duration: 650,
          easing: 'easeInOutQuint',
        },
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
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
            },
          ],
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
};
