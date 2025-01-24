import { useEffect } from "react";
import SeoHead from "../components/SeoHead";
import ReactDOMServer from "react-dom/server";
import { useLocation } from "react-router-dom";

const useChangeSeoHead = () => {
  const location = useLocation();
  const changeSeoHead = (path: typeof location.pathname) => {
    const stringFromSeoHead = ReactDOMServer.renderToString(
      <SeoHead path={path} />
    );
    const domParser = new DOMParser();
    const newSeoHeads = domParser.parseFromString(
      stringFromSeoHead,
      "text/html"
    ).head.childNodes; // html -> head -> [title, ...meta];
    const prevSeoHeadChilds = Array.from(
      document.getElementsByClassName("seo-tags") ?? []
    );

    prevSeoHeadChilds.forEach((prevSeoElem) =>
      document.head.removeChild(prevSeoElem)
    );
    Array.from(newSeoHeads).forEach((newSeoElem) =>
      document.head.append(newSeoElem)
    );
  };

  // [fix] :: hydration error on server-side
  // useLayoutEffect(() => {
  //   changeSeoHead(location.pathname);
  // }, [location.pathname]);

  useEffect(() => {
    changeSeoHead(location.pathname);
  }, [location.pathname]);
};
export default useChangeSeoHead;
