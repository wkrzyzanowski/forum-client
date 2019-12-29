import { PostDTO } from './PostDTO';
import { UserDTO } from './../../topic-page/model/UserDTO';
export class PostWithUserDetails {
  post: PostDTO;
  canLike: boolean = false;
  canDislike: boolean = false;
  author: UserDTO;
}
