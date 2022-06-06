export interface Isotedata {
  id: string;
  messageCode: string;
  senderIdentification: ErIdentification;
  receiverIdentification: ErIdentification;
  dateTime: Date;
  trade: Trade[];
}
export interface ErIdentification {
  codingScheme: string;
  id: string;
}

export interface Comment {
  value: string;
}

export interface RowData {
  period: number | null;
  value: number | null;
}

export interface ProfileData {
  profileRole: string;
  unit: string;
  data: RowData[];
}

export interface Trade {
  id?: number;
  version?: number;
  acceptance: string;
  replacement: string;
  settCurr: string;
  sourceSys: string;
  tradeDay: string | null;
  tradeStage: string;
  tradeType: string;
  resolution: string;
  externalId: string;
  profileData: Array<ProfileData>;
  comment: Comment;
  //finance: string;
  category: string;
  acceptRatio: string;
  parentBlock: string;
  exclsGroup: string;
  utilFlag: number;
  tradeFlag: string;
}

export interface QtyPrice {
  quantity: string;
  price: string;
}


export interface EnergyOrder {
  task_id: number;
  user_id: number;
  ts: number;
  isotedata: Isotedata;
}