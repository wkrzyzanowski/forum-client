import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LikeDTO } from './../../../post-page/model/LikeDTO';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  constructor(private httpService: HttpClient) {}

  getTopicList() {
    return this.httpService.get('/post-api/mgmt/topics');
  }

  deletePostByUuid(postUuid: string) {
    return this.httpService.delete('/post-api/mgmt/combined/topic/' + postUuid);
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
}
