# CONTRIBUTING

**Contributions are encouraged and welcome.** Here you'll find some useful information.

## Reporting bugs

Create a new Github issue explaining the details of the bug and how to reproduce it. If you feel confident enough, you may submit a pull request with the proposed fix as well.

## New features and enhacements

If you're missing a feature, or just want to extend some functionality, please feel free to submit a pull request with the changes and it will be reviewed.

### Adding support for other accesories

If you're reading this it's probably because you'd like to integrate other SwitchBot accessories into this platform. Well, here's the starting point.

Accesories are discovered and registered within `SwitchbotHomebridgePlatform`'s `discoverDevices` method.

New accessories should extend `SwitchbotAccessoryBase` or `SwitchbotCommandableAccessory` (depending on whether the accessory supports commands or not) and override the `initialize` method. 

You should provide a registrar for every new accesory. Registrars should extend `SwitchbotRegistrarBase` or `SwitchbotCommandableRegistrar` and override both `canRegister` and `registerInternal` methods. Finally, you'll need to add an instance of your registrar to the array returned from `SwitchbotHomebridgePlatform`'s `getRegistrars` method.

For example:

```typescript

// SwitchbotSpeakerAccessory.ts

export class SwitchbotSpeakerAccessory extends SwitchbotCommandableAccessory {
  override initialize() {
    const service = accessory.base.getService(platform.Service.Speaker)
        || accessory.base.addService(platform.Service.Speaker);
    ...
  }
}

// SwitchbotNewAccessoryRegistrar.ts

export class SwitchbotSpeakerAccessoryRegistrar extends SwitchbotCommandableRegistrar {

  override canRegister(device: DeviceSummary) {
    return device.deviceType === 'Speaker';
  }

  protected override registerInternal(device: DeviceSummary, accessory: PlatformAccessory<UnknownContext>) {
    new SwitchbotSpeakerAccessory(this.platform, {
      base: accessory,
      device,
    }, this.commandService);
  }
}

// platform.ts

...

getRegistrars() {
  ...
  return [
    ...,
    new SwitchbotSpeakerAccessoryRegistrar(commandService),
  ]
}

...
```
