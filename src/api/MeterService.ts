import { ApiServiceBase } from './ApiServiceBase';
import { DeviceApiResponse } from './types';
import { requestAsync } from './utils';

export class MeterService extends ApiServiceBase {

  async getStatus(id: string) {
    const endpoint = `${this.settings.api.url}/devices/${id}/status`;
    const headers = this.buildAuthorizationHeaders();
    const response = await requestAsync<DeviceApiResponse>(endpoint, {
      method: 'Get',
      headers,
    });
    return response.body;
  }
}


