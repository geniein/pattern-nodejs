const {EventEmitter}= require("events");

class DB extends EventEmitter {
    constructor(){
        super();
        this.connected = false;
        this.commandQueue = [];    
    }

    async query(qs){
        if(!this.connected){
            console.log("Not connected.");
            return new Promise((resolve, reject)=>{
                const command = () =>{
                    this.query(qs).then(resolve,reject);
                }
                this.commandQueue.push(command);
            })
        }
        console.log('Query executed: '+qs);
    }

    connect() {
        setTimeout(()=>{
            this.connected = true;
            this.emit('connected');
            this.commandQueue.forEach(command=>command());
            this.commandQueue = []
        },1000)
    }
}

module.exports = new DB();