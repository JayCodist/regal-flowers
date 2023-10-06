import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { getCategories, getCategory } from "../../utils/helpers/data/category";
import ProductsPage from "../filters";
import { Category } from "../../utils/types/Category";
import Meta from "../../components/meta/Meta";
import { regalWebsiteUrl } from "../../utils/constants";

const CategoryPage: FunctionComponent<{
  category: Category;
}> = ({ category }) => {
  return (
    <>
      <Meta
        canonicalUrl={`${regalWebsiteUrl}/product-category/${category.slug}`}
      ></Meta>
      <ProductsPage productCategory="occasion" categorySlug={category.slug} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.categorySlug as string;

  if (categorySlug === "all") {
    return {
      props: {
        category: {
          name: "All",
          slug: "all",
          description: "All Products",
          image: ""
        }
      }
    };
  }

  const { error, message, data } = await getCategory(categorySlug);

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

export const getStaticPaths: GetStaticPaths = async () => {
  const { error, message, data } = await getCategories({
    pageNumber: 1,
    pageSize: 1000
  });
  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }
  return {
    paths: (
      data?.map(category => ({
        params: { categorySlug: category.slug }
      })) || []
    ).concat({ params: { categorySlug: "all" } }),
    fallback: false // true or 'blocking'
  };
};

export default CategoryPage;
