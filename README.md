# Homebridge Switchbot Reloaded

[![npm version](https://badgen.net/npm/v/@joseantmazon/homebridge-switchbot)](https://www.npmjs.com/package/@joseantmazon/homebridge-switchbot) [![npm downloads](https://badgen.net/npm/dt/@joseantmazon/homebridge-switchbot)](https://www.npmjs.com/package/@joseantmazon/homebridge-switchbot)

**SwitchBot meets Homekit!** This plugins uses **SwitchBot's Open API** to connect your devices to Homekit through Homebridge. 

## Installation

1. Go to `Plugins` from the Homebridge web UI
2. Find `@joseantmazon/homebridge-switchbot`
3. Hit `Install`

## Setup

You only need to set your SwitchBot keys to get started. To do so, you'll have to:
1. Download SwitchBot App on App Store or Google Play Store and log in
  3. Generate your keys within the App
     - Click `Profile` on the bottom navigation menu 
     - Click `Preferences`
     - Click `App version` 10 times to enable `Developer Options`
     - Click `Developer Options`
     - Input your `token` and `secret` into the configuration parameters.

Your homebridge config file would look similar to this afterwards:
```json
{
  "platforms": [
    {
      "platform": "Homebridge Switchbot Reloaded",
      "name": "@joseantmazon/homebridge-switchbot",
      "settings": {
        "api": {
          "token": "<your-switchbot-token>",
          "secret": "<your-switchbot-secret-key>",
          "url": "https://api.switch-bot.com/v1.1"
        }
      }
    }
  ]
}
```

## Supported devices

- [SwitchBot Meter](https://www.switch-bot.com/products/switchbot-meter)

## Supported IR devices

### TV/DIY TV

**Capabilities**

- On/Off
- Volume controls

### Air conditioner

**Capabilities**

- On/Off
- Temperature
- Operation mode (`auto`, `heat` or `cool`)
- Fan speed (`auto`, `low`, `medium` or `high`)

**Overrides**

- `auto` operation mode can be overriden through the configuration so it behaves as `heat` or `cool`.
  - For all devices:
    ```json
    {
      "platforms": [{
        "platform": "Homebridge Switchbot Reloaded",
        "name": "@joseantmazon/homebridge-switchbot",
        "settings": {
          "overrides": {
            "thermostats": {
              "all": {
                "autoOperationMode": "heat"
              }
            }
          }
        }
      }]
    }
    ```
  - For a single device:
    ```json
    {
      "platforms": [{
        "platform": "Homebridge Switchbot Reloaded",
        "name": "@joseantmazon/homebridge-switchbot",
        "settings": {
          "overrides": {
            "thermostats": {
              "<deviceId>": {
                "autoOperationMode": "heat"
              }
            }
          }
        }
      }]
    }
    ```
  ***Note***: *single device settings override global directives*

## Contributing

Do you want to take part in the development? Please, head to [CONTRIBUTING](./CONTRIBUTING.md) to get started.

## Disclaimer

The motivation for this plugin was to improve [@switchbot/homebridge-switchbot](https://github.com/OpenWonderLabs/homebridge-switchbot) for my personal use case. Therefore, support for other devices is not guaranteed and it will highly depend on contributions, which are more than welcome.