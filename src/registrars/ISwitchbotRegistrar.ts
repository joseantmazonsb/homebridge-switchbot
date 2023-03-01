import { DeviceSummary, InfrarredDeviceSummary } from '../api/types';


export interface ISwitchbotRegistrar {
  register(device: DeviceSummary | InfrarredDeviceSummary) : void;
  canRegister(device: DeviceSummary | InfrarredDeviceSummary) : boolean;
}
