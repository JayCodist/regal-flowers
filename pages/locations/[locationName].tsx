import { FunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { LocationName } from "../../utils/types/Regal";
import LandingPage from "../index";
import { featuredSlugs } from "../../utils/constants";
import { getProductsBySlugs } from "../../utils/helpers/data/products";
import Product from "../../utils/types/Product";

const LocationLandingPage: FunctionComponent<{
  locationName: LocationName;
  featuredFlowers: Product[];
}> = ({ locationName, featuredFlowers }) => {
  console.log({ locationName, featuredFlowers, location: "location" });
  return (
    <LandingPage
      locationName={locationName}
      featuredFlowers={featuredFlowers}
    />
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locationName = params?.locationName as LocationName;
  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs[locationName]
  );
  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }
  return {
    props: {
      locationName,
      featuredFlowers: data || []
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      // {
      //   params: { id: "lagos", locationName: "lagos" }
      // },
      // {
      //   params: { id: "abuja", locationName: "abuja" }
      // },
      // {
      //   params: { id: "other-locations", locationName: "other-locations" }
      // }
    ],
    fallback: false // true or 'blocking'
  };
};

export default LocationLandingPage;
