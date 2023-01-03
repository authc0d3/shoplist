import { NavBar as AntdNavBar } from "antd-mobile";

const NavBar = ({
  children = "ShopList",
  backArrow = true,
  onBack,
  height,
}) => (
  <>
    <AntdNavBar
      style={{
        display: onBack ? "flex" : "block",
        backgroundColor: "#293038",
        color: "#FFF",
        position: "sticky",
        top: "0px",
        left: "0px",
        zIndex: "1",
        ...(height && { height: `${height}px` }),
      }}
      backArrow={backArrow}
      onBack={onBack}
    >
      {children}
    </AntdNavBar>
  </>
);

export default NavBar;
