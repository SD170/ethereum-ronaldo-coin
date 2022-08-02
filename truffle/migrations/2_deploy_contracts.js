const RonaldoCoin = artifacts.require("RonaldoCoin");
const RonaldoCoinCapped = artifacts.require("RonaldoCoinCapped");

module.exports = async function (deployer, network, accounts) {
  // await deployer.deploy(RonaldoCoin, "Ronaldo", "RO2");
  await deployer.deploy(RonaldoCoinCapped, "RonaldoCoin", "RON");
};
