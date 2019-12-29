import { Component, OnInit } from '@angular/core';
import { TopicService } from './services/topic-service/topic-service.service';
import { TopicDTO } from './model/TopicDTO';
import { UserService } from './../global-services/user-service/user-service.service';
import { UserDTO } from './model/UserDTO';
import { TopicWithUserDetails } from './model/UserTopicDTO';
import { LoginService } from './../global-services/login-service/login-service.service';
import { stringify } from 'querystring';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.css']
})
export class TopicPageComponent implements OnInit {
  private topicUserList: TopicWithUserDetails[] = [];

  constructor(
    private topicService: TopicService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  reloadTopics(event: boolean) {
    if (event === true) {
      this.loadTopics();
    }
  }

  loadTopics() {
    let userList: UserDTO[] = [];
    let topicList: TopicDTO[] = [];
    this.topicUserList = [];
    this.topicService.getTopicList().subscribe((topicResponse: TopicDTO[]) => {
      let userUuids = new Set<string>();
      topicList = topicResponse;

      topicList.forEach(topic => {
        userUuids.add(topic.authorUuid);
      });

      this.userService
        .getUsersListByUuidList(Array.from(userUuids.values()))
        .subscribe((response: UserDTO[]) => {
          userList = response;

          topicList.forEach(topic => {
            let user: UserDTO = null;

            userList.forEach(u => {
              if (u.uuid === topic.authorUuid) {
                user = u;
              }
            });

            let userWithTopic: TopicWithUserDetails = {
              author: user,
              topic: topic
            };
            this.topicUserList.push(userWithTopic);
          });
        });
    });
  }

  public topicsSortedByCreationDate() {
    this.topicUserList = this.topicUserList.sort((a, b) => {
      if (a.topic.creationDate > b.topic.creationDate) {
        return -1;
      } else if (a.topic.creationDate === b.topic.creationDate) {
        return 0;
      } else if (a.topic.creationDate < b.topic.creationDate) {
        return 1;
      }
    });
    return this.topicUserList;
  }
}
