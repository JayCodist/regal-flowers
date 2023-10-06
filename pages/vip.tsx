import { FunctionComponent } from "react";
import ProductsPage from "./filters";
import { regalWebsiteUrl } from "../utils/constants";
import Meta from "../components/meta/Meta";

const VipPage: FunctionComponent<{
  filters: string;
}> = ({}) => {
  return (
    <>
      <Meta canonicalUrl={`${regalWebsiteUrl}/vip`}></Meta>
      <ProductsPage
        productCategory="vip"
        productClass="vip"
        categorySlug="vip"
      />
    </>
  );
};

export default VipPage;
