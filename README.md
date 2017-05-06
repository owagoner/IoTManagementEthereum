## IoT Registration and Management DApp
This repository was developed as a final Capstone Project for the Master of Information Systems Management degree at 
the Heinz School of Information Systems at Carnegie Mellon University during the Spring of 2017.

## Getting Started

To begin using this repo, please follow the instructions below:
* Install the latest Geth client from: https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum
* Create new account in Geth:
  ```    
  $ geth account new
  ```

* Set up private Ethereum network using the following configurations:
  ```
  $ geth --identity "NodeName" --ipcpath /Path/to/geth.ipc --rpc --rpcport "PORT NUM" --rpccorsdomain "*" --datadir "/Custom/Path/For/Blockchain/Data" --port "LISTENING PORT" --nodiscover --rpcapi "db,eth,net,web3" --networkid 1999 --unlock "ACCOUNT ADDRESS TO USE" --password ~/Path/To/passwordfile.txt console
  ```

* Start miner on node:
  ```
  $ geth --dev --exec "miner.start()" attach
  ```

* Stop miner with:
  ```
  $ geth --dev --exec "miner.stop()" attach
  ```

* Additional information for configuring Geth can be found https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options 

## Creator

This repo was created by **[Owen Wagoner](https://www.linkedin.com/in/owenwagoner/)** and **[Abhishek Singhal](https://www.linkedin.com/in/abhisheksinghal24/)**.

Freelancer theme was created by and is maintained by **[David Miller](http://davidmiller.io/)** and is avaliable **[here](http://startbootstrap.com/template-overviews/freelancer/)**.

## Copyright and License

Copyright 2017. Code released under the **[MIT](https://github.com/owagoner/IoTManagementEthereum/blob/master/LICENSE)** license.
