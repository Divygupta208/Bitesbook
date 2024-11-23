import { Route, Router, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Layout from "./pages/layout";
import HomePage from "./pages/homepage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Home" element={<Layout />}>
          <Route path="" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
