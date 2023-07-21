import { AuthenticationBindings } from '@loopback/authentication';
import {
  Getter,
  /* inject, */
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { CurrentUser } from '../types';
import { intersection } from 'lodash';
import { HttpErrors } from '@loopback/rest';
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  
  constructor(
        @inject(AuthenticationBindings.METADATA)
    public metaData: any,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<CurrentUser>,
  ) {}
  

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // eslint-disable-next-line no-useless-catch
    try {
       // Add pre-invocation logic here
      if (this.metaData) {
        if (!this.metaData[0]?.options?.required) return await next();
      }
      if (!this.metaData) return await next();

      const requiredPermissions = this.metaData[0]?.options?.required;
      const currentUserData = await this.getCurrentUser();

      if (currentUserData.permissions.includes('admin')) {
        // User has admin permission, allow access
        return await next();
      }

      const results = intersection(
        currentUserData.permissions,
        requiredPermissions,
      );

      if (results.length === 0) {
        throw new HttpErrors.Forbidden('INVALID ACCESS');
      }

      return await next();
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
