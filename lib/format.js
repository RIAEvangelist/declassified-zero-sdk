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
                    
                    var signals=packages[message].signals;
                    var signalsList=Object.keys(signals);
                    for(var i in signalsList){
                        var signal=signals[signalsList[i]];
                        signal.id=signalsList[i];
                        signal.message=message;
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

var package={
    network:network,
    divideSignalBy10:divideBy10,
    divideSignalBy1000:divideBy1000
}

Object.preventExtensions(package);
module.exports=package;
