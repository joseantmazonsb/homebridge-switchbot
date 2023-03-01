import { createHmac } from 'crypto';
import { Logger } from 'homebridge';
import { PlatformSettings, AuthorizationHeaders } from './types';


export abstract class ApiServiceBase {
  constructor(
    protected readonly settings: PlatformSettings,
    protected readonly log: Logger,
  ) { }

  protected buildAuthorizationHeaders() : AuthorizationHeaders {
    const token = this.settings.api.token;
    const secret = this.settings.api.secret;
    const t = '' + Date.now();
    const nonce = 'requestID';
    const data = token + t + nonce;
    const signTerm = createHmac('sha256', secret)
      .update(Buffer.from(data, 'utf-8'))
      .digest();
    const sign = signTerm.toString('base64');
    return {
      authorization: token,
      sign,
      nonce,
      t,
    };
  }
}
