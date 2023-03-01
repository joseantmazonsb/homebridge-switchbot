import { PlatformAccessory, UnknownContext } from 'homebridge';
import { SwitchbotTvAccessory } from '../accesories/SwitchbotTvAccessory';
import { DeviceSummary, InfrarredDeviceSummary } from '../api/types';
import { SwitchbotCommandableRegistrar } from './SwitchbotCommandableRegistrar';

export class SwitchbotTvRegistrar extends SwitchbotCommandableRegistrar {

  override canRegister(device: InfrarredDeviceSummary) {
    return device.remoteType === 'TV' || device.remoteType === 'DIY TV';
  }

  protected override registerInternal(device: DeviceSummary, accessory: PlatformAccessory<UnknownContext>) {
    new SwitchbotTvAccessory(this.platform, {
      base: accessory,
      device,
    },
    this.commandService);
  }
}