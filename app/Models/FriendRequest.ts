import { UserProfile } from "./UserProfile";

export default interface IFriendRequest {
    senderUuid: string;
    receiverUuid: string;
    accepted: boolean;
    ack: boolean;
}

export interface IFriendRequestUserProfile {
    friendRequest: IFriendRequest;
    userProfile: UserProfile;
}