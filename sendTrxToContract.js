/* This JS script is a POC for interacting with ethereum blockchain based on senzor data provided by RaspPi*/

/*
First we need to setup the environment by installing the following dependecies:
npm install ethereumjs-util@4.4 ethereumjs-tx@1.3 eth-lightwallet@2.5 ethereumjs-testrpc web3@0.20.1
*/

//loading needed libraries
var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;

//setting web3 on infura testnet
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://ropsten.infura.io/HcekpL4KhjR4L0pCa4o8')
);

//declaring contract related variables
var address = '0xcC6CaE5E121c69A4c3d4343509E859b804320cF7';
var key = 'e56ec09e254d33d3f3eb46fe6bfc86fb760b3bee2b51a00e892716ee902d2438';
var contractAddress = '0x557601B3a4119Bc1421d94dAc6aC5ef6482b63BE';
var abi = [{"constant":false,"inputs":[{"name":"_sensorData","type":"int256"}],"name":"setSensorData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getSensorData","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

// function to sign transaction with private key
function sendRaw(rawTx) {
    var privateKey = new Buffer(key, 'hex');
    var transaction = new tx(rawTx);
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    web3.eth.sendRawTransaction(
    '0x' + serializedTx, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
}

//sense_hat dependencies
imu = require('node-sense-hat').Imu
IMU = new imu.IMU()
IMU.getValue((err, data) => {
	if(err != null) {
			console.error('Could not read sensor data: ', err)
			return
	}

//RPi Sensors listing on console
	console.log('Temp is: ', data.temperature)
	console.log('Pressure is: ', data.pressure)
	console.log('Humidity is: ', data.humidity)

//grab the RPi's temperature sensor value into temp variable for later use 
 var temp = data.temperature

//call setSensorData function ,  |update! added "temp" variable RA|  we have to replace with temperature from pi
function SetSensorData() 
		{	
			var txOptions = {
				nonce: web3.toHex(web3.eth.getTransactionCount(address)),
				gasLimit: web3.toHex(80000),
				gasPrice: web3.toHex(11000000000),
				to: contractAddress
							}
var rawTx = txutils.functionTx(abi, 'setSensorData', [temp], txOptions);		
sendRaw(rawTx);
		}

//get temp value from blockchain calling getSensorData function from our contract. 
//This function call will happen after a timeout of 59sec(to assure the setSensorData transaction is mined and the temperature is set in our smart contract) 
function GetSensorData()
		{
			var contract = web3.eth.contract(abi);
			var instance = contract.at(contractAddress);
			instance.getSensorData.call(function(err, result) {
				if(err) {
					console.log(err);
				} else {
					console.log(result.toNumber());
				}
			});
		}

//call first function 		
SetSensorData() ;
				
//call second function after the timeout, it returns the value from GetSensorData
setTimeout(GetSensorData, 59000) ;

})


//test