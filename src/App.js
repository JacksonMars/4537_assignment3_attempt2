import Login from "./Login";
import Search from "./Search";
import Result from "./Result";
import { useState } from "react";

function App() {
  const [selectedTypes, setSelectedTypes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");

  return (
    // <h1><Login></Login></h1>
    <>
      {
        (user === null) &&
        <h1><Login user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} setRefreshToken={setRefreshToken}></Login></h1>
      }

      {
        (user != null) &&
        <div>
          <Search selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} setCurrentPage={setCurrentPage} />
          <Result selectedTypes={selectedTypes} currentPage={currentPage} setCurrentPage={setCurrentPage} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} setRefreshToken={setRefreshToken} user={user} />
          {/* <Dashboard accessToken={accessToken} refreshToken={refreshToken} setAccessToken={setAccessToken} user={user} /> */}
        </div>
      }
    </>
  );
}

export default App;
