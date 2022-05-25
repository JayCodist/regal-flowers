import { FunctionComponent } from "react";
import { useRouter } from "next/router";

const LandingPage: FunctionComponent = () => {
  const router = useRouter();
  const { locationName } = router.query;
  return <h1>Location: {locationName}</h1>;
};

export default LandingPage;
