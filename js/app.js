function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}

function refreshSensorData(urlToFetch, divId, loaderDiv) {
    $(divId).html("");
    $(loaderDiv).show();
    $.ajax({
        dataType: "json",
        url: urlToFetch,
        success: function (result) {
            var jobj = $.parseJSON(result);
            var result = '<tr><th>Sensor Hash</th><th>Data</th><th>Date</th><th>Data Signature To Check</th><th>Data Signature</th></tr>';
            if (jobj == '') {
                result = result + '<tr><td colspan"5">No data</td></tr>';
            }
            $.each(jobj, function (index, value) {
                result = result
                    + '<tr>'
                    + '<td><input type="text" readonly value="' + value.sensorHash + '"></td>'
                    + '<td><input type="text" readonly value="' + value.data + '"></td>'
                    + '<td><input type="text" readonly value="' + value.date + '"></td>'
                    + '<td>' + getDataValue(value) + '</td>'
                    + '<td><input type="text" readonly value="' + value.signature + '"></td>'
                    + "</tr>";
                // <input type="text" readonly value="">
            });
            $(loaderDiv).hide();
            $(divId).append(result);
        },
        error: function () {
            alert('Error fetching database data.');
        }
    });
}

function validateSensorData() {
    var pubKeyVal = $('#sensorPubKeyValue').val();
    var sigVal = $('#dataSigValue').val();
    //BigInteger clearSigBI = signature.modPow(e, new BigInteger(n1));
    var eBI = new BigInteger("65537");
    //console.log('E: ' + eBI.toString());
    var nBI = new BigInteger(pubKeyVal);
    //console.log('N: ' + nBI.toString());
    var sigValBI = new BigInteger(sigVal);
    //console.log('Sig BI: ' + sigValBI.toString());
    var clearSig = sigValBI.modPow(eBI, nBI);
    //console.log(clearSig.toString());
    //console.log(clearSig.toByteArray());
    var clearText = uintToString(clearSig.toByteArray());
    //console.log(clearMaybe);
    $('#plainDataSigValue').val(clearText);
    //var clearSig = bigInt(sigVal).modPow(bigInt("65537"),bigInt(pubKeyVal));
    //console.log(clearSig.toString());
    var hashOfValue = $('#hashPlainDataValue').val();

    if (clearText == hashOfValue) {
        var success = '<div class="alert alert-success alert-dismissible" role="alert" id="alertSuccessSigValidation">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<strong>Valid!</strong> The digital signature is valid.</div>';
        $('#alertAfter').after(success);
    } else {
        var fail = '<div class="alert alert-danger alert-dismissible" role="alert" id="alertFailSigValidation">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<strong>Warning!</strong> Signature is not valid!</div>';
        $('#alertAfter').after(fail);
    }

}

function getDataValue(value) {
    //{"sensorHash":"8e3c509380ab0b25d40cdce573df2b92f3988a35bcd87b261f3c2d6602cf5e57","data":"4.920546146872121","date":"Apr 27, 2017 1:49:24 PM"}
    // var resVal = '{"sensorHash":"' + value.sensorHash + '","data":"' + value.data + '",';
    var newDate = moment(value.date);
    // resVal = resVal + '"date":"' + newDate.format('MMM DD, YYYY h:mm:ss A') + '"}';
    // return resVal;
    return '{"sensorHash":"' + value.sensorHash + '","data":"' + value.data + '","date":"' + newDate.format('MMM D, YYYY h:mm:ss A') + '"}';
}

function listAccounts() {
    var htmlList = "";
    $.each(accounts, function (index, value) {
        htmlList = htmlList + "<li>" + value + "</li>";
    });
    $('#accountList').html(htmlList);
}

function deployContract() {
    var cA = $('#contractAddressInput').val();
    var fail = '<div class="alert alert-danger alert-dismissible" role="alert" id="alertFailSigValidation">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<strong>Warning!</strong> Contract could not be deployed!</div>';
    var sensorgroup_sol_sensorgroupContract = web3.eth.contract([{ "constant": false, "inputs": [{ "name": "sensorHash", "type": "string" }, { "name": "publicKey", "type": "string" }], "name": "addSensor", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "sensorHash", "type": "string" }], "name": "getPublicKey", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "sensorHash", "type": "string" }], "name": "validateHash", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }]);

    if (cA == '') {
        var sensorgroup_sol_sensorgroup = sensorgroup_sol_sensorgroupContract.new(
            {
                from: account,
                data: '0x6060604052341561000c57fe5b5b6106408061001c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636063ad1b14610051578063bff9082114610106578063c2c1a1ed146101e7575bfe5b341561005957fe5b6100ec600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610259565b604051808215151515815260200191505060405180910390f35b341561010e57fe5b61015e600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061035d565b60405180806020018281038252838181518152602001915080519060200190808383600083146101ad575b8051825260208311156101ad57602082019150602081019050602083039250610189565b505050905090810190601f1680156101d95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101ef57fe5b61023f600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610478565b604051808215151515815260200191505060405180910390f35b6000610263610517565b838160000181905250828160200181905250600181604001901515908115158152505080600082600001516040518082805190602001908083835b602083106102c1578051825260208201915060208101905060208303925061029e565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000820151816000019080519060200190610310929190610547565b50602082015181600101908051906020019061032d929190610547565b5060408201518160020160006101000a81548160ff021916908315150217905550905050600191505b5092915050565b6103656105c7565b60006000836040518082805190602001908083835b6020831061039d578051825260208201915060208101905060208303925061037a565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390209050806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561046a5780601f1061043f5761010080835404028352916020019161046a565b820191906000526020600020905b81548152906001019060200180831161044d57829003601f168201915b505050505091505b50919050565b600060006000836040518082805190602001908083835b602083106104b2578051825260208201915060208101905060208303925061048f565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090508060020160009054906101000a900460ff16156105075760019150610511565b60009150610511565b5b50919050565b60606040519081016040528061052b6105db565b81526020016105386105db565b81526020016000151581525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061058857805160ff19168380011785556105b6565b828001600101855582156105b6579182015b828111156105b557825182559160200191906001019061059a565b5b5090506105c391906105ef565b5090565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b61061191905b8082111561060d5760008160009055506001016105f5565b5090565b905600a165627a7a72305820ae73f2085f0bcac88690d6563fec8fd567b83401cff26fd8c9b651711d4bfdde0029',
                gas: '4700000'
            }, function (e, contract) {
                console.log(e, contract);
                if (typeof contract.address !== 'undefined') {
                    contractOb = contract;
                    contractAddress = contract.address;
                    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                    //var success = '<div class="alert alert-success" role="alert">' +
                    //    '<strong>Success!</strong> Contract successfully deployed! At address:' + contract.address + '</div>';
                    //$('#deployButton').after(success);
                    $('#contractAddressInput').val(contract.address);
                } else {
                    //$('#deployButton').after(fail);
                }
            })
    } else {
        contractAddress = cA;
        var contractInstance = sensorgroup_sol_sensorgroupContract.at([cA]);
        contractOb = contractInstance;
    }
}

