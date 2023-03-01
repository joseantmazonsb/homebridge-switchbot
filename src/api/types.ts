export type PlatformSettings = {
  api: {
    url: string;
    token: string;
    secret: string;
  };
  overrides?: {
    thermostats?: Record<string, unknown>;
  };
};

type ApiResponse = {
  statusCode: number;
  message: string;
};

export type AuthorizationHeaders = {
  authorization: string;
  sign: string;
  nonce: string;
  t: string;
};

export type DeviceType =
  'Bot' |
  'Curtain' |
  'Hub' |
  'Hub Plus' |
  'Hub Mini'|
  'Meter'|
  'Meter Plus'|
  'Smart Lock'|
  'Keypad'|
  'Keypad Touch'|
  'Remote'|
  'Motion Sensor'|
  'Contact Sensor'|
  'Ceiling Light'|
  'Ceiling Light Pro'|
  'Plug Mini (US)'|
  'Plug Mini (JP)'|
  'Plug'|
  'Strip Light'|
  'Color Bulb'|
  'Robot Vacuum Cleaner S1'|
  'Robot Vacuum Cleaner S1 Plus'|
  'Humidifier'|
  'Indoor Cam'|
  'Pan/Tilt Cam'|
  'Blind Tilt'
;

export type InfraredDeviceType =
  'Air Conditioner'|
  'TV'|
  'DIY TV'|
  'Light'|
  'Streamer'|
  'Set Top Box'|
  'DVD Player'|
  'Fan'|
  'Projector'|
  'Camera'|
  'Air Purifier'|
  'Speaker'|
  'Water Heater'|
  'Robot Vacuum Cleaner'|
  'Others'
;

//v1.1 of API
export type DeviceStatus = {
  /**
   * Device ID
   */
  deviceId:	string;
  /**
   * Device type
   */
  deviceType:	DeviceType | InfraredDeviceType;
  /**
   * Device's parent Hub ID. 000000000000 when the device itself is a Hub or it is connected through Wi-Fi.
   */
  hubDeviceId:	string;
  /**
   * ON/OFF state.
   */
  power?: string;
  /**
   * Determines if device has been calibrated or not.
   */
  calibrate?:	boolean;
  /**
   * Determines if a device is paired with or grouped with another device or not.
   */
  group?:	boolean;
  /**
   * Determines if a device is moving or not.
   */
  moving?:	boolean;
  /**
   * The current position (0-100) the percentage of the distance between the calibrated open position and closed position.
   */
  slidePosition?:	number;
  /**
   * Temperature in celsius.
   */
  temperature?:	number;	//temperature in celsius (Used by the following deviceTypes: Meter, Meter Plus, Humidifier)
  /**
   * Humidity percentage (0-100)
   */
  humidity?:	number;
  /**
   * Determines if locked or not.
   */
  lockState?:	string;
  /**
   * Determines if the door is closed or not. (Used by the following deviceTypes: Lock)
   */
  doorState?:	string;
  /**
   * Determines if motion is detected. (Used by the following deviceTypes: Motion Sensor, Contact Sensor)
   */
  moveDetected?:	boolean;
  /**
   * The ambient brightness picked up by the sensor. Bright or dim. 1-100.
   */
  brightness?:	string | number;
  /**
   * The open state of the sensor.
   */
  openState?:	'open' | 'close' | 'timeOutNotClose';
  /**
   * The color temperature value, range from 2700 to 6500.
   */
  colorTemperature?:	number;
  /**
   * The voltage of the device, measured in Volt.
   */
  voltage?:	number;
  /**
   * The power consumed in a day, measured in Watts
   */
  weight?:	number;
  /**
   * The duration that the device has been used during a day, measured in minutes
   */
  electricityOfDay?:	number;
  /**
   * The current of the device at the moment, measured in Amp.
   */
  electricCurrent?:	number;
  /**
   * RGB color value (255:255:255)
   */
  color?:	string;
  /**
   * The working status of the device
   */
  workingStatus?:	'StandBy' | 'Clearing' | 'Paused' | 'GotoChargeBase' | 'Charging'
    | 'ChargeDone' | 'Dormant' | 'InTrouble' | 'InRemoteControl' | 'InDustCollecting';
  /**
   * The connection status of the device
   */
  onlineStatus?:	'online' | 'offline';
  /**
   * The current battery level (1-100)
   */
  battery?:	number;
  /**
   * Device name
   */
  deviceName?:	string;
  /**
   * Atomization efficiency percentage
   */
  nebulizationEfficiency?:	number;
  /**
   * Determines if a Humidifier is in Auto Mode or not
   */
  auto?:	boolean;
  /**
   * Determines if a Humidifier's safety lock is on or not.
   */
  childLock?:	boolean;
  /**
   * Determines if a Humidifier is muted or not
   */
  sound?:	boolean;
  /**
   * Determines if the water tank is empty or not
   */
  lackWater?:	boolean;
  /**
   * The version of the device
   */
  version?:	number;
  /**
   * The opening direction of a Blind Tilt device.
   */
  direction?:	string;
  /**
   * 'static' when not moving
   */
  runStatus?: string;
  /**
   * Available for devices. the fan mode.
   */
  mode?: number;
  /**
   * Fan speed
   */
  speed?: number;
  /**
   * Fetermines if the fan is swinging or not
   */
  shaking?: boolean;
  /**
   * Fan's swing direciton
   */
  shakeCenter?: string;
  /**
   * Fan's swing range, 0-120°
   */
  shakeRange?: string;
};

type DeviceSummaryBase = {
  deviceId: string;
  deviceName: string;
  hubDeviceId: string;
};

export type DeviceSummary = DeviceSummaryBase & {
  enableCloudService?: boolean;
  deviceType: DeviceType;
};

export type InfrarredDeviceSummary = DeviceSummaryBase & {
  remoteType: InfraredDeviceType;
};

export type DevicesSummary = {
  deviceList?: DeviceSummary[];
  infraredRemoteList?: InfrarredDeviceSummary[];
};

export type SummaryApiResponse = ApiResponse & {
  body: DevicesSummary;
};

export type DeviceApiResponse = ApiResponse & {
  body: DeviceStatus;
};

export type Command = {
  name: string;
  parameter?: string | number | Record<string, unknown>;
  customized?: boolean;
};

export type CommandApiResponse = ApiResponse & {
  body: Record<string, unknown>;
};
