import { SwitchbotCommandableAccessory } from './SwitchbotCommandableAccessory';


export class SwitchbotAirConditionerAccessory extends SwitchbotCommandableAccessory {

  /**
   * modes include 1 (auto), 2 (cool), 3 (dry), 4 (fan), 5 (heat);
   * fan speed includes 1 (auto), 2 (low), 3 (medium), 4 (high);
   * power state includes on and off
   */
  private mode = 1;
  private get fanSpeed() {
    if (this.rotationSpeed <= 25) {
      return 2;
    }
    if (this.rotationSpeed === 100) {
      return 4;
    }
    return 3;
  }

  private state = 'off';
  private temperature = 24;
  private rotationSpeed = 50;

  private autoOperationMode = '';

  overrideOperationMode() {
    if (this.autoOperationMode === 'heat') {
      this.debug('Override to HEAT');
      this.mode = 5;
    } else if (this.autoOperationMode === 'cool') {
      this.debug('Override to COOL');
      this.mode = 2;
    }
  }

  setAutoOperationMode() {
    const id = this.accessory.device.deviceId;
    const overrides = this.platform.settings.overrides?.thermostats;
    if (!overrides) {
      return;
    }
    let value = (overrides[id] as Record<string, string>)?.autoOperationMode;
    if (value) {
      this.autoOperationMode = value;
      return;
    }
    value = (overrides.all as Record<string, string>)?.autoOperationMode;
    if (value) {
      this.autoOperationMode = value;
    }
  }

  initialize(): void {
    const accessory = this.accessory;
    const platform = this.platform;
    this.setAutoOperationMode();

    const getCooler = () => {
      return accessory.base.getService(platform.Service.HeaterCooler)
        || accessory.base.addService(platform.Service.HeaterCooler);
    };

    const getThermostat = () => {
      return accessory.base.getService(platform.Service.Thermostat)
        || accessory.base.addService(platform.Service.Thermostat);
    };

    const thermostat = getThermostat()
      .setCharacteristic(platform.Characteristic.Name, 'Thermostat')
      .setCharacteristic(platform.Characteristic.TemperatureDisplayUnits, platform.Characteristic.TemperatureDisplayUnits.CELSIUS);

    thermostat.getCharacteristic(platform.Characteristic.CurrentHeatingCoolingState)
      .onGet(() => {
        if (this.state === 'off') {
          return platform.Characteristic.CurrentHeatingCoolingState.OFF;
        }
        if (this.mode === 2) {
          return platform.Characteristic.CurrentHeatingCoolingState.COOL;
        }
        if (this.mode === 5) {
          return platform.Characteristic.CurrentHeatingCoolingState.HEAT;
        }
        return platform.Characteristic.CurrentHeatingCoolingState.OFF;
      });
    thermostat.getCharacteristic(platform.Characteristic.TargetHeatingCoolingState)
      .onSet(async (value) => {
        switch (value) {
          case platform.Characteristic.TargetHeatingCoolingState.OFF:
            this.debug('OFF');
            this.state = 'off';
            break;
          case platform.Characteristic.TargetHeatingCoolingState.HEAT:
            this.debug('HEAT');
            this.state = 'on';
            this.mode = 5;
            break;
          case platform.Characteristic.TargetHeatingCoolingState.COOL:
            this.debug('COOL');
            this.state = 'on';
            this.mode = 2;
            break;
          case platform.Characteristic.TargetHeatingCoolingState.AUTO:
            this.debug('AUTO');
            this.state = 'on';
            this.mode = 1;
            this.overrideOperationMode();
            break;
        }
        await this.setAll();
      });

    thermostat.getCharacteristic(platform.Characteristic.CurrentTemperature)
      .onGet(() => this.temperature);

    thermostat.getCharacteristic(platform.Characteristic.TargetTemperature)
      .onSet(async (value) => {
        this.debug(`Set temperature: ${value}`);
        this.state = 'on';
        this.temperature = value as number;
        await this.setAll();
      });

    const cooler = getCooler()
      .setCharacteristic(platform.Characteristic.Name, 'Air conditioner')
      .setCharacteristic(platform.Characteristic.TemperatureDisplayUnits, platform.Characteristic.TemperatureDisplayUnits.CELSIUS);

    cooler.getCharacteristic(platform.Characteristic.Active)
      .onGet(() => this.state === 'on' ? platform.Characteristic.Active.ACTIVE : platform.Characteristic.Active.INACTIVE)
      .onSet(async (value) => {
        if (value) {
          this.debug('Turn on');
          this.state = 'on';
          if (this.mode === 1) {
            this.overrideOperationMode();
          }
        } else {
          this.debug('Turn off');
          this.state = 'off';
        }
        await this.setAll();
      });

    cooler.getCharacteristic(platform.Characteristic.CurrentHeaterCoolerState)
      .onGet(() => {
        if (this.state === 'off') {
          return platform.Characteristic.CurrentHeaterCoolerState.INACTIVE;
        }
        if (this.mode === 2) {
          return platform.Characteristic.CurrentHeaterCoolerState.COOLING;
        }
        if (this.mode === 5) {
          return platform.Characteristic.CurrentHeaterCoolerState.HEATING;
        }
        return platform.Characteristic.CurrentHeaterCoolerState.IDLE;
      })
      .onSet(async value => {
        this.state = 'on';
        switch (value) {
          case platform.Characteristic.CurrentHeaterCoolerState.INACTIVE:
            this.debug('INACTIVE');
            this.state = 'off';
            break;
          case platform.Characteristic.CurrentHeaterCoolerState.IDLE:
            this.debug('IDLE');
            break;
          case platform.Characteristic.CurrentHeaterCoolerState.HEATING:
            this.debug('HEATING');
            this.mode = 5;
            break;
          case platform.Characteristic.CurrentHeaterCoolerState.COOLING:
            this.debug('COOLING');
            this.mode = 2;
            break;
        }
        await this.setAll();
      });

    cooler.getCharacteristic(platform.Characteristic.TargetHeaterCoolerState)
      .onGet(() => {
        if (this.mode === 2) {
          return platform.Characteristic.TargetHeaterCoolerState.COOL;
        }
        if (this.mode === 5) {
          return platform.Characteristic.TargetHeaterCoolerState.HEAT;
        }
        return platform.Characteristic.TargetHeaterCoolerState.AUTO;
      })
      .onSet(async value => {
        this.state = 'on';
        switch (value) {
          case platform.Characteristic.TargetHeaterCoolerState.AUTO:
            this.debug('AUTO');
            this.mode = 1;
            this.overrideOperationMode();
            break;
          case platform.Characteristic.TargetHeaterCoolerState.HEAT:
            this.debug('HEAT');
            this.mode = 5;
            break;
          case platform.Characteristic.TargetHeaterCoolerState.COOL:
            this.debug('COOL');
            this.mode = 2;
            break;
        }
        await this.setAll();
      });

    cooler.getCharacteristic(platform.Characteristic.CurrentTemperature)
      .onGet(() => this.temperature);

    cooler.getCharacteristic(platform.Characteristic.RotationSpeed)
      .onGet(() => this.rotationSpeed)
      .onSet(async value => {
        this.debug('Rotation speed');
        this.rotationSpeed = value as number;
        await this.setAll();
      });
  }

  async setAll() {
    const cmd = { name: 'setAll', parameter: `${this.temperature},${this.mode},${this.fanSpeed},${this.state}` };
    const result = await this.commandService.sendCommand(cmd, this.accessory.device.deviceId);
    this.debug(JSON.stringify(result));
    return result;
  }
}