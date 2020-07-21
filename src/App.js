import React from "react";
import "./App.scss";
import "./styles/normalize.scss";
import "./styles/override.scss";

import ServerPage from "./containers/homepage";

function App() {
  return (
    <div className="App">
      <ServerPage />
    </div>
  );
}

export default App;
