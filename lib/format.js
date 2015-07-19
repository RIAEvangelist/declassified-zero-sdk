/**
 * Defines message mapping on can network
 * @param {Object} canNetwork requires a network object created using /lib/canBusNetwork.js
 */
function network(bus){
    var messages={};
    //getComputedStyle Busses
    var busses=Object.keys(bus);
    busses.every(
        function(b){
            Object.preventExtensions(bus[b]);
            bus[b].id=b;
            var packages=bus[b].messages;
            var packageList=Object.keys(packages);
            
            packageList.every(
                function(message){
                    var id=packages[message].id;
                    if(!messages[id]){
                        messages[id]=[];
                    }
                    
                    messages[id].push(
                        {
                            bus:b,
                            message:message
                        }
                    );
                    
                    packages[message].bus=bus[b];
                    Object.preventExtensions(packages[message]);
                    var signals=packages[message].signals;
                    var signalsList=Object.keys(signals);
                    for(var i in signalsList){
                        var signal=signals[signalsList[i]];
                        signal.id=signalsList[i];
                        signal.message=packages[message];
                        Object.preventExtensions(signal);
                    }
                    
                    return true;
                }
            );
            
            return true;
        }
    );
    
    return messages;
}

function silentSignal(){
    return false;
}

function messageDispatcher(){
    if(this.message.updated){
        this.message.trigger(
            'updated',
            this.message.signals
        );
    }
    
    this.message.updated=false;
}

function divideBy10(value){
    value=Number(value)/10;
    return value;
}

function divideBy1000(value){
    value=Number(value)/1000;
    return value;
}

function CellList(){
    Object.defineProperties(
        this,
        {
            currentCell:{
                value:0,
                enumerable:false,
                writable:true
            },
            cells:{
                value:[],
                enumerable:true,
                writable:true
            },
            Cell:{
                value:Cell,
                enumerable:false,
                writeable:false
            }
        }
    );
}

function Cell(){
    Object.defineProperties(
        this,
        {
            voltage:{
                value:0,
                enumerable:true,
                writable:true
            }
        }
    );
}

var package={
    CellList:CellList,
    network:network,
    divideSignalBy10:divideBy10,
    divideSignalBy1000:divideBy1000
}

Object.preventExtensions(package);
module.exports=package;
