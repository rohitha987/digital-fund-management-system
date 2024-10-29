const express = require("express");
const {createProxyMiddleware}  = require("http-proxy-middleware");

const app=express();
const port = 3000;

app.use("/api/auth",createProxyMiddleware({
    target:"http://localhost:3001/api/auth",
    changeOrigin:true
}));

app.use("/api/users",createProxyMiddleware({
    target:"http://localhost:3002/api/users",
    changeOrigin:true
}));

app.use("/api/groups",createProxyMiddleware({
    target:"http://localhost:3003/api/groups",
    changeOrigin:true
}));

app.use('/api/transactions',createProxyMiddleware({
    target:"http://localhost:3004/api/transactions",
    changeOrigin:true
}))

app.listen(port,()=>{
    console.log(`Proxy server is running on port ${port}`);
});