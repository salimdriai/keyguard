export interface IActivationData {
  key: string;
  hddsn: string;
  clientName: string;
  phoneNumber: string;
}

export enum STATUS_MESSAGE {
  KEY_USED = "Activation failed! Key already used !",
  KEY_NOT_FOUND = "Activation failed! Cannot find key !",
  ACTIVATED = "Activated!",
  SERVER_ERROR = "Internal server error !",
  DATA_UPDATE_FAILED = "Failed To update data !",
}
