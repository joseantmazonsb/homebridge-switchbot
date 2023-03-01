import { CommandService } from '../api/CommandService';
import { SwitchbotHomebridgePlatform } from '../platform';
import { SwitchbotRegistrarBase } from './SwitchbotRegistrarBase';



export abstract class SwitchbotCommandableRegistrar extends SwitchbotRegistrarBase {
  constructor(platform: SwitchbotHomebridgePlatform, protected readonly commandService: CommandService) {
    super(platform);
  }
}
