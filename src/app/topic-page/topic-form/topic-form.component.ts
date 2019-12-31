import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TopicPostService } from '../../global-services/http-services/topic-and-post-service/topic-and-post-service.service';
import { LoginService } from 'src/app/global-services/http-services/login-service/login-service.service';
import { TopicWithUserDetails } from '../model/UserTopicDTO';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    private topicService: TopicPostService
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
        .subscribe(() => {
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
