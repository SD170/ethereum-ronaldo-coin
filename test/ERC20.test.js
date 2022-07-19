/**
 *
 * autogenerated by solidity-visual-auditor
 *
 * execute with:
 *  #> truffle test <path/to/this/test.js>
 *
 * */
const ERC20 = artifacts.require("ERC20");
const RonaldoCoin = artifacts.require("RonaldoCoin");

const truffleAssert = require("truffle-assertions");

contract("RonaldoCoin", (accounts) => {
  const creatorAddress = accounts[0];
  const firstOwnerAddress = accounts[1];
  const secondOwnerAddress = accounts[2];
  const thirdOwnerAddress = accounts[3];
  const fourthOwnerAddress = accounts[4];
  const externalAddress = accounts[5];
  /* create named accounts for contract roles */

  before(async () => {
    /* before tests */
  });

  beforeEach(async () => {
    /* before each context */
  });

  // it('should revert if ...', () => {
  //     return ERC20.deployed()
  //         .then(instance => {
  //             return instance.publicOrExternalContractMethod(argument1, argument2, {from:externalAddress});
  //         })
  //         .then(result => {
  //             assert.fail();
  //         })
  //         .catch(error => {
  //             assert.notEqual(error.message, "assert.fail()", "Reason ...");
  //         });
  //     });

  context("testgroup - security tests - description...", () => {
    let newRonaldoCoin;
    //deploy a new contract
    before(async () => {
      /* before tests */
      newRonaldoCoin = await RonaldoCoin.new("Ronaldo", "RON");
    });

    beforeEach(async () => {
      /* before each tests */
    });

    afterEach(async () => {
      /* after each tests */
      //   console.log(await newRonaldoCoin.totalSupply());
    });

    it("name and symbol check ...", async () => {
      assert.equal(await newRonaldoCoin.name(), "Ronaldo");
      assert.equal(await newRonaldoCoin.symbol(), "RON");
    });

    it("sending all tokens from creatorAddress to firstOwnerAddress", async () => {
      const totalTokenOfCreator = await newRonaldoCoin.balanceOf(
        creatorAddress
      );
      //   console.log(totalTokenOfCreator, "totalTokenOfCreator");
      const txnRes = await newRonaldoCoin.transfer(
        firstOwnerAddress,
        totalTokenOfCreator,
        { from: creatorAddress } // not needed explicitely
      );

      await truffleAssert.eventEmitted(txnRes, "Transfer", (event) => {
        // since numeric values in javascript do not have enough precision they are wrapped in an BN object. We can use those BN methods.
        // see BN docs: https://github.com/indutny/bn.js/#utilities
        return (
          event._from == creatorAddress &&
          event._to == firstOwnerAddress &&
          event._value.toNumber() == totalTokenOfCreator
        );
      });
    });

    it("trying to send token from addresses with 0 balance", async () => {
      const tokenSending = 1;

      await truffleAssert.reverts(
        newRonaldoCoin.transfer(thirdOwnerAddress, tokenSending, {
          from: externalAddress
        })
      );
    });

    it("approve allowance of firstOwnerAddress to secondOwnerAddress", async () => {
      const totalTokenOfFOwner = await newRonaldoCoin.balanceOf(
        firstOwnerAddress
      );
      //   console.log(totalTokenOfCreator, "totalTokenOfCreator");
      const txnRes = await newRonaldoCoin.approve(
        secondOwnerAddress,
        totalTokenOfFOwner, // giving access to tokens
        { from: firstOwnerAddress }
      );

      await truffleAssert.eventEmitted(txnRes, "Approval", (event) => {
        // since numeric values in javascript do not have enough precision they are wrapped in an BN object. We can use those BN methods.
        // see BN docs: https://github.com/indutny/bn.js/#utilities
        return (
          event._owner == firstOwnerAddress &&
          event._spender == secondOwnerAddress &&
          event._value.toNumber() == totalTokenOfFOwner
        );
      });

      //   const newBalOfCreator = await newRonaldoCoin.balanceOf(creatorAddress)
      //   console.log(newBalOfCreator.toString());
    });

    it("secondOwnerAddress sending MORE THAN allowance of firstOwnerAddress to fourthOwnerAddress", async () => {
      const totalAllowanceOfSOwner = await newRonaldoCoin.allowance(
        firstOwnerAddress,
        secondOwnerAddress
      );

      await truffleAssert.reverts(
        newRonaldoCoin.transferFrom(
          firstOwnerAddress,
          fourthOwnerAddress,
          totalAllowanceOfSOwner + 1,
          {
            from: secondOwnerAddress
          }
        )
      );
    });

    it("secondOwnerAddress sending allowance of firstOwnerAddress to fourthOwnerAddress", async () => {
      const totalAllowanceOfSOwner = await newRonaldoCoin.allowance(
        firstOwnerAddress,
        secondOwnerAddress
      );

      const txnRes = await newRonaldoCoin.transferFrom(
        firstOwnerAddress,
        fourthOwnerAddress,
        totalAllowanceOfSOwner,
        {
          from: secondOwnerAddress
        }
      );

        await truffleAssert.eventEmitted(txnRes, "Transfer", (event) => {
          // since numeric values in javascript do not have enough precision they are wrapped in an BN object. We can use those BN methods.
          // see BN docs: https://github.com/indutny/bn.js/#utilities
          return (
            event._from == firstOwnerAddress &&
            event._to == fourthOwnerAddress &&
            event._value.toNumber() == totalAllowanceOfSOwner
          );
        });

        // new balance of the fourthOwnerAddress should be eql to totalAllowanceOfSOwner.
        const newBalOfCreator = await newRonaldoCoin.balanceOf(fourthOwnerAddress)
        assert.equal(totalAllowanceOfSOwner.toString(), newBalOfCreator.toString())
    });

  });
});
