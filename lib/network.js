var can = require('socketcan/build/Release/can');
var signals = require('socketcan/build/Release/can_signals');
var events=require('event-pubsub')();

/**
 * This creates a new canbus network
 */
function Network(){
    Object.defineProperties(
        this,
        {
            nodes:{
                value:{},
                enumerable:true,
                writable:true
            },
            bus:{
                value:{},
                enumerable:true,
                writable:true
            },
            channels:{
                value:{},
                enumerable:true,
                writable:true
            },
            _messages:{
                value:{},
                enumerable:false,
                writable:true
            }
        }
    );
    
    Object.preventExtensions(this);
}

/**
 * This creates a new bus which contains messages
 * @param {String} name   Human readable name of the bus
 */
function Bus(id){
    Object.defineProperties(
        this,
        {
            id:{
                value:id,
                enumerable:true,
                writable:false
            },
            messages:{
                value:{},
                enumerable:true,
                writable:true
            }
        }
    );
    
    Object.preventExtensions(this);
}

/**
 * Messages on a bus
 * @param {Number} id   the id of the message
 */
function Message(id){
    Object.defineProperties(
        this,
        {
            bus:{
                value:{},
                enumerable:false,
                writable:true
            },
            id:{
                value:id,
                enumerable:true,
                writable:false
            },
            signals:{
                value:{},
                enumerable:true,
                writable:true
            },
            on:{
                value:onMessage,
                enumerable:false,
                writable:false
            },
            off:{
                value:offMessage,
                enumerable:false,
                writable:false
            },
            trigger:{
                value:triggerMessage,
                enumerable:false,
                writable:false
            },
            value:{
                value:{},
                enumerable:true,
                writable:true
            }
        }
    );
    
    Object.preventExtensions(this);
    
    this.on(
        'set',
        updateSignals
    );
}

/**
 * Creates a new signal in a can message
 * @param {Number} bitTotal   bit size of the signal
 * @param {Number} offsetBytes byte offset
 * @param {Number} bit    bit position to get and set from the byte 
 */
function Signal(bitTotal,offsetBytes,bit){
    Object.defineProperties(
        this,
        {
            id:{
                value:'',
                enumerable:true,
                writable:true
            },
            message:{
                value:{},
                enumerable:false,
                writable:true
            },
            width:{
                value:bitTotal,
                enumerable:false,
                writable:false
            },
            offset:{
                value:offsetBytes*8,
                enumerable:false,
                writable:false
            },
            bit:{
                value:(bit)? bit : false,
                enumerable:false,
                writable:false
            },
            endianess:{
                value:'little',
                enumerable:false,
                writable:true
            },
            type:{
                value:'unsigned',
                enumerable:false,
                writable:true
            },
            value:{
                value:0,
                enumerable:true,
                writable:true
            },
            parser:{
                value:parser,
                enumerable:false,
                writable:true
            }
        }
    );
    
    Object.preventExtensions(this);
}

/**
 * Binds event specific to message
 * @param {String} type    event name/type
 * @param {Function} handler function to be run when event triggered
 */
function onMessage(type,handler){
    //console.log('bind',type,this.id);
    events.on(
        type+this.id,
        handler.bind(this)
    );
}

/**
 * Unbinds event specific to message
 * @param {String} type    event name/type
 * @param {Function} handler function to be run when event triggered
 */
function offMessage(type,handler){
    events.off(
        type+this.id,
        handler
    );
}

/**
 * Triggers event specific to message
 * @param {String} type event name/type
 * @param {Object} data data to be passed to event listeners
 */
function triggerMessage(type,data){
    data.messageID=this.id;
    events.trigger(
        type+this.id,
        data
    );
}

/**
 * Default Parser for data
 * @param   {Number} value unmodified signal value
 * @returns {number} parsed signal value or false if not updated
 */
function parser(value){
    return value;
}

/**
 * Parses raw message data into signal data from hex
 * @param {Buffer} data hex buffer
 */
function updateSignals(data){
    var channels=this.signals;
    var signalsList=Object.keys(channels);
    for(var i=0; i<signalsList.length; i++){
        var signalName=signalsList[i];
        var signal=channels[signalName];
        var newValue=false;
        
        newValue=signal.parser(
            signals.decode_signal(
                data, 
                signal.offset,
                signal.width, 
                signal.endianess == 'little', 
                signal.type == 'signed'
            )
        );
        
        if(signal.value==newValue){
            newValue=false;
        }
        
        if(newValue===false){
            continue;
        }
        
        signal.value=newValue;
        
        this.trigger(
            signalName,
            signal
        );
    };
}

var package={
    Network:Network,
    Bus:Bus,
    Message:Message,
    Signal:Signal,
    RawChannel:can.RawChannel
}

Object.preventExtensions(package);
module.exports=package;
