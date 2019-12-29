import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TopicService } from './../topic-page/services/topic-service/topic-service.service';
import { TopicWithPostAndUserDetails } from './model/TopicWithPostAndUserDetails';
import { HttpResponse } from '@angular/common/http';
import { TopicWithUserDetails } from './../topic-page/model/UserTopicDTO';
import { PostWithUserDetails } from './model/PostWithUserDetails';
import { TopicDTO } from '../topic-page/model/TopicDTO';
import { UserDTO } from '../topic-page/model/UserDTO';
import { BehaviorSubject } from 'rxjs';
import { TopicWithPostResponse } from './model/TopicWithPostResponse';
import { UserService } from './../global-services/user-service/user-service.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  private topicId: string;
  private routerSub: any;

  topicDetails: TopicWithUserDetails;
  postListWithDetails: PostWithUserDetails[];

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.routerSub = this.route.params.subscribe(params => {
      this.topicId = params['topicid'];
      this.loadPosts();
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  reloadPosts(event: boolean) {
    if (event === true) {
      this.loadPosts();
    }
  }

  loadPosts() {
    this.postListWithDetails = [];
    let userList: UserDTO[] = [];
    let postListWithDetails: PostWithUserDetails[] = [];

    this.topicService
      .getTopicByUuidWithPosts(this.topicId)
      .subscribe((topicWithPost: TopicWithPostResponse) => {
        let userUuids = new Set<string>();

        userUuids.add(topicWithPost.topic.authorUuid);

        topicWithPost.posts.forEach(post => {
          userUuids.add(post.authorUuid);
        });

        this.userService
          .getUsersListByUuidList(Array.from(userUuids.values()))
          .subscribe((response: UserDTO[]) => {
            userList = response;

            this.topicDetails = new TopicWithUserDetails(
              this.findUserByUuid(topicWithPost.topic.authorUuid, userList),
              topicWithPost.topic
            );

            topicWithPost.posts.forEach(post => {
              let postWithDetails: PostWithUserDetails = new PostWithUserDetails();
              postWithDetails.post = post;
              postWithDetails.author = this.findUserByUuid(
                post.authorUuid,
                userList
              );
              postListWithDetails.push(postWithDetails);
            });

            this.postListWithDetails = postListWithDetails;
          });
      });
  }

  findUserByUuid(uuid: string, userList: UserDTO[]) {
    let found: UserDTO;
    userList.forEach(user => {
      if (user.uuid === uuid) {
        found = user;
      }
    });
    return found;
  }
}
