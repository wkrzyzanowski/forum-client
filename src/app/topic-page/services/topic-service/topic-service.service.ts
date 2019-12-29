import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
