import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LikeDTO } from './../../../post-page/model/LikeDTO';
import { PostDTO } from './../../../post-page/model/PostDTO';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  constructor(private httpService: HttpClient) {}

  getTopicList() {
    return this.httpService.get('/post-api/mgmt/topics');
  }

  deleteTopicByUuidWithAllPosts(postUuid: string) {
    return this.httpService.delete('/post-api/mgmt/combined/topic/' + postUuid);
  }

  deletePostByUuid(postUuid: string) {
    return this.httpService.delete('/post-api/mgmt/combined/post/' + postUuid);
  }

  createNewTopic(topicTitle: string, postContent: string, authorUuid: string) {
    return this.httpService.post('/post-api/mgmt/combined/topic', {
      post: {
        authorUuid: authorUuid,
        content: postContent
      },
      topic: {
        authorUuid: authorUuid,
        title: topicTitle
      }
    });
  }

  createNewPost(topicUuid: string, postContent: string, authorUuid: string) {
    return this.httpService.post('/post-api/mgmt/combined/topic/' + topicUuid, {
      authorUuid: authorUuid,
      content: postContent
    });
  }

  getTopicByUuidWithPosts(topicUuid: string) {
    return this.httpService.get('/post-api/mgmt/combined/topic/' + topicUuid);
  }

  getLikesByTopicUuidAndLoggedUser(topicUuid: string, loggedUserUuid: string) {
    let params = new HttpParams().set('user', loggedUserUuid);
    return this.httpService.get('/post-api/mgmt/likes/' + topicUuid, {
      params: params
    });
  }

  sentLike(like: LikeDTO) {
    return this.httpService.post('/post-api/mgmt/likes', like);
  }

  changeTopicStatus(topicUuid: string, status: string) {
    let params = new HttpParams().set('status', status);
    return this.httpService.put(
      '/post-api/mgmt/combined/topic/' + topicUuid,
      null,
      {
        params: params
      }
    );
  }
}
