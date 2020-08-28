import { Component, HostListener, Inject, ViewChild, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { UtilityService } from '../../shared/services/utility.service';
import { NewsFeedService } from '../../shared/services/news-feed.service';

@Component({
  selector: 'app-backend-integration',
  templateUrl: './backend-integration.component.html',
  styleUrls: ['./backend-integration.component.css']
})
export class BackendIntegrationComponent implements AfterViewInit {
  tableData: any = [];
  pageSize = 10;
  dataSource: any;
  pageIndex = 0;
  displayedColumns = ['comments', 'voteCount', 'upVote', 'newsDetails'];
  innerWidth: number;
  isBrowser: any;
  isMobile: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  upVoteId: any;
  noRecordMessage: string;
  recordSize = 0;
  graphData = [];
  deletedNode = 0;

  constructor(private newsFeedService: NewsFeedService,
    private utilityService: UtilityService, @Inject(PLATFORM_ID) platformId: Object) {
    this.tableData = this.utilityService.getData(this.pageIndex) ? this.utilityService.getData(this.pageIndex) : [];
    this.recordSize = this.utilityService.getData('recordSize') ? this.utilityService.getData('recordSize') : 0;
    this.deletedNode = this.utilityService.getData('deletedNode') ? this.utilityService.getData('deletedNode') : 0;
    this.getPageData(this.pageSize, this.pageIndex);
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
      this.paginator.pageIndex = 0;
    }
  }

  getPageData(pageSize, pageIndex){
    this.graphData = [];
    if (!this.utilityService.getData(this.pageIndex)) {
      this.newsFeedService.getNewsItems(pageSize, pageIndex).subscribe(res => {
        this.tableData = res.hits;
        if (this.tableData.length === 0) {
          this.noRecordMessage = "No records found. Please refresh the page."
        }
        this.recordSize = (res.nbPages * res.hitsPerPage) - this.deletedNode;
        this.dataSource = this.tableData;
        const data = {};
        for (const userObject of this.tableData) {
          data[userObject.num_comments] = userObject.points;
        }
        const ordered = {};
        const newData = [];
        Object.keys(data).sort().forEach(function(key) {
          ordered[key] = data[key];
          newData.push([parseInt(key), data[key] ]);
        });

        let graph = [];
        graph.push({name: '' , data:newData});
        this.graphData = graph;

        this.utilityService.setData(this.pageIndex, this.tableData);
        this.utilityService.setData('recordSize', this.recordSize);
      });
    } else {
      this.tableData = this.utilityService.getData(this.pageIndex);
      if (this.tableData.length === 0) {
        this.noRecordMessage = "No records found. Please go the next page."
      }
      this.convertValue();
      this.dataSource = this.tableData;
    }
  }

  convertValue() {
    const data = {};
      for (const userObject of this.tableData) {
        data[userObject.num_comments] = userObject.points;
      }
      const ordered = {};
      const newData = [];
      Object.keys(data).sort().forEach(function(key) {
        ordered[key] = data[key];
        newData.push([parseInt(key), data[key] ]);
      });

      let graph = [];
      graph.push({name: '' , data:newData});
      this.graphData = graph;
  }

  onUpVote(points, id){
   let addedPoints = points + 1;
   let objIndx = this.tableData.findIndex((obj => obj.objectID == id));
   this.upVoteId = id;
   this.tableData[objIndx].points = addedPoints;
   this.dataSource = this.tableData;
   this.convertValue();
   this.utilityService.setData(this.pageIndex, this.tableData);
  }

  onHide(data){
    let objIndx = this.tableData.findIndex(obj => obj.objectID == data);
    this.tableData.splice(objIndx, 1);
    this.utilityService.setData(this.pageIndex, this.tableData);
    this.dataSource = this.tableData;
    this.tableData = this.utilityService.getData(this.pageIndex);
    if (this.tableData.length === 0) {
      this.noRecordMessage = "No records found. Please refresh the page."
    }
    this.recordSize = this.recordSize - 1;
    this.deletedNode = this.deletedNode + 1;
    this.utilityService.setData('recordSize', this.recordSize);
    this.utilityService.setData('deletedNode', this.deletedNode);

    this.convertValue();
  }

  getEvent(pageEvent){
    this.pageIndex = pageEvent.pageIndex;
    this.getPageData( this.pageSize, pageEvent.pageIndex);
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

  @HostListener("window:onbeforeunload", ["$event"])
    clearLocalStorage(event){ // clear data on window close event
      this.utilityService.clearAll();
    }
}
export interface NewsData {
  comments: number;
  voteCount: number;
  newDetails: string;
}

