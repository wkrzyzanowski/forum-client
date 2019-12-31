import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TopicWithUserDetails } from 'src/app/topic-page/model/UserTopicDTO';
import { PostWithUserDetails } from '../model/PostWithUserDetails';
import { TopicPostService } from '../../global-services/http-services/topic-and-post-service/topic-and-post-service.service';
import { LikeDTO } from '../../global-models/LikeDTO';
import { LoginService } from '../../global-services/http-services/login-service/login-service.service';
import { PostDTO } from '../../global-models/PostDTO';
import { TopicDTO } from '../../global-models/TopicDTO';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Output()
  loadPostEmitter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  isTopicActive: boolean;

  @Input()
  topicManageable: boolean;

  @Input()
  topicDetails: TopicWithUserDetails;

  @Input()
  postListWithDetails: PostWithUserDetails[];

  loggedUserLikes: LikeDTO[] = [];

  constructor(
    private router: Router,
    private topicService: TopicPostService,
    private loginService: LoginService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  like(postUuid: string, topicUuid: string) {
    let like: LikeDTO = this.findLikeByPostUuid(postUuid, this.loggedUserLikes);

    if (like) {
      like.likeStatus = 1;
      this.topicService.sentLike(like).subscribe(resp => {
        this.loadPostEmitter.emit(true);
      });
    } else {
      like = new LikeDTO();
      like.uuid = null;
      like.post = postUuid;
      like.topic = topicUuid;
      like.likeStatus = 1;
      like.loggedUser = this.loginService.loggedUser.uuid;
      this.topicService.sentLike(like).subscribe(respo => {
        this.loadPostEmitter.emit(true);
      });
    }
  }

  dislike(postUuid: string, topicUuid: string) {
    let like: LikeDTO = this.findLikeByPostUuid(postUuid, this.loggedUserLikes);

    if (like) {
      like.likeStatus = -1;
      this.topicService.sentLike(like).subscribe(resp => {
        this.loadPostEmitter.emit(true);
      });
    } else {
      like = new LikeDTO();
      like.uuid = null;
      like.post = postUuid;
      like.topic = topicUuid;
      like.likeStatus = -1;
      like.loggedUser = this.loginService.loggedUser.uuid;
      this.topicService.sentLike(like).subscribe(respo => {
        this.loadPostEmitter.emit(true);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'topicDetails': {
            let change: SimpleChange = changes['topicDetails'];
            if (change.currentValue != undefined && !change.firstChange) {
              this.topicService
                .getLikesByTopicUuidAndLoggedUser(
                  change.currentValue.topic.uuid,
                  this.loginService.loggedUser.uuid
                )
                .subscribe((likes: LikeDTO[]) => {
                  this.loggedUserLikes = likes;

                  this.postListWithDetails.forEach(post => {
                    let like: LikeDTO = this.findLikeByPostUuid(
                      post.post.uuid,
                      likes
                    );

                    if (like) {
                      if (like.likeStatus === -1) {
                        post.canLike = true;
                      } else if (like.likeStatus === 1) {
                        post.canDislike = true;
                      }
                    } else {
                      post.canLike = true;
                      post.canDislike = true;
                    }
                  });
                });
            }
          }
          case 'postListWithDetails': {
          }
        }
      }
    }
  }

  manageTopicStatus(status: string) {
    let confirmation = confirm('Are you sure to close this topic ?');

    if (confirmation === true) {
      this.topicService
        .changeTopicStatus(this.topicDetails.topic.uuid, status)
        .subscribe((response: TopicDTO) => {
          this.loadPostEmitter.emit(true);
        });
    }
  }

  isPostRemovable(authorUuid: string) {
    return this.loginService.loggedUser.uuid === authorUuid;
  }

  deletePost(post: PostDTO) {
    let confirmation = confirm(
      'Are you sure to delete this post "' + post.content + '" ?'
    );

    if (confirmation === true) {
      this.topicService
        .deletePostByUuid(post.uuid)
        .subscribe((response: PostDTO) => {
          this.loadPostEmitter.emit(true);
        });
    }
  }

  findPostByUuid(uuid: string, postList: PostWithUserDetails[]) {
    let found: PostWithUserDetails;
    postList.forEach(post => {
      if (post.post.uuid === uuid) {
        found = post;
      }
    });
    return found;
  }

  findLikeByPostUuid(uuid: string, likeList: LikeDTO[]) {
    let found: LikeDTO;
    likeList.forEach(like => {
      if (like.post === uuid) {
        found = like;
      }
    });
    return found;
  }

  reloadPosts() {
    this.loadPostEmitter.emit(true);
  }

  getBack() {
    this.router.navigateByUrl('/topics');
  }
}
