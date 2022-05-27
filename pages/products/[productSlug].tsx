import { FunctionComponent } from "react";
import { GetStaticProps } from "next";
import { getProduct } from "../../utils/helpers/data/products";
import Product from "../../utils/types/Product";

const LandingPage: FunctionComponent<{ product: Product }> = props => {
  console.log({ props });

  return <h1>Product: {JSON.stringify(props.product)}</h1>;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { productSlug } = params || {};
  const { data, error, message } = await getProduct(String(productSlug));
  if (error || !data) {
    console.error(`Unable to fetch product "${productSlug}": ${message}`);
    return {
      props: {}
    };
  }
  return {
    props: { product: data }
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          productSlug:
            "belleza-regal-two-colors-rose-red-yellow-white-pink-orange"
        }
      }
    ],
    fallback: false // true or 'blocking'
  };
};

export default LandingPage;
