export interface IWhatsapp {
  name: string;
  phoneNumber: string;
  cotations: ICotation[];
}

export interface ICotation {
  origin: string;
  destiny: string;
  price: number;
  grossWeight: number;
  cubWeight: number;
  qtdVol: number;
  commodityPrice: number;
  dimensions?: IDimensions[];
}

export interface IDimensions {
  widthVal: number;
  heightVal: number;
  lengthVal: number;
}
