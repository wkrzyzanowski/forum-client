import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TopicService } from '../services/topic-service/topic-service.service';
import { UserService } from 'src/app/global-services/user-service/user-service.service';
import { LoginService } from 'src/app/global-services/login-service/login-service.service';
import { TopicWithUserDetails } from '../model/UserTopicDTO';
import { TopicDTO } from '../model/TopicDTO';
import { UserDTO } from '../model/UserDTO';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'topic-form',
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.css']
})
export class TopicFormComponent implements OnInit {
  createNewTopicForm: FormGroup;

  @Input()
  topicUserList: TopicWithUserDetails[];

  @Output()
  loadTopicEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private loginService: LoginService,
    private topicService: TopicService
  ) {
    this.createNewTopicForm = this.createFormGroup();
  }

  ngOnInit() {}

  createNewTopic() {
    this.createNewTopicForm
      .get('authorUuid')
      .setValue(this.loginService.loggedUser.uuid);

    if (this.createNewTopicForm.valid) {
      this.topicService
        .createNewTopic(
          this.createNewTopicForm.get('topicTitle').value,
          this.createNewTopicForm.get('postContent').value,
          this.createNewTopicForm.get('authorUuid').value
        )
        .subscribe(newTopic => {
          this.loadTopicEmitter.emit(true);
        });
      this.createNewTopicForm = this.createFormGroup();
    }
  }

  topicIsValid() {
    let topicTitleFormControl = this.createNewTopicForm.get('topicTitle');
    if (topicTitleFormControl.touched) {
      return topicTitleFormControl.valid;
    } else {
      return true;
    }
  }

  postIsValid() {
    let postContentFormControl = this.createNewTopicForm.get('postContent');
    if (postContentFormControl.touched) {
      return postContentFormControl.valid;
    } else {
      return true;
    }
  }

  createFormGroup() {
    return new FormGroup({
      topicTitle: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      postContent: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      authorUuid: new FormControl('', [Validators.required])
    });
  }
}
