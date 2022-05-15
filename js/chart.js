var donutChart = {
    series: [22, 37, 41],
    chart: {
        height: '150',
        type: 'donut'
    },
    chartOptions: {
        labels: ['Apple', 'Mango', 'Orange']
    },

    plotOptions: {
        pie: {
            donut: {
                size: '75%',
                polygons: {
                    strokeWidth: 2
                }
            },
            expandOnClick: false
        }
    },
    states: {
        hover: {
            filter: {
                type: 'darken',
                value: 0.9
            }
        }
    },

    dataLabels: {
        enabled: false
    },

    legend: {
        show: false
    },
    tooltip: {
        enabled: false
    }
};
const chart = document.querySelector("#mortgage-chart");
if (chart) {
    var donut = new ApexCharts(document.querySelector("#mortgage-chart"), donutChart);
    donut.render();
}

