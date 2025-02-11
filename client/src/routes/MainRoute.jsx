import { Route } from "react-router-dom";
import HomeView from "../views/HomeView";

const MainRoute = () => {
  return (
    <>
      <>
        <Route path="/" element={<HomeView />} />
      </>
    </>
  );
};

export default MainRoute;
