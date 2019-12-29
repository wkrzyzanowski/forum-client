import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic-service/topic-service.service';
import { UserService } from 'src/app/global-services/user-service/user-service.service';
import { LoginService } from 'src/app/global-services/login-service/login-service.service';
import { UserTopicDTO } from '../model/UserTopicDTO';
import { TopicDTO } from '../model/TopicDTO';
import { UserDTO } from '../model/UserDTO';

@Component({
  selector: 'topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.css']
})
export class TopicFormComponent implements OnInit {
  userList: UserDTO[] = [];
  topicList: TopicDTO[] = [];
  topicUserList: UserTopicDTO[] = [];

  topicTitleText: string = '';
  topicTitleFlag: boolean = false;
  postContentText: string = '';
  postContentFlag: boolean = false;
  constructor(
    private topicService: TopicService,
    private userService: UserService,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  createNewTopic() {
    if (this.topicTitleFlag && this.postContentFlag) {
      this.topicService
        .createNewTopic(
          this.topicTitleText,
          this.postContentText,
          this.loginService.loggedUser.uuid
        )
        .subscribe(topic => {
          // this.loadTopics();
        });
    }

    this.topicTitleFlag = false;
    this.postContentFlag = false;

    this.topicTitleText = '';
    this.postContentText = '';
  }

  checkTopicTitleLength() {
    const isGood = this.checkTextLength(5, this.topicTitleText);
    this.topicTitleFlag = isGood;
    return isGood;
  }

  checkPostContentLength() {
    const isGood = this.checkTextLength(2, this.postContentText);
    this.postContentFlag = isGood;
    return isGood;
  }

  checkTextLength(min: number, text: string): boolean {
    if (this.clearWhitespaces(text).length >= min) {
      return true;
    } else {
      return false;
    }
  }

  clearWhitespaces(text: string) {
    return text.replace(/\s/g, '');
  }
}
