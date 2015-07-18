var network= require('./lib/network.js');
var zero= require('./protocols/2015.js');
//sudo ip link set can0 up type can bitrate 500000
console.log(
    'Ready'
);

var channel = new network.RawChannel(
    'can0', 
    false //timestamps
);

(
    function(){
        var busses=Object.keys(zero.bus);
        for(var i in busses){
            var bus=zero.bus[busses[i]];
            var messages=Object.keys(bus.messages);
            for(var j in messages){
                var message=bus.messages[messages[j]];
                var signals=Object.keys(message.signals);
                if(!signals.length){
                    continue;
                }
                for(var k in signals){
                    var signal=signals[k];
                    message.on(
                        signal,
                        showSignalChange
                    );
                }
                message.on(
                    signals[i],
                    showSignalChange
                );
            }
        }
    }
)()

function showSignalChange(data){
    console.log(data);
}

// set any signals which are defined
channel.addListener(
    "onMessage", 
    function(data) { 
        var info=zero._messages[data.id];
        
        if(!info){
            //console.log('unknown message',data.id);
            return;
        }
        
        //test just first for now
        var message=zero.bus[info[0].bus].messages[info[0].message];
        
        if(Object.keys(message.signals).length<1){
            //skip because not yet completed
            return;
        }
        
        message.trigger(
            'set',
            data.data
        );
    } 
);


// Reply any message 
//channel.addListener("onMessage", channel.send, channel);
 
channel.start();
