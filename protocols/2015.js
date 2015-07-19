var canNetwork=require('../lib/network.js'),
    format= require('../lib/format.js'),
    Network=canNetwork.Network,
    Bus=canNetwork.Bus,
    Message=canNetwork.Message,
    Signal=canNetwork.Signal;

var network=new Network();

var bus=false,
    message=false;

/***************\
Define Node IDs
\***************/
nodes=network.nodes;

//control units
nodes.controller=1;
nodes.mbbBike=6;
nodes.mbbController=5;
nodes.bms=8;
nodes.bms1=9;
nodes.meanwell=16;
nodes.chademo=17;
nodes.calexSDS=18;
nodes.calexXMX=19;
nodes.boshABS=24;

//sensors
nodes.throttle=32;
nodes.brakeSensor=33;
nodes.leanAngle=34;

//dash
nodes.dash=64;

//other
nodes.debugModule=81;
nodes.userPort=82;

/***************\
Create Buses
\***************/
network.bus.controller=new Bus('controller');
network.bus.bms=new Bus('bms');
network.bus.bms1=new Bus('bms1');
network.bus.ccu=new Bus('ccu');
network.bus.dash=new Bus('dash');
network.bus.calexSDS=new Bus('calexSDS');
network.bus.calexXMX=new Bus('calexXMX');

/**************************\
Create Controller messages
\**************************/
//tpdos
bus=network.bus.controller.messages;
bus.speedTorque=new Message(0x181);
bus.rpmThrottleMotTemp=new Message(0x281);
bus.controllerTempDigitalIn18=new Message(0x381);
bus.voltModInductanceTempEst=new Message(0x481);
bus.targetVelMaxIQContVolt=new Message(0x501);

//rpdos
bus.driveControl=new Message(0x205);

/**************************\
Create bms messages
\**************************/
//tpdos for bms 0
bus=network.bus.bms.messages;
bus.packStatus=new Message(0x188);
bus.packConfig=new Message(0x288);
bus.packStats=new Message(0x308);
bus.cellVoltage=new Message(0x388);
bus.packActiveData=new Message(0x408);
bus.packTempData=new Message(0x488);
bus.packTime=new Message(0x508);

//tpdos for bms 1
bus=network.bus.bms1.messages;
bus.packStatus=new Message(0x189);
bus.packConfig=new Message(0x289);
bus.packStats=new Message(0x309);
bus.cellVoltage=new Message(0x389);
bus.packActiveData=new Message(0x409);
bus.packTempData=new Message(0x489);
bus.packTime=new Message(0x509);

//rpdos for bms 0
bus.control=new Message(0x506);

//rpdos for bms 1
bus.control=new Message(0x506);

/**************************\
Create ccu messages
\**************************/
//tpdos
bus=network.bus.ccu.messages;
bus.chargeStatus=new Message(0x190);
bus.maxChargeVoltageCurrent=new Message(0x290);

//rpdos
bus.chargeControl=new Message(0x206);
bus.maxChargeVoltageCurrent=new Message(0x306);
bus.taperCutOffCurrent=new Message(0x406);

/**************************\
Create dash messages
\**************************/
//tpdos
bus=network.bus.dash.messages;
bus.dashStatus=new Message(0x1C0);
bus.odometerFromDash=new Message(0x2C0);

//rpdos
bus.status2=new Message(0x440);
bus.status3=new Message(0x540);
bus.odometerToDash=new Message(0x3C0);

/**************************\
Create calexSDS messages
\**************************/
//tpdos
bus=network.bus.calexSDS.messages;
bus.chargeStatus=new Message(0x192);
bus.maxChargeVoltageCurrent=new Message(0x292);

//rpdos
bus.chargeControl=new Message(0x206);
bus.maxChargeVoltageCurrent=new Message(0x306);
bus.taperCutOffCurrent=new Message(0x406);


/**************************\
Create calexXMX messages
\**************************/
//tpdos
bus=network.bus.calexXMX.messages;
bus.chargeStatus=new Message(0x193);
bus.maxChargeVoltageCurrent=new Message(0x293);

