import { FunctionComponent } from "react";
import { GetStaticProps } from "next";
import { getProduct } from "../../utils/helpers/data/products";
import Product from "../../utils/types/Product";
import styles from "./products.module.scss";

const LandingPage: FunctionComponent<{ product: Product }> = props => {
  console.log({ props });

  return (
    <section className={`${styles.product}`}>
      <div className={styles["page-tab"]}>
        <span className="margin-right align-icon">
          Home{" "}
          <img
            src="/icons/chevron-right.svg"
            alt="right"
            className="generic-icon small margin-left"
          />
        </span>
        <span className="margin-right align-icon">
          Love, Birthdays & Anniversary{" "}
          <img
            src="/icons/chevron-right.svg"
            alt="right"
            className="generic-icon small margin-left"
          />
        </span>
        <span className="generic-icon small margin-left">A Kiss of Rose </span>
      </div>
    </section>
  );
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
