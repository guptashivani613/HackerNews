import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  /* function for storing the data in localStorage  */
  setData(key, data) {
    if(this.isBrowser){
      localStorage.setItem(key, JSON.stringify(data));
    }else{
      return null;
    }
  }
  /* function for getting the data in localStorage */
  getData(key) {
    if(this.isBrowser){
      return JSON.parse(localStorage.getItem(key));
    }else{
      return null;
    }
  }

// function for clearing particular key in localStorage
  clearData(key) {
    localStorage.removeItem(key);
  }

}
