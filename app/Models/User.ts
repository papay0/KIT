interface IUser {
  displayName: string;
  photoUrl: string;
  userUuid: string;
  firstname: string;
  lastname: string;
}

export class User implements IUser {
  displayName: string;
  photoUrl: string;
  userUuid: string;
  firstname: string;
  lastname: string;
  constructor(
    displayName: string,
    photoUrl: string,
    userUuid: string,
    firtname: string,
    lastname: string
  ) {
    this.displayName = displayName;
    this.photoUrl = photoUrl;
    this.userUuid = userUuid;
    this.firstname = firtname;
    this.lastname = lastname;
  }
}
