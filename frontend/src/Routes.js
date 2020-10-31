import { Switch, Route } from "react-router-dom";
import Identity from "./pages/Identity";
import Sign from "./pages/Sign";
import Verify from "./pages/Verify";

export default function Router() {
  return (
    <Switch>
      <Route path="/sign">
        <Sign />
      </Route>
      <Route path="/verify">
        <Verify />
      </Route>
      <Route path="/">
        <Identity />
      </Route>
    </Switch>
  );
}
