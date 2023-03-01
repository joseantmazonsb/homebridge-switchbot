import { SwitchbotCommandableAccessory } from './SwitchbotCommandableAccessory';

export class SwitchbotTvAccessory extends SwitchbotCommandableAccessory {

  private isActive = false;

  initialize(): void {
    const accessory = this.accessory;
    const platform = this.platform;

    const getTv = () => {
      return accessory.base.getService(platform.Service.Television)
        || accessory.base.addService(platform.Service.Television);
    };

    const getSpeaker = () => {
      return accessory.base.getService(platform.Service.TelevisionSpeaker)
        || accessory.base.addService(platform.Service.TelevisionSpeaker);
    };

    const tv = getTv()
      .setCharacteristic(platform.Characteristic.Name, 'TV')
      .setCharacteristic(platform.Characteristic.ActiveIdentifier, 1)
      .setCharacteristic(platform.Characteristic.SleepDiscoveryMode, platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

    tv.getCharacteristic(platform.Characteristic.Active)
      .onSet(async (newValue) => {
        if (this.isActive === newValue) {
          return;
        }
        this.isActive = newValue as boolean;
        let result;
        if (this.isActive) {
          this.debug('turn on');
          result = await this.commandService.sendCommand({ name: 'turnOn' }, accessory.device.deviceId);
        } else {
          this.debug('turn off');
          result = await this.commandService.sendCommand({ name: 'turnOff' }, accessory.device.deviceId);
        }
        this.debug(JSON.stringify(result));
        tv.updateCharacteristic(platform.Characteristic.Active, this.isActive);
      });

    tv.getCharacteristic(platform.Characteristic.RemoteKey)
      .onSet(async (newValue) => {
        let result;
        const id = accessory.device.deviceId;
        switch (newValue) {
          case platform.Characteristic.RemoteKey.REWIND:
            this.debug('REWIND');
            break;
          case platform.Characteristic.RemoteKey.FAST_FORWARD:
            this.debug('FAST_FORWARD');
            break;
          case platform.Characteristic.RemoteKey.NEXT_TRACK:
            this.debug('NEXT_TRACK');
            break;
          case platform.Characteristic.RemoteKey.PREVIOUS_TRACK:
            this.debug('PREVIOUS_TRACK');
            break;
          case platform.Characteristic.RemoteKey.ARROW_UP:
            this.debug('ARROW_UP');
            result = await this.commandService.sendCommand({ name: 'Up' }, id);
            break;
          case platform.Characteristic.RemoteKey.ARROW_DOWN:
            this.debug('ARROW_DOWN');
            result = await this.commandService.sendCommand({ name: 'Down' }, id);
            break;
          case platform.Characteristic.RemoteKey.ARROW_LEFT:
            this.debug('ARROW_LEFT');
            result = await this.commandService.sendCommand({ name: 'Left' }, id);
            break;
          case platform.Characteristic.RemoteKey.ARROW_RIGHT:
            this.debug('ARROW_RIGHT');
            result = await this.commandService.sendCommand({ name: 'Right' }, id);
            break;
          case platform.Characteristic.RemoteKey.SELECT:
            this.debug('SELECT');
            result = await this.commandService.sendCommand({ name: 'Ok' }, id);
            break;
          case platform.Characteristic.RemoteKey.BACK:
            this.debug('BACK');
            result = await this.commandService.sendCommand({ name: 'Back' }, id);
            break;
          case platform.Characteristic.RemoteKey.EXIT:
            this.debug('EXIT');
            break;
          case platform.Characteristic.RemoteKey.PLAY_PAUSE:
            this.debug('PLAY_PAUSE');
            break;
          case platform.Characteristic.RemoteKey.INFORMATION:
            this.debug('INFORMATION');
            result = await this.commandService.sendCommand({ name: 'Menu' }, id);
            break;
          default:
            this.warn(`unsupported remote key pressed: ${newValue}`);
            break;
        }
        if (result) {
          this.debug(JSON.stringify(result));
        }
      });

    const speaker = getSpeaker()
      .setCharacteristic(platform.Characteristic.Active, platform.Characteristic.Active.ACTIVE)
      .setCharacteristic(platform.Characteristic.VolumeControlType, platform.Characteristic.VolumeControlType.ABSOLUTE);

    speaker.getCharacteristic(platform.Characteristic.Mute)
      .onSet(async () => {
        this.debug('Mute/unmute');
        const result = await this.commandService.sendCommand({ name: 'setMute' }, accessory.device.deviceId);
        this.debug(JSON.stringify(result));
      });

    speaker.getCharacteristic(platform.Characteristic.VolumeSelector)
      .onSet(async (newValue) => {
        let result;
        if (newValue) {
          this.debug('Decrement volume');
          result = await this.commandService.sendCommand({ name: 'volumeSub' }, accessory.device.deviceId);
        } else {
          this.debug('Increment volume');
          result = await this.commandService.sendCommand({ name: 'volumeAdd' }, accessory.device.deviceId);
        }
        this.debug(JSON.stringify(result));
      });
  }
}