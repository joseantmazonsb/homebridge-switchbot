import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { CommandService } from './api/CommandService';

import { DeviceService } from './api/DeviceService';
import { DeviceSummary, PlatformSettings, InfrarredDeviceSummary } from './api/types';
import { SwitchbotMeterRegistrar } from './registrars/SwitchbotMeterRegistrar';
import { SwitchbotTvRegistrar } from './registrars/SwitchbotTvRegistrar';
import { SwitchbotAirConditionerRegistrar } from './registrars/SwitchbotAirConditionerRegistrar';
import { ISwitchbotRegistrar } from './registrars/ISwitchbotRegistrar';

export type SwitchbotPlatformAccessory = {
  base: PlatformAccessory;
  device: DeviceSummary | InfrarredDeviceSummary;
};

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class SwitchbotHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];
  public readonly settings: PlatformSettings;

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.info('Loading configuration...');
    this.settings = this.config.settings;
    this.log.debug(JSON.stringify(this.settings));
    this.log.info('Configuration loaded.');
    this.log.debug('Finished initializing platform:', this.config.name);
    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  getRegistrars() : ISwitchbotRegistrar[] {
    const commandService = new CommandService(this.settings, this.log);
    return [
      new SwitchbotMeterRegistrar(this),
      new SwitchbotTvRegistrar(this, commandService),
      new SwitchbotAirConditionerRegistrar(this, commandService),
    ];
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  async discoverDevices() {
    this.log.info('Discovering devices...');
    const deviceService = new DeviceService(this.settings, this.log);
    const response = await deviceService.getAll();
    this.log.debug(JSON.stringify(response));
    const registrars = this.getRegistrars();
    const normalDevices = response.body.deviceList ?? [];
    const infraredDevices = response.body.infraredRemoteList ?? [];
    const devices: Array<DeviceSummary | InfrarredDeviceSummary> = [
      ...normalDevices, ...infraredDevices,
    ];
    for (const device of devices) {
      const registrar = registrars.find(r => r.canRegister(device));
      registrar?.register(device);
    }
  }
}