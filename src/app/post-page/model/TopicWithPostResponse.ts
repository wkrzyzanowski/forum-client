import { TopicDTO } from './../../topic-page/model/TopicDTO';
import { PostDTO } from './PostDTO';
export class TopicWithPostResponse {
  topic: TopicDTO;
  posts: PostDTO[];
}
