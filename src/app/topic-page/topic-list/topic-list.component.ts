import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TopicDTO } from '../model/TopicDTO';
import { UserTopicDTO } from '../model/UserTopicDTO';
import { UserDTO } from '../model/UserDTO';
import { TopicService } from '../services/topic-service/topic-service.service';
import { UserService } from 'src/app/global-services/user-service/user-service.service';
import { LoginService } from 'src/app/global-services/login-service/login-service.service';

@Component({
  selector: 'topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {
  userList: UserDTO[] = [];
  topicList: TopicDTO[] = [];
  topicUserList: UserTopicDTO[] = [];

  @Output()
  userTopicEmitter: EventEmitter<any> = new EventEmitter();

  topicTitleText: string = '';
  topicTitleFlag: boolean = false;
  postContentText: string = '';
  postContentFlag: boolean = false;
  constructor(
    private topicService: TopicService,
    private userService: UserService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.topicList = [];
    this.userList = [];
    this.topicUserList = [];
    this.topicService.getTopicList().subscribe((topicResponse: TopicDTO[]) => {
      let userUuids = new Set<string>();
      this.topicList = topicResponse;

      this.topicList.forEach(topic => {
        userUuids.add(topic.authorUuid);
      });

      this.userService
        .getUsersListByUuidList(Array.from(userUuids.values()))
        .subscribe((response: UserDTO[]) => {
          this.userList = response;

          this.topicList.forEach(topic => {
            let user: UserDTO = null;

            this.userList.forEach(u => {
              if (u.uuid === topic.authorUuid) {
                user = u;
              }
            });

            let userWithTopic: UserTopicDTO = {
              author: user,
              topic: topic
            };
            this.topicUserList.push(userWithTopic);
          });

          this.userTopicEmitter.emit(this.topicUserList);
        });
    });
  }

  deleteTopic(topic: TopicDTO) {
    this.topicService
      .deletePostByUuid(topic.uuid)
      .subscribe((response: TopicDTO) => {
        this.loadTopics();
      });
  }

  isTopicDeletable(authorUuid: string) {
    return this.loginService.loggedUser.uuid === authorUuid;
  }

  cutTooLongTitles(text: string) {
    if (text.length <= 50) {
      return text;
    } else {
      return text.substr(0, 50) + '...';
    }
  }
}
