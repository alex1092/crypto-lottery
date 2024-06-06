# Crypto lottery 

If you look in `packages/*` you can see we have 3 folders 

- admin
- frontend
- hardhat

Admin is our portal for testing our deployed contracts

frontend is the customer facing site

hardhat is where we deploy our solidity contracts

link to live site [here](https://crypto-lottery-ffap.netlify.app/)

## Quick start 

first things first we need our dependencies

```
yarn
```

### Frontend

```js
yarn start:frontend
```

### Admin 

```js

yarn start:admin
```

### Hardhat 

The lottery contract is found in `packages/hardhat/contracts/LotteryContract.sol`

If you make changes you can deploy a new contract by running 

```
yarn deploy
```



