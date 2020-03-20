interface IUser {
  displayName: string;
  userUuid: string;
  firstname: string;
  lastname: string;
  email: string;
  pushNotificationToken: string;
}

export class User implements IUser {
  displayName: string;
  userUuid: string;
  firstname: string;
  lastname: string;
  email: string;
  pushNotificationToken: string;
  constructor(
    displayName: string,
    userUuid: string,
    firtname: string,
    lastname: string,
    email: string,
    pushNotificationToken: string
  ) {
    this.displayName = displayName; 
    this.userUuid = userUuid;
    this.firstname = firtname;
    this.lastname = lastname;
    this.email = email;
    this.pushNotificationToken = pushNotificationToken;
  }
}
