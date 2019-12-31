import { TopicDTO } from '../../global-models/TopicDTO';
import { PostDTO } from '../../global-models/PostDTO';
export class TopicWithPostResponse {
  topic: TopicDTO;
  posts: PostDTO[];
}
