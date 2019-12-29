import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TopicWithPostAndUserDetails } from './../model/TopicWithPostAndUserDetails';
import { TopicWithUserDetails } from './../../topic-page/model/UserTopicDTO';
import { PostWithUserDetails } from './../model/PostWithUserDetails';
import { TopicDTO } from 'src/app/topic-page/model/TopicDTO';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  @Output()
  loadPostEmitter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  topicDetails: TopicWithUserDetails;

  @Input()
  postListWithDetails: PostWithUserDetails[];

  constructor() {}

  ngOnInit() {}
}
