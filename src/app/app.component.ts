import { Component, HostListener, Inject, ViewChild, PLATFORM_ID } from '@angular/core';
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
export class AppComponent {
  tableData: any =[];
  dataSource:any;
  pageSize =4;
  pageEvent: PageEvent;
  displayedColumns = ['comments', 'voteCount', 'upVote', 'newsDetails'];
  isMobile = true;
  view: any[] = [];
  newArray=[{"name":"graphData","series":[]}];
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Id';
  yAxisLabel: string = 'Vote';
  timeline: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  graphData: any;
  length: any;
  pageData: any;
  finalArray: any[];
  innerWidth: number;
  isBrowser: any;
  constructor(private newsFeedService: NewsFeedService,
    private utilityService:UtilityService,@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.tableData = this.utilityService.getData('data');
    this.getPageData();
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth > 768){
        this.view = [900,400];
      }else{
        this.view = [this.innerWidth-30,400];
      }
    }
  }
  
  getPageData(){
    if(this.tableData == null){
      this.newsFeedService.getNewsItems().subscribe(res=>{
        this.tableData = res.hits;
        this.utilityService.setData('data',this.tableData);
        this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
        this.dataSource.paginator = this.paginator;
        this.length  = this.tableData.length;
        this.getGraph();
      });
    }else{
      this.dataSource = new MatTableDataSource<NewsData>(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.length  = this.tableData.length;
      this.getGraph();
      
    }
  }
  getGraph(pageData?){
    this.newArray = [{"name":"graphData","series":[]}];
    if(pageData){
      this.finalArray = this.tableData.slice(pageData.pageSize*pageData.pageIndex, pageData.pageSize+pageData.pageSize*pageData.pageIndex);
    }else{
      this.finalArray = this.tableData.slice(0, 4);
    }
    this.graphData= this.finalArray.map((item,index)=>{
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
      this.view = [this.innerWidth - 30,400];
    }
  }

}
export interface NewsData {
  comments: number;
  voteCount: number;
  newDetails: string;
}

