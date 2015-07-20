/**
 * Defines message mapping on can network
 * @param {Object} canNetwork requires a network object created using /lib/canBusNetwork.js
 */
function network(bus){
    var messages={};
    //getComputedStyle Busses
    for(var b in bus){
        Object.preventExtensions(bus[b]);
        bus[b].id=b;
        var packages=bus[b].messages;

        for(var message in packages){
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
            for(var i in signals){
                var signal=signals[i];
                signal.id=i;
                signal.message=packages[message];
                Object.preventExtensions(signal);
            }
        }
    }
    
    return messages;
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

function cellIndex(i){
    var message=this.message;
    if(message.value.currentCell==i){
        return;
    }
    message.value.currentCell=i;
    return false;
}

function cellVoltage(v){
    /*
    var message=this.message;
    console.log(message.value.currentCell);
    var cell=message.value.cell[
        message.value.currentCell
    ]
    if(cell.voltage==v){
        return;
    }
    cell.voltage=v;

    var channel={};
    for(var i in this){
        channel[i]=this[i]
    }

    channel.cellIndex=message.value.currentCell;

    this.trigger(
        this.id,
        channel
    );
    */
    return false;
}

var package={
    CellList:CellList,
    network:network,
    divideSignalBy10:divideBy10,
    divideSignalBy1000:divideBy1000,
    cellIndex:cellIndex,
    cellVoltage:cellVoltage
}

Object.preventExtensions(package);
module.exports=package;
