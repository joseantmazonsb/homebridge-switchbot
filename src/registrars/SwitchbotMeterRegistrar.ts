import { PlatformAccessory, UnknownContext } from 'homebridge';
import { SwitchbotMeterAccessory } from '../accesories/SwitchbotMeterAccessory';
import { DeviceSummary } from '../api/types';
import { SwitchbotRegistrarBase } from './SwitchbotRegistrarBase';

export class SwitchbotMeterRegistrar extends SwitchbotRegistrarBase {

  override canRegister(device: DeviceSummary) {
    return device.deviceType === 'Meter';
  }

  protected override registerInternal(device: DeviceSummary, accessory: PlatformAccessory<UnknownContext>) {
    new SwitchbotMeterAccessory(this.platform, {
      base: accessory,
      device,
    });
  }
}

