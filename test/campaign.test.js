const  { Web3 }  = require("web3");
const ganache = require("ganache");
const assert = require("assert");

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/CampaignFactory.json');
const compiledCampaign = require('../build/Campaign.json');
// console.log("Factory: ", compiledFactory);
// console.log("Campaign: ", compiledCampaign.abi);
let accounts;
let factory;
let campaignAddress;
let campaign;
let request;
console.log("Factory: ", compiledFactory.abi);
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log("Accounts: ");
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: "1500000"});
    console.log("Factory: ");
    await factory.methods.createCampaign('100')
        .send({from: accounts[0], gas: "1000000"});
    
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
    console.log(request)
    
});

describe('Campaigns', () => {
    it('deploying a factory and a campaign', async () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('checking manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });
    it('checking minimum contribution', async () => {
        const minimumContribution = await campaign.methods.minimumContribution().call();
        assert.equal(minimumContribution, '100');
    });
it('allow people to contribute', async () => {
    await campaign.methods.contribute().send({
        value: '200',
        from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
} );
it('requires a minimum contribution', async () => {
    try {
        await campaign.methods.contribute().send({
            value: '5',
            from: accounts[1]
        });
        assert(false);
    } catch (err) {
        assert(err);
    }
}
);
it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
        .send({from: accounts[0], gas: "1500000"});
    request = await campaign.methods.requests(0).call();
    console.log("Request: ", request);
    assert.equal('Buy batteries', request.description);
});


});