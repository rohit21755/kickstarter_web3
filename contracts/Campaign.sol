// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CampaignFactory {
    address[] public deployedCampaigns;
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    constructor(uint minimum, address _manager){
        manager = _manager;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender]= true;
        approversCount++;
    }
    function createRequest(string memory _description, uint _value, address payable _recipient) 
    public restricted 
    {   
        
        Request storage newRequest = requests.push();
        newRequest.description  = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0; 
    
    }

    function approveRequest(uint index) public {

        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(requests[index].approvalCount > approversCount/2);
        require(request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint,uint, uint, uint, address ) {
        return(
            minimumContribution, address(this).balance, requests.length,approversCount, manager
        );
    }
    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}