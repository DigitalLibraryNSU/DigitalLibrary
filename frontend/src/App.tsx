import Router from "./Router.tsx";
import "./reset.css"
import {StoreProvider} from "./Store/StoreContext.tsx";

function App() {

  return (
      <StoreProvider>
        <Router/>
      </StoreProvider>
  )
}

export default App
