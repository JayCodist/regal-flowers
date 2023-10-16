import { FunctionComponent } from "react";
import ProductsPage from "./filters";
import { regalWebsiteUrl } from "../utils/constants";
import Meta from "../components/meta/Meta";
import { GetStaticProps } from "next";
import { getCategory } from "../utils/helpers/data/category";
import { Category } from "../utils/types/Category";

const VipPage: FunctionComponent<{
  category: Category;
}> = ({ category }) => {
  return (
    <>
      <Meta canonicalUrl={`${regalWebsiteUrl}/vip`}></Meta>
      <ProductsPage
        productCategory="vip"
        productClass="vip"
        categorySlug="vip"
        category={category}
      />
    </>
  );
};

export default VipPage;

export const getStaticProps: GetStaticProps = async () => {
  const { error, message, data } = await getCategory(
    "vip-section-go-all-out-from-n330000-romance-birthday-anniversary-just-to-say-flowers-etc"
  );

  if (error) {
    console.error("Unable to fetch Category", message);

    return {
      props: {}
    };
  }
  return {
    props: {
      category: data
    }
  };
};
