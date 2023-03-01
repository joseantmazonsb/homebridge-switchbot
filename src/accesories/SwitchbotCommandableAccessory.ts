import { SwitchbotHomebridgePlatform, SwitchbotPlatformAccessory } from '../platform';
import { CommandService } from '../api/CommandService';
import { SwitchbotAccessoryBase } from './SwitchbotAccessoryBase';


export abstract class SwitchbotCommandableAccessory extends SwitchbotAccessoryBase {
  constructor(
    platform: SwitchbotHomebridgePlatform,
    accessory: SwitchbotPlatformAccessory,
    protected readonly commandService: CommandService,
  ) {
    super(platform, accessory);
  }
}
