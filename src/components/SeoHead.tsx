import { FC } from "react";

interface HeadProps {
  path: string;
}
const SeoHead: FC<HeadProps> = ({ path }) => {
  return (
    <>
      <title className={"seo-tags"}>{`여기는 ${path ?? "home"}`}</title>
      <meta
        className={"seo-tags"}
        name="title"
        content={`여기는 ${path ?? "home"} meta title`}
      />
      <meta
        className={"seo-tags"}
        name="description"
        content={`여기는 ${path ?? "home"} meta description`}
      />
    </>
  );
};

export default SeoHead;
