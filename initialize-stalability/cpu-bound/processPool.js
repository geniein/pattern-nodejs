const cp = require("child_process");

class ProcessPool {
    constructor(file, poolMax){
        this.file = file;
        this.poolMax = poolMax;
        this.pool = [];
        this.active = [];
        this.waiting = [];
    }
    
    acquire() {
        return new Promise((resolve, reject)=>{
            let worker
            if( this.pool.length> 0){
                
            }
        })
    }
}