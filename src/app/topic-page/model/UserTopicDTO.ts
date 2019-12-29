import { UserDTO } from './UserDTO';
import { TopicDTO } from './TopicDTO';
export class TopicWithUserDetails {
  author: UserDTO;
  topic: TopicDTO;

  constructor(author: UserDTO, topic: TopicDTO) {
    this.author = author;
    this.topic = topic;
  }
}
