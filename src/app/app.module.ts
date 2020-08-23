import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PipeModule } from '../shared/pipes/pipe/pipe.module';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {DemoMaterialModule} from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UtilityService } from '../shared/services/utility.service';
import { NewsFeedService } from '../shared/services/news-feed.service';
import { ApiService } from '../shared/services/api.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TransferHttpCacheModule,
    HttpClientModule,
    PipeModule,
    DemoMaterialModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [UtilityService, NewsFeedService,ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
