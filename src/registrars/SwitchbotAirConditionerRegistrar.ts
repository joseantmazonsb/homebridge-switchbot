import { PlatformAccessory, UnknownContext } from 'homebridge';
import { SwitchbotAirConditionerAccessory } from '../accesories/SwitchbotAirConditionerAccessory';
import { DeviceSummary, InfrarredDeviceSummary } from '../api/types';
import { SwitchbotCommandableRegistrar } from './SwitchbotCommandableRegistrar';


export class SwitchbotAirConditionerRegistrar extends SwitchbotCommandableRegistrar {

  override canRegister(device: InfrarredDeviceSummary) {
    return device.remoteType === 'Air Conditioner';
  }

  protected override registerInternal(device: DeviceSummary, accessory: PlatformAccessory<UnknownContext>) {
    new SwitchbotAirConditionerAccessory(this.platform, {
      base: accessory,
      device,
    }, this.commandService);
  }
}
