import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewsFeedService } from './news-feed.service';
import { ApiService } from './api.service';

describe('NewsFeedService', () => {
  let service: NewsFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsFeedService);
  });
});
