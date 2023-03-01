import { PlatformAccessory } from 'homebridge';
import { DeviceSummary, InfrarredDeviceSummary } from '../api/types';
import { SwitchbotHomebridgePlatform } from '../platform';
import { PLUGIN_NAME, PLATFORM_NAME } from '../settings';
import { ISwitchbotRegistrar } from './ISwitchbotRegistrar';


export abstract class SwitchbotRegistrarBase implements ISwitchbotRegistrar {
  constructor(
    protected readonly platform: SwitchbotHomebridgePlatform,
  ) { }

  private get api() {
    return this.platform.api;
  }

  protected get log() {
    return this.platform.log;
  }

  private get accessories() {
    return this.platform.accessories;
  }

  register(device: DeviceSummary | InfrarredDeviceSummary) : void {
    const uuid = this.api.hap.uuid.generate(device.deviceId);
    const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
    if (existingAccessory) {
      this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
      return this.registerInternal(device, existingAccessory);
    }
    this.log.info('Adding new accessory:', device.deviceName);
    const accessory = new this.api.platformAccessory<DeviceSummary>(device.deviceName, uuid);
    this.registerInternal(device, accessory);
    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
  }

  abstract canRegister(device: DeviceSummary | InfrarredDeviceSummary) : boolean;
  protected abstract registerInternal(device: DeviceSummary | InfrarredDeviceSummary, accessory: PlatformAccessory);
}
