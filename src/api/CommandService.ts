import { ApiServiceBase } from './ApiServiceBase';
import { Command, CommandApiResponse } from './types';
import { requestAsync } from './utils';


export class CommandService extends ApiServiceBase {
  async sendCommand(command: Command, deviceId: string): Promise<CommandApiResponse> {
    const url = `${this.settings.api.url}/devices/${deviceId}/commands`;
    const body = JSON.stringify({
      commandType: command.customized ? 'customize' : 'command',
      command: command.name,
      parameter: command.parameter ?? 'default',
    });
    const headers = {
      ... this.buildAuthorizationHeaders(),
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    };
    const response = await requestAsync<CommandApiResponse>(url, {
      method: 'Post',
      headers,
      body,
    });
    return response;
  }
}
