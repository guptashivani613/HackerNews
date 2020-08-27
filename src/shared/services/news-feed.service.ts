import { Injectable } from '@angular/core';
import {apiUrl} from '../../app/constant';
import {HttpClient} from '@angular/common/http';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class NewsFeedService {

  constructor(private apiService:ApiService) { }
  getNewsItems(pageSize, pageIndex){
     return this.apiService.get(`${apiUrl.getItems}&page=${pageIndex}&hitsPerPage=${pageSize}`);
  }
}
