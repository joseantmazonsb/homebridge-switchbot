import { ApiServiceBase } from './ApiServiceBase';
import { SummaryApiResponse } from './types';
import { requestAsync } from './utils';

export class DeviceService extends ApiServiceBase {

  getAll() {
    const endpoint = `${this.settings.api.url}/devices`;
    const headers = this.buildAuthorizationHeaders();
    return requestAsync<SummaryApiResponse>(endpoint, {
      method: 'Get',
      headers,
    });
  }
}
