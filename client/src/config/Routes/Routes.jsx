import Home from "../../pages/Home/Home";
import Movies from "../../pages/Movies/Movies";
import { Redirect, Route, Switch } from "react-router-dom";
import SinglePage from "../../components/SingleContentPage/SinglePage";
import MainNav from "../../components/MainNavbar/MainNav";
import Footer from "../../components/Footer/Footer";
import BottomNav from "../../components/MainNavbar/BottomNav";
import Auth from "../../components/Authetication/SignIn";
import WatchList from '../../pages/WatchList/WatchList'

const Routes = () => {
  return (
    <>
      <MainNav />

      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/user/:id" component={Home} />
          <Route path="/user/watchList/:id" component={WatchList} />
          <Route path="/all-movies" component={Movies} />
          <Route path="/login" component={Auth} />
          <Route path="/trending" component={Movies} />
          <Route path="/:media-:id-category/" children={<Movies />} />
          <Route path="/movies/:id" children={<Movies />} />
          <Route path="/:mediaType/:id" children={<SinglePage />} />
          <Route path="/movies/page/:page" children={Movies} />
          <Route path="/movies/:id/page/:page" children={Movies} />
          <Route path="/movies/:searhTerm/page/:page" children={Movies} />
          <Redirect to="/error" />
        </Switch>
      </div>
      <Footer />
      <BottomNav />
    </>
  );
};

export default Routes;
