export class TopicDTO {
  uuid: string;
  authorUuid: string;
  title: string;
  creationDate: Date;
  lastPostDate: Date;
  important: boolean;
  active: boolean;
}
