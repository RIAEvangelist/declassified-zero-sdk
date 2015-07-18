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
                    
                    var signals=message.signals;
                    var signalsList=Object.keys(signals);
                    for(var i in signalsList){
                        signals[signalsList[i]].message=message;
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

function messageObject(signal,value){
    
}

function divideBy10(value){
    value=Number(value)/10;
    return value;
}

function divideBy1000(value){
    value=Number(value)/1000;
    return value;
}

module.exports={
    Battery:Battery,
    network:network,
    divideSignalBy10:divideBy10,
    divideSignalBy1000:divideBy1000
}