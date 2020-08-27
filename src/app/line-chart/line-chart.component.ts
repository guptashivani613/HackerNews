import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  private chartOptions;
  private chart;

  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
    this.setData();
  }

  ngOnChanges(): void {

    if (this.chart) {
      this.chart.update({series: this.data});
    }
  }

  setData() {
    this.chartOptions = {
      chart: {
        type: 'line',
        backgroundColor: '#F5F1EE',
        animation: false
      },
      exporting: {
        enabled: true
      },
      title: {
        text: ''
      },
      xAxis: {
        title: {
          text: 'News Id'
        },
        gridLineColor: '#DCDCDC'
      },
      yAxis: {
        title: {
          text: 'Votes'
        },
        gridLineColor: '#DCDCDC'

      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
       marker: {
          enabled: true,
          radius: 4,
          fillColor: 'red'
        },
      },
      credits: {
        enabled:  false
      },
      series: this.data
    };
    this.chart = Highcharts.chart('timelineChart', this.chartOptions);
  }
}

