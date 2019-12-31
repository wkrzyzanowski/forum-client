import { UserDTO } from '../../global-models/UserDTO';
import { TopicDTO } from '../../global-models/TopicDTO';
export class TopicWithUserDetails {
  author: UserDTO;
  topic: TopicDTO;

  constructor(author: UserDTO, topic: TopicDTO) {
    this.author = author;
    this.topic = topic;
  }
}