function validateSensorHash() {
    var sensorHash = $('#sensorHashValue').val();

    var MyContract = web3.eth.contract(contractAbi);

    // initiate contract for an address
    var myContractInstance = MyContract.at(contractAddress);

    var result = myContractInstance.validateHash(sensorHash, { from: account });
    if (result) {
        console.log('ValidSensor result:' + result);
        alert('Valid sensor.');
    } else {
        alert('Sensor not valid.');
    }
}

function refreshSensorMessages(urlToFetch, divId) {
    $.ajax({
        dataType: "json",
        url: urlToFetch,
        success: function (result) {
            $(divId).html(result);
        },
        error: function () {
            alert('Error fetching database data.');
        }
    });
}

function deleteMessagesInQueue(urlToFetch) {
    $.ajax({
        dataType: "json",
        url: urlToFetch + '?' + $.param({ "id": 120942177 }),
        type: 'DELETE',
        success: function (result) {
            if (result) {
                console.log('Successfully deleted messages.');
            } else {
                alert('Error deleting messages in queue.');
            }
        },
        error: function () {
            alert('Error deleting messages in queue.');
        }
    });
}

function clearDatabaseCollection(urlToFetch) {
    $.ajax({
        dataType: "json",
        url: urlToFetch + '?' + $.param({ "id": 214213232 }),
        type: 'DELETE',
        success: function (result) {
            if (result) {
                console.log('Successfully deleted messages.');
            } else {
                alert('Error clearing colleciton.');
            }
        },
        error: function () {
            alert('Error deleting collection.');
        }
    });
}

function clearDataValidationForm() {
    $('#plainDataValue').val('');
    $('#hashPlainDataValue').val('');
    $('#sensorPubKeyValue').val('');
    $('#dataSigValue').val('');
    $('#plainDataSigValue').val('');
}

function getSensorPublicKey() {
    var sensorSerial = $('#sensorSerial2').val();
    var sensorModel = $('#sensorModel2').val();
    var sensorManufacturer = $('#sensorManufacturer2').val();
    var sensorHash = $('#sensorHash2').val();

    //Clear existing if any
    $('#sensorPubKeyLookupVal').val('');

    var hash;
    if (sensorSerial != '' && sensorModel != '' && sensorManufacturer != '') {
        //var hash = sha256(str);
        hash = sha256(sensorSerial + sensorModel + sensorManufacturer);
    } else if (sensorHash != '') {
        hash = sensorHash;
    }


    //var hash = 'hash1';
    var MyContract = web3.eth.contract(contractAbi);
    // initiate contract for an address
    var myContractInstance = MyContract.at(contractAddress);
    // call contract
    var res = myContractInstance.getPublicKey(hash, { from: account, gas: 200000000 });
    //alert('Public key: ' + res);
    //console.log(res);
    $('#sensorPubKeyLookupVal').val(res);
}

function addSensorToBlockchain() {
    var sensorSerial = $('#sensorSerial').val();
    var sensorModel = $('#sensorModel').val();
    var sensorManufacturer = $('#sensorManufacturer').val();
    //Get hash
    var hash = sha256(sensorSerial + sensorModel + sensorManufacturer);
    //Get public key
    var pubKey = $('#sensorPubKey').val();

    var MyContract = web3.eth.contract(contractAbi);

    // initiate contract for an address
    var myContractInstance = MyContract.at(contractAddress);

    var res = myContractInstance.addSensor(hash, pubKey, { from: account, gas: 200000000 });
    //alert('Successfully added sensor.');
    //console.log(res);
    if (res != '') {
        $('#sensorSerial').val('');
        $('#sensorModel').val('');
        $('#sensorManufacturer').val('');
        $('#sensorPubKey').val('');
        var success = '<div class="alert alert-success alert-dismissible" role="alert" id="alertSuccessSigValidation">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<strong>Success!</strong> Sensor added to blockchain!</div>';
        $('#divToAddAfter').after(success);
    } else {
        var fail = '<div class="alert alert-danger alert-dismissible" role="alert" id="alertFailSigValidation">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<strong>Warning!</strong> Unable to add sensor to blockchain!</div>';
        $('#divToAddAfter').after(fail);
    }
}