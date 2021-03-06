export enum HTTPStatusCodes {
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500
}

export enum Roles {
  Admin = 'ADMIN',
  Hospital = 'HOSPITAL',
  User = 'USER'
}

export enum SocketActions {
  Join = 'JOIN',
  Appoint = 'APPOINT',
  Watch = 'WATCH'
}