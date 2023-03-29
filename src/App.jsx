import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { TabBar, SafeArea, Grid, Button, Dialog } from "antd-mobile";
import {
  ShopbagOutline,
  UnorderedListOutline,
  SearchOutline,
  UploadOutline,
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
  const auth = getAuth(firebaseApp);

  function setRouteActive(route) {
    navigate(route);
  }

  function handleLogout() {
    Dialog.confirm({
      title: "Cerrar sesión",
      content: "¿Seguro que desea cerrar la sesión?",
      confirmText: "Cerrar sesión",
      cancelText: "Cancelar",
      onConfirm: () => signOut(auth),
    });
  }

  return (
    <>
      <NavBar height={110} backArrow={false}>
        <Grid columns={2} gap={8}>
          <Grid.Item>
            <div className="appTitle">🛒 ShopList</div>
          </Grid.Item>
          <Grid.Item className="appTitleButtons">
            <Button color="light" fill="none" onClick={handleLogout}>
              <UploadOutline />
            </Button>
          </Grid.Item>
        </Grid>
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
            <Route path="/shoplist/items" element={<ShopList />} />
            <Route path="/shoplist/search" element={<ShopList searchMode />} />
          </Route>
          <Route path="/shoplist/items/:itemId" element={<Item />} />
          <Route path="/shoplist/new" element={<Item />} />
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
