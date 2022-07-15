import { Addon } from "./AddonGroup";

export interface Order {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  details: string;
  addons: Addon[];
  size: string;
  design: string;
}
