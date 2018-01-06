const Koa = require("koa");
const app = new Koa();
// const debug = require("debug")("koa-weapp-demo");
// const response = require("./middlewares/response");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
// console.log(path.join(__dirname, "build"));

const staticCache = require("koa-static-cache");

var files = {};
// Mount the middleware
app.use(
  staticCache(
    "./build",
    {
      maxAge: 60 * 60 * 24 * 365,
      gzip: true
    },
    files
  )
);

// Add additional files
staticCache(
  "./src/assets",
  {
    maxAge: 60 * 60 * 24 * 365,
    gzip: true
  },
  files
);

// 使用响应处理中间件
// app.use(response);

// 解析请求体
app.use(bodyParser());

// 引入路由分发
// const router = require("./routes");
// app.use(router.routes());

app.use((ctx, next) => {
  if (ctx.request.url === "/") {
    ctx.response.type = "html";
    ctx.response.body = fs.readFileSync("./index.html");
  } else {
    next();
  }
});

// 启动程序，监听端口
app.listen(9002, () => console.log(`listening on port 9002`));