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
import { TopicService } from './../../topic-page/services/topic-service/topic-service.service';
import { LikeDTO } from '../model/LikeDTO';
import { LoginService } from './../../global-services/login-service/login-service.service';
import { PostDTO } from './../model/PostDTO';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Output()
  loadPostEmitter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  topicDetails: TopicWithUserDetails;

  @Input()
  postListWithDetails: PostWithUserDetails[];

  loggedUserLikes: LikeDTO[] = [];

  constructor(
    private router: Router,
    private topicService: TopicService,
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
