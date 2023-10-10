import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService, SettingsService } from '@core';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { PostService } from './services/PostService';
import { response } from 'express';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, AfterViewInit {
  posts:any;
  constructor(private preloader: PreloaderService, private settings: SettingsService, private service:PostService) {}

  ngOnInit() {
    this.settings.setDirection();
    this.settings.setTheme();
    // this.service.getPosts()
    //   .subscribe(response=> {
    //     this.posts = response
    //   });
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
