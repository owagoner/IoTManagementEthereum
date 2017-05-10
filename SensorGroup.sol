pragma solidity ^0.4.11;

contract SensorGroup{

	mapping (string => Sensor) allSensors;

	struct Sensor {
		string sensorHash;
		string publicKey;
		bool initialized;
	}

	function addSensor( string sensorHash, string publicKey) returns(bool) {
		Sensor memory s;
		s.sensorHash = sensorHash;
		s.publicKey = publicKey;
		s.initialized = true;
		allSensors[s.sensorHash] = s;
		return true;
	}

	function validateHash(string sensorHash) constant returns(bool) {
		Sensor s = allSensors[sensorHash];
		if(s.initialized){
			return true;
		}else{
			return false;
		}
	}

	function getPublicKey(string sensorHash) constant returns(string){
		Sensor s = allSensors[sensorHash];
		return s.publicKey;
	}
}