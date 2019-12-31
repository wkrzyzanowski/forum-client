import { PostDTO } from '../../global-models/PostDTO';
import { UserDTO } from '../../global-models/UserDTO';
export class PostWithUserDetails {
  post: PostDTO;
  canLike: boolean = false;
  canDislike: boolean = false;
  author: UserDTO;
}
