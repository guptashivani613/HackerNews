import { Component, HostListener, Inject, ViewChild, PLATFORM_ID,AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { isPlatformBrowser } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { UtilityService } from '../shared/services/utility.service';
import { NewsFeedService } from '../shared/services/news-feed.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  tableData: any =[];
  dataSource:any;
  pageSize = 4;
  pageEvent: PageEvent;
  displayedColumns = ['comments', 'voteCount', 'upVote', 'newsDetails'];
  view: any[] = [];
  newArray=[{"name":"vote","series":[]}];
  legend: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Id';
  yAxisLabel: string = 'Vote';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#5AA454']
  };
  graphData: any;
  length: any;
  pageData: any;
  finalArray: any[];
  innerWidth: number;
  isBrowser: any;
  isMobile: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private newsFeedService: NewsFeedService,
    private utilityService:UtilityService,@Inject(PLATFORM_ID) platformId: Object) {
    this.tableData = this.utilityService.getData('data');
    this.getPageData();
    this.isBrowser = isPlatformBrowser(platformId);
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth > 768){
        this.view = [900,400];
      }else{
        this.view = [this.innerWidth-30,400];
        this.isMobile = true;
      }
    }
  }

  ngAfterViewInit() {
    if(this.tableData !=null){
    this.dataSource.paginator = this.paginator;
    }
  }

  getPageData(){
   
    if(this.tableData == null){
      this.newsFeedService.getNewsItems().subscribe(res=>{
        this.tableData = res.hits;
        this.utilityService.setData('data',this.tableData);
        this.getGraph();
        this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
        this.dataSource.paginator = this.paginator;
       
      });
    }else{
      this.getGraph();
      this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
    }
  }
  getGraph(pageData?){
    this.newArray = [{"name":"vote","series":[]}];
    if(pageData){
      this.finalArray = this.tableData.slice(pageData.pageSize*pageData.pageIndex, pageData.pageSize+pageData.pageSize*pageData.pageIndex);
    }else{
      this.finalArray = this.tableData.slice(0, 4);
    }
    this.graphData= this.finalArray.map((item)=>{
      return {'value':item.points,'name': item.objectID}
    });
    this.graphData.map(item=>{
      this.newArray[0].series.push(item);
    });
  }
  onUpVote(points,id){
   let addedPoints = points+1;
   let objIndx = this.tableData.findIndex((obj => obj.objectID == id));
   this.tableData[objIndx].points = addedPoints;
   this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
   this.dataSource.paginator = this.paginator;
   this.utilityService.setData('data',this.tableData);
   this.getGraph();
  }
  onHide(data){
    let objIndx = this.tableData.findIndex(obj=>obj.objectID == data)
    this.tableData.splice(objIndx,1);
    this.utilityService.setData('data',this.tableData);
    this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.getGraph();
  }
  getEvent(pageEvent){
   this.getGraph(pageEvent);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
    }
    if(this.innerWidth > 768){
      this.view = [900,400];
    }else{
      this.isMobile = true;
      this.view = [this.innerWidth - 30,400];
    }
  }
  onRoute(url){
    if(this.isBrowser){
      window.open(url, "_blank");
    }
  }

  @HostListener("window:onbeforeunload",["$event"])
    clearLocalStorage(event){
        this.utilityService.clearData('data');
    }
}
export interface NewsData {
  comments: number;
  voteCount: number;
  newDetails: string;
}

