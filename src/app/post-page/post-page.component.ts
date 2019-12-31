import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicPostService } from '../global-services/http-services/topic-and-post-service/topic-and-post-service.service';
import { TopicWithUserDetails } from './../topic-page/model/UserTopicDTO';
import { PostWithUserDetails } from './model/PostWithUserDetails';
import { UserDTO } from '../global-models/UserDTO';
import { TopicWithPostResponse } from './model/TopicWithPostResponse';
import { UserService } from '../global-services/http-services/user-service/user-service.service';
import { LoginService } from '../global-services/http-services/login-service/login-service.service';

@Component({
  selector: 'post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  private topicId: string;
  private routerSub: any;

  isTopicActive: boolean = false;
  topicManageable: boolean = false;

  topicDetails: TopicWithUserDetails;
  postListWithDetails: PostWithUserDetails[];

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private topicService: TopicPostService,
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
        this.isTopicActive = topicWithPost.topic.active;
        this.topicManageable = this.canUserManageTopic(
          topicWithPost.topic.authorUuid
        );

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

  canUserManageTopic(authorUuid: string) {
    return this.loginService.loggedUser.uuid === authorUuid;
  }
}
