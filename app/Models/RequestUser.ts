import { User } from "./User";
import IRequestKit from "./RequestKit";

export default interface IRequestUser {
  user: User;
  request: IRequestKit;
}
