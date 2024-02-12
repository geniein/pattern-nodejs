"use strict";
const http = require("http");
const os = require("os");
const {once} = require("events");
const cluster = require("cluster");

if(cluster.isMaster){
    console.log("---Master---");
    const availableCpus = os.cpus();
    console.log(`Clustering to ${availableCpus.length} processes`);
    availableCpus.forEach(()=>cluster.fork());

    //silent restart
    cluster.on("exit",(worker, code)=>{
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.process.pid} crashed. Starting a new worker`)
            cluster.fork();
          }
    })
    
    //Restart All 
    process.on("SIGUSR2", async ()=>{
        const workers = Object.values(cluster.workers);
        workers.forEach( async (worker)=>{
            console.log(`Stopping worker: ${worker.process.pid}`);            
            worker.disconnect(); //Graceful exit
            await once(worker,"exit");
            if(!worker.exitedAfterDisconnect) return false;
            const newWorker = cluster.fork();
            await once(newWorker,"listening");
        })
    });
}else{
    console.log("---Woker---");
    const {pid} = process;
    const server = http.createServer((req,res)=>{
        //Load Sync
        let i = 1e7; while (i > 0) { i-- }
        console.log(`Handling request from ${pid}`)
        res.end(`Hello from ${pid}\n`)
    })

    server.listen(8080,()=>console.log(`Started at ${pid}`));
}