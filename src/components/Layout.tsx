import { FC, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import useChangeSeoHead from "../hooks/useChangeSeoHead";

interface LayoutProps extends PropsWithChildren {}
const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();

  //* CSR에서 navigate로 이동 시, 기존 SEO Tag들 교체.
  useChangeSeoHead();

  return (
    <>
      <nav>
        <button onClick={() => navigate("/home")}>home</button>
        <button onClick={() => navigate("/profile")}>profile</button>
        <button onClick={() => navigate("/")}>main</button>
      </nav>
      {children}
    </>
  );
};
export default Layout;
