import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TopicDTO } from '../model/TopicDTO';
import { TopicWithUserDetails } from '../model/UserTopicDTO';
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
  @Input()
  topicUserList: TopicWithUserDetails[];

  @Output()
  loadTopicEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private topicService: TopicService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.loadTopicEmitter.emit(true);
  }

  deleteTopic(topic: TopicDTO) {
    let confirmation = confirm(
      'Are you sure to delete this topic "' +
        this.cutTooLongTitles(topic.title) +
        '" ?'
    );

    if (confirmation === true) {
      this.topicService
        .deletePostByUuid(topic.uuid)
        .subscribe((response: TopicDTO) => {
          this.loadTopicEmitter.emit(true);
        });
    }
  }

  isTopicRemovable(authorUuid: string) {
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
