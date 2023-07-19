import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { get, post, requestBody } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import * as _ from 'lodash';
import { PermissionKeys } from '../authorization/permission-keys';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../keys';
import { User } from '../models';
import { Credentials, UserRepository } from '../repositories';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { JWTService } from '../services/jwt-service';
import { MyUserService } from '../services/user-service';
import { validateCredentials } from '../services/validator';
import { CredentialsRequestBody } from './specs/user.controller.spec';
export class SignupController {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  @inject(PasswordHasherBindings.PASSWORD_HASHER)
  public hasher: BcryptHasher,
  @inject(UserServiceBindings.USER_SERVICE)
  public userService: MyUserService,
  @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,

  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })

  async signup(@requestBody() userData: User): Promise<Pick<User, "id" | "email" | "name"  | "getId" | "getIdObject" | "toJSON" | "toObject">>{
    validateCredentials(_.pick(userData, ['email', 'password']))
    userData.permissions = [PermissionKeys.EMPLOYEE];
    userData.password = await this.hasher.hashPassword(userData.password);


    const savedUser = await this.userRepository.create(userData);
    const savedUserData = _.omit(savedUser, 'password');
    // delete savedUser.password;
    return savedUserData;
  }

  @post("/users/login",  {
    responses: {
      200: {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // make sure user exist, password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
  }

  @get('/users/me')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);
  }
}
