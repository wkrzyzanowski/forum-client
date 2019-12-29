import { Component, OnInit } from '@angular/core';
import { TopicService } from './services/topic-service/topic-service.service';
import { TopicDTO } from './model/TopicDTO';
import { UserService } from './../global-services/user-service/user-service.service';
import { UserDTO } from './model/UserDTO';
import { UserTopicDTO } from './model/UserTopicDTO';
import { LoginService } from './../global-services/login-service/login-service.service';
import { stringify } from 'querystring';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.css']
})
export class TopicPageComponent implements OnInit {
  topicList: UserTopicDTO[] = [];

  constructor() {}

  ngOnInit() {}

  updateTopicList(event: UserTopicDTO[]) {
    this.topicList = event;
  }
}
