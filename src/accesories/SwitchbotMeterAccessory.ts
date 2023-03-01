import { MeterService } from '../api/MeterService';
import { SwitchbotAccessoryBase } from './SwitchbotAccessoryBase';

export class SwitchbotMeterAccessory extends SwitchbotAccessoryBase {
  initialize(): void {
    const accessory = this.accessory;
    const platform = this.platform;
    const getTemperatureSensor = () => {
      return accessory.base.getService(platform.Service.TemperatureSensor)
        || accessory.base.addService(platform.Service.TemperatureSensor);
    };

    const getHumiditySensor = () => {
      return accessory.base.getService(platform.Service.HumiditySensor)
        || accessory.base.addService(platform.Service.HumiditySensor);
    };

    const meterService = new MeterService(platform.settings, platform.log);

    getTemperatureSensor()
      .setCharacteristic(platform.Characteristic.Name, 'Temperature sensor')
      .getCharacteristic(platform.Characteristic.CurrentTemperature)
      .onGet(async () => {
        this.debug('Getting temperature...');
        const status = await meterService.getStatus(accessory.device.deviceId);
        this.debug(JSON.stringify(status));
        return status.temperature!;
      });

    getHumiditySensor()
      .setCharacteristic(platform.Characteristic.Name, 'Humidity sensor')
      .getCharacteristic(platform.Characteristic.CurrentRelativeHumidity)
      .onGet(async () => {
        this.debug('Getting humidity...');
        const status = await meterService.getStatus(accessory.device.deviceId);
        this.debug(JSON.stringify(status));
        return status.humidity!;
      });
  }
}