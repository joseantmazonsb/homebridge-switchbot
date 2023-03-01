import { SwitchbotHomebridgePlatform, SwitchbotPlatformAccessory } from '../platform';
import { DeviceSummary, InfrarredDeviceSummary } from '../api/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export abstract class SwitchbotAccessoryBase {

  constructor(
    protected readonly platform: SwitchbotHomebridgePlatform,
    protected readonly accessory: SwitchbotPlatformAccessory,
  ) {
    const serialNumber = Math.random().toString(36).substring(2, 10);
    const model = (accessory.device as DeviceSummary)?.deviceType ?? (accessory.device as InfrarredDeviceSummary)?.remoteType;
    this.accessory.base.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'SwitchBot')
      .setCharacteristic(this.platform.Characteristic.Name, accessory.device.deviceName)
      .setCharacteristic(this.platform.Characteristic.Model, model)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, serialNumber)
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, pkg.version);
    this.initialize();
  }

  private get log() {
    return this.platform.log;
  }

  private prependPrefixes(message: string) {
    return `[${this.accessory.device.deviceName}] ${message}`;
  }

  protected debug(message: string) {
    this.log.debug(this.prependPrefixes(message));
  }

  protected info(message: string) {
    this.log.info(this.prependPrefixes(message));
  }

  protected warn(message: string) {
    this.log.warn(this.prependPrefixes(message));
  }

  protected error(message: string) {
    this.log.error(this.prependPrefixes(message));
  }

  abstract initialize(): void;
}
