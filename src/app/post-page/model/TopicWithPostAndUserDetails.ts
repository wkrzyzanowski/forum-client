import { TopicWithUserDetails } from './../../topic-page/model/UserTopicDTO';
import { PostWithUserDetails } from './PostWithUserDetails';
export class TopicWithPostAndUserDetails {
  topic: TopicWithUserDetails;
  posts: PostWithUserDetails[];
}
