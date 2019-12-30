import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TopicWithPostAndUserDetails } from './../model/TopicWithPostAndUserDetails';
import { TopicWithUserDetails } from './../../topic-page/model/UserTopicDTO';
import { PostWithUserDetails } from './../model/PostWithUserDetails';
import { TopicDTO } from 'src/app/topic-page/model/TopicDTO';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from 'src/app/global-services/login-service/login-service.service';
import { TopicService } from 'src/app/topic-page/services/topic-service/topic-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  createNewPostForm: FormGroup;

  @Output()
  loadPostEmitter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  topicDetails: TopicWithUserDetails;

  @Input()
  postListWithDetails: PostWithUserDetails[];

  constructor(
    private loginService: LoginService,
    private topicService: TopicService
  ) {
    this.createNewPostForm = this.createFormGroup();
  }

  ngOnInit() {}

  createNewPost() {
    this.createNewPostForm
      .get('authorUuid')
      .setValue(this.loginService.loggedUser.uuid);

    this.createNewPostForm
      .get('topicUuid')
      .setValue(this.topicDetails.topic.uuid);

    if (this.createNewPostForm.valid) {
      this.topicService
        .createNewPost(
          this.createNewPostForm.get('topicUuid').value,
          this.createNewPostForm.get('postContent').value,
          this.createNewPostForm.get('authorUuid').value
        )
        .subscribe(newPost => {
          this.loadPostEmitter.emit(true);
        });
      this.createNewPostForm = this.createFormGroup();
    }
  }

  postIsValid() {
    let postContentFormControl = this.createNewPostForm.get('postContent');
    if (postContentFormControl.touched) {
      return postContentFormControl.valid;
    } else {
      return true;
    }
  }

  createFormGroup() {
    return new FormGroup({
      postContent: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      authorUuid: new FormControl('', [Validators.required]),
      topicUuid: new FormControl('', [Validators.required])
    });
  }
}
