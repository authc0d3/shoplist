import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { TabBar, SafeArea } from "antd-mobile";
import {
  ShopbagOutline,
  UnorderedListOutline,
  SearchOutline,
} from "antd-mobile-icons";
import { NavBar } from "./components";
import { ShopList, Item, Login } from "./pages";
import { firebaseApp } from "./db";

const tabs = [
  {
    key: "/shoplist",
    title: "Comprar",
    icon: <ShopbagOutline />,
  },
  {
    key: "/shoplist/items",
    title: "Todo",
    icon: <UnorderedListOutline />,
  },
  {
    key: "/shoplist/search",
    title: "Buscar",
    icon: <SearchOutline />,
  },
];

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  function setRouteActive(route) {
    navigate(route);
  }

  return (
    <>
      <NavBar height={110} backArrow={false}>
        <div className="appTitle">🛒 ShopList</div>
        <TabBar
          activeKey={pathname}
          onChange={(value) => setRouteActive(value)}
          style={{ position: "relative", top: "5px" }}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </NavBar>
      <Outlet />
    </>
  );
};

const App = () => {
  const auth = getAuth(firebaseApp);
  const [user, loading] = useAuthState(auth);
  return (
    <>
      <SafeArea position="top" />
      {user ? (
        <Routes>
          <Route path="/shoplist" element={<Layout />}>
            <Route index element={<ShopList toBuyOnly />} />
            <Route path="items" element={<ShopList />} />
            <Route path="search" element={<ShopList searchMode />} />
          </Route>
          <Route path="items/:itemId" element={<Item />} />
          <Route path="new" element={<Item />} />
          <Route path="*" element={<ShopList toBuyOnly />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/shoplist"
            index
            element={<Login isLoading={loading} />}
          />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
      <SafeArea position="bottom" />
    </>
  );
};

export default App;
