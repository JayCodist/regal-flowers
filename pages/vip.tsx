import { FunctionComponent } from "react";
import ProductsPage from "./filters";

const VipPage: FunctionComponent<{
  filters: string;
}> = ({}) => {
  return (
    <ProductsPage productCategory="vip" productClass="vip" categorySlug="vip" />
  );
};

export default VipPage;
