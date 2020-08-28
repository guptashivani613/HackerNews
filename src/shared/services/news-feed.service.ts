import { Injectable } from '@angular/core';
import {apiUrl} from '../../app/constant';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class NewsFeedService {

  constructor(private apiService:ApiService) { }
  getNewsItems(pageSize, pageIndex){
     return this.apiService.get(`${apiUrl.getItems}&page=${pageIndex + 1}&hitsPerPage=${pageSize}`);
  }
}
