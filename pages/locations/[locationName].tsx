import { FunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { LocationName } from "../../utils/types/Regal";
import LandingPage from "../index";

const LocationLandingPage: FunctionComponent<{
  locationName: LocationName;
}> = ({ locationName }) => {
  return <LandingPage locationName={locationName} />;
};

export const getStaticProps: GetStaticProps = ({ params }) => ({
  props: {
    locationName: params?.locationName
  }
});

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: "lagos", locationName: "lagos" }
      },
      {
        params: { id: "abuja", locationName: "abuja" }
      },
      {
        params: { id: "other-places", locationName: "other-places" }
      }
    ],
    fallback: false // true or 'blocking'
  };
};

export default LocationLandingPage;
