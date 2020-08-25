import { Component, HostListener, Inject, ViewChild, PLATFORM_ID, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { isPlatformBrowser } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { UtilityService } from '../shared/services/utility.service';
import { NewsFeedService } from '../shared/services/news-feed.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  tableData: any = [];
  dataSource: any;
  pageSize = 5;
  pageEvent: PageEvent;
  displayedColumns = ['comments', 'voteCount', 'upVote', 'newsDetails'];
  graphData: any;
  finalArray: any[];
  innerWidth: number;
  isBrowser: any;
  isMobile: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  lineChart: any;
  upVoteId: any;
  timeout: any;
  currentPageData: any;
  noRecordMessage: string;
  constructor(private newsFeedService: NewsFeedService,
    private utilityService: UtilityService, @Inject(PLATFORM_ID) platformId: Object) {
    this.tableData = this.utilityService.getData('data') ? this.utilityService.getData('data') : [];
    this.getPageData();
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser){
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <769){
        this.isMobile = true;
      }
    }
  }
  ngAfterViewInit() {
    if (this.tableData.length){
      this.drawChart();
      this.dataSource.paginator = this.paginator;
    }
  }
  getPageData(){
    if (this.tableData == null || !this.tableData.length){
      this.newsFeedService.getNewsItems().subscribe(res => {
        this.tableData = res.hits;
        this.utilityService.setData('data', this.tableData);
        if (this.tableData) {
          this.getGraph();
          this.drawChart();
        }
        this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
        this.dataSource.paginator = this.paginator;
      });
    }else{
      this.getGraph();
      this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
    }
  }
  updateChart() {
    if (this.lineChart && this.graphData.length) {
      clearTimeout(this.timeout);
      let index;
      this.graphData.map((item, i) => {
        if (this.upVoteId && this.upVoteId === item.name) {
          index = i;
        }
      });
      const labels = this.graphData.map(obj => obj.name);
      const values = this.graphData.map(obj => obj.value);
      let pointRadius = new Array(values.length).fill(5);
      if (index !== undefined) {
        pointRadius = pointRadius.map((val, i) => {
          if (i === index) {
            return(17);
          }
          return(5);
        });
        this.timeout = setTimeout(() => {
          this.lineChart.data.datasets[0].pointRadius = new Array(values.length).fill(5);
          this.lineChart.update();
        }, 1000);
      }
      this.lineChart.data.datasets[0].pointRadius = pointRadius;
      this.upVoteId = null;
      this.lineChart.data.labels = labels;
      this.lineChart.data.datasets[0].data = values;
      this.lineChart.update();
    } else if (!this.graphData.length && this.lineChart) {
      this.lineChart.destroy();
    }
  }
  getGraph(pageData?){ 
    this.currentPageData = pageData;
    if(pageData && this.tableData.length>pageData.pageSize){
      var startIndex = this.pageSize*pageData.pageIndex;
      var endIndex = startIndex+this.pageSize;
      console.log("generic",startIndex,endIndex,pageData.pageIndex);
      if(this.tableData.length>=endIndex){
          this.finalArray = this.tableData.slice(startIndex, endIndex);
      }else{
        if(this.tableData.length == startIndex){
          this.finalArray = this.tableData.slice(this.tableData.length-this.pageSize, this.tableData.length);
        }else{
          if(startIndex>this.tableData.length){
              this.finalArray = this.tableData.slice(startIndex-this.pageSize ==this.tableData.length || startIndex-this.pageSize-this.tableData.length>=1&& startIndex-this.pageSize-this.tableData.length<=this.pageSize?this.pageSize:startIndex-this.pageSize, this.tableData.length);
          }else if(this.tableData.length == endIndex){
           
            this.finalArray = this.tableData.slice(startIndex-this.pageSize, endIndex);
           }else{
            this.finalArray = this.tableData.slice(startIndex, this.tableData.length);
           }
        }
      }
    }else{
      this.finalArray = this.tableData.slice(0,this.pageSize);
    }
    this.graphData = this.finalArray.map((item) => {
      return {value: item.points, name: item.objectID};
    });
    this.updateChart();
  }
  onUpVote(points, id){
   let addedPoints = points + 1;
   let objIndx = this.tableData.findIndex((obj => obj.objectID == id));
   this.upVoteId = id;
   this.tableData[objIndx].points = addedPoints;
   this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
   this.dataSource.paginator = this.paginator;
   this.utilityService.setData('data', this.tableData);
   this.getGraph(this.currentPageData);
  }
  onHide(data){
    let objIndx = this.tableData.findIndex(obj => obj.objectID == data);
    this.tableData.splice(objIndx, 1);
    this.utilityService.setData('data', this.tableData);
    this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.tableData = this.utilityService.getData('data');
    if(this.tableData.length ==0){
      this.noRecordMessage = "No records found. Please refresh the page."
    }
    if(!this.currentPageData){
      this.getGraph();
    }else{
      this.getGraph(this.pageEvent);
    }
  }
  getEvent(pageEvent){
    this.currentPageData = pageEvent;
   this.getGraph(pageEvent);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.isBrowser){
      this.innerWidth = window.innerWidth;
    }
    if (this.innerWidth < 769){
      this.isMobile = true;
    }
  }
  onRoute(url){
    if (this.isBrowser){
      window.open(url, "_blank");
    }
  }
  drawChart() {
    this.finalArray = this.tableData.slice(0, this.pageSize);
    this.graphData = this.finalArray.map((item) => {
      return {
        value: item.points,
        name: item.objectID
      };
    });
    if (this.finalArray.length) {
      const labels = this.graphData.map(obj => obj.name);
      const values = this.graphData.map(obj => obj.value);
      const pointRadius = new Array(values.length).fill(5);
      const el = document.getElementById('line-chart');
      this.lineChart = new Chart(el, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              data: values,
              borderColor: 'lightblue',
              fill: false,
              pointRadius,
            }
          ]
        },
        options: {
          legend: {
            display: false
         },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Vote'
                },
                ticks: {
                  fontSize:this.isMobile?7:10
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'ID'
                },
                ticks: {
                  fontSize:this.isMobile?7:10
                }
              }
            ]
          }
        }
      });
    }
  }

  @HostListener("window:onbeforeunload", ["$event"])
    clearLocalStorage(event){ // clear data on window close event
        this.utilityService.clearData('data');
    }
}
export interface NewsData {
  comments: number;
  voteCount: number;
  newDetails: string;
}

