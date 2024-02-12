"use strict";
const http = require("http");
const httpProxy = require("http-proxy");
const consul = require("consul");

const routing = [
    {
        path: "/api",
        service: "api-service",
        index: 0
    },
    {
        path: "/",
        service: "web-service",
        index: 0
    }
]

const consulClient = consul();
const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res)=>{
    const route = routing.find((route)=> req.url.startWith(route.path));
    consulClient.agent.service.list((err, services)=>{
        const servers = !err & Object.values(services).filter(service=> service.Tags.includes(route.service));

        if(err || !services.length){
            res.writeHead(502);
            return res.end("Bad Gateway");
        }

        route.index = (route.index + 1) % servers.length // ⑤
        const server = servers[route.index]
        const target = `http://${server.Address}:${server.Port}`
        proxy.web(req, res, { target })
    })
})

server.listen(8080, () => console.log('Load balancer started on port 8080'))