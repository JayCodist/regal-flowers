import { GetStaticPaths, GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { getCategories } from "../../utils/helpers/data/category";
import ProductsPage from "../filters";

const CategoryPage: FunctionComponent<{
  categorySlug: string;
}> = ({ categorySlug }) => {
  return <ProductsPage productCategory="occasion" />;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.categorySlug as string;
  return {
    props: {
      categorySlug
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
    paths:
      data?.map(category => ({
        params: { id: category.slug, categorySlug: category.slug }
      })) || [],
    fallback: false // true or 'blocking'
  };
};

export default CategoryPage;
