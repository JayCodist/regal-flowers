interface Addon {
  name: string;
  price: number;
  image: string;
}

interface AddonGroup {
  name: string;
  image: string;
  addons: Addon[];
}

export default AddonGroup;
