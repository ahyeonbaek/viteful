import fs from "node:fs/promises";
import express from "express";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SERVER_PORT = process.env.PORT || 5188;

const htmlTemplate = IS_PRODUCTION
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

const ssrManifest = IS_PRODUCTION
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : "";

const app = express();

let vite; // 개발 모드일때만 생성되는 데이터(= Vite 서버)
if (!IS_PRODUCTION) {
  // 개발 모드일 때 (NODE_ENV !== "production")
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: "/",
  });
  console.log("[DEV MODE] ::: Success to create vite server.", vite);
  app.use(vite.middlewares);
} else {
  // 배포 모드일 때 (NODE_ENV === "production")
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use("/", sirv("./dist/client", { extensions: [] }));
}

app.get("/api/test", (req, res) => {
  return res.json({ result: true });
});

// 사용자가 api 요청 혹은, url을 통해서 페이지 접근 시 응답해주는 코드
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace("/", "");

    let template;
    let render;

    if (!IS_PRODUCTION && vite) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = htmlTemplate;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const rendered = await render(url, ssrManifest);
    const html = template
      .replace("<!--app-head-->", rendered.seoHead(req.originalUrl))
      .replace("<!--app-html-->", rendered.html(req.originalUrl));

    res
      .status(200)
      .set({
        "Content-Type": "text/html",
      })
      .end(html);
  } catch (err) {
    console.log(err);
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server started at ${SERVER_PORT}`);
});