//rpdos
bus.chargeControl=new Message(0x206);
bus.maxChargeVoltageCurrent=new Message(0x306);
bus.taperCutOffCurrent=new Message(0x406);

/**********************************************\
start message data definition
\**********************************************/

/******************************\
Create Controller message data
\******************************/

//tpdo message data
bus=network.bus.controller.messages;
message=bus.speedTorque.signals;
message.targetId=new Signal(16,0);
message.targetIq=new Signal(16,2);
message.Id=new Signal(16,4);
message.Iq=new Signal(16,6);

message=bus.rpmThrottleMotTemp.signals;
message.velocity=new Signal(32,0);
message.throttleInputVoltage=new Signal(16,4);
message.motorTemp=new Signal(16,6);

message=bus.controllerTempDigitalIn18.signals;
message.batteryVoltage=new Signal(16,0);
message.controllerHeatsinkTemp=new Signal(8,2);
message.batteryCurrent=new Signal(16,3);
message.capacitorVoltage=new Signal(16,5);
message.digitalInputs18=new Signal(8,7);

message=bus.voltModInductanceTempEst.signals;
message.voltageModullation=new Signal(16,0);
message.measuredInductance=new Signal(16,2);
message.Ud=new Signal(16,4);
message.Uq=new Signal(16,6);

message=bus.targetVelMaxIQContVolt.signals;
message.economyValue=new Signal(16,0);
message.maxBatteryDischargeCurrent=new Signal(16,2);
message.maxIQAllowed=new Signal(16,4);
message.lineContactorCoilVoltage=new Signal(16,6);

//rpdo message data
message=bus.driveControl.signals;
message.maxBatteryChargeCurrent=new Signal(16,0);
message.maxBatteryDischargeCurrent=new Signal(16,2);
message.economyInputVoltage=new Signal(16,4);
message.driveabilitySelect1Switch=new Signal(1,6);
message.driveabilitySelect2Switch=new Signal(1,6);
message.footbreakSwitch=new Signal(1,6,2);
message.sportMode=new Signal(1,6,3);

/******************************\
Create BMS message data
\******************************/

//tpdo message data for BMS
bus=network.bus.bms.messages;
message=bus.packStatus.signals;
message.socPct=new Signal(8,0);
message.bmsStatusCharger=new Signal(16,1);
message.numChargeCycles=new Signal(16,3);
message.packBalance=new Signal(16,5);
message.numberOfBricks=new Signal(16,7);

message=bus.packConfig.signals;
message.packSagAdjustment=new Signal(16,0);
message.packMinTempForDischarge=new Signal(8,2);
message.packMinTempForCharge=new Signal(8,3);
message.packMinTempForCharge=new Signal(8,4);
message.packCapacityAH=new Signal(16,5);
message.modelYear=new Signal(8,7);

message=bus.packStats.signals;
message.bmsFirmwareRevision=new Signal(8,0);
message.bmsBoardRevision=new Signal(8,1);
message.runTimeSeconds=new Signal(16,2);
message.totalEnergyUsed=new Signal(32,4);
  
message=bus.cellVoltage.signals;
bus.cellVoltage.value=new format.CellList();
message.cellIndex=new Signal(8,0);
message.cellVoltage=new Signal(16,1);
message.packVoltage=new Signal(32,3);

message=bus.packActiveData.signals;


message=bus.packTempData.signals;


message=bus.packTime.signals;


/******************************\
Create Dash message data
\******************************/

//tpdo message data
bus=network.bus.dash.messages;
message=bus.dashStatus.signals;
message.statusBits=new Signal(16,0);
message.hours=new Signal(8,2);
message.minutes=new Signal(8,3);

message=bus.odometerFromDash.signals;
message.odometer=new Signal(48,0);
message.odometer.parser=format.divideSignalBy10;

network._messages=format.network(network.bus);

Object.preventExtensions(network);
module.exports=network;
