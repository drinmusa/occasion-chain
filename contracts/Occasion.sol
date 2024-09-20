// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Occasion is ERC721 {
    address public owner;
    uint256 public occasionIdCounter = 0;
    uint256 public totalSupply = 0;
    struct OccasionInfo {
        uint256 id;
        string name;
        uint256 cost;
        uint256 availableTickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
        uint256 timestamp;
    }

    mapping(uint256 => OccasionInfo) public occasions;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => uint256[]) public seatsTaken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    // Function to create new occasions
    function createOccasion(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location,
        uint256 _timestamp
    ) public onlyOwner {
        occasionIdCounter++;
        occasions[occasionIdCounter] = OccasionInfo(
            occasionIdCounter,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location,
            _timestamp
        );
    }

    // Minting function for purchasing tickets
    function mintTicket(uint256 _occasionId, uint256 _seat) public payable {
        OccasionInfo storage occasion = occasions[_occasionId];
        require(
            _occasionId > 0 && _occasionId <= occasionIdCounter,
            "Invalid occasion"
        );
        require(msg.value >= occasion.cost, "Insufficient payment");
        require(
            seatTaken[_occasionId][_seat] == address(0),
            "Seat already taken"
        );
        require(_seat <= occasion.maxTickets, "Invalid seat number");
        require(occasion.availableTickets > 0, "No tickets available");
        require(
            block.timestamp < occasion.timestamp,
            "Cannot buy tickets after the occasion date"
        );
        occasion.availableTickets--;
        seatTaken[_occasionId][_seat] = msg.sender;
        hasBought[_occasionId][msg.sender] = true;
        seatsTaken[_occasionId].push(_seat);

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    // Get details of an occasion
    function getOccasion(
        uint256 _occasionId
    ) public view returns (OccasionInfo memory) {
        return occasions[_occasionId];
    }

    // Get all taken seats for an occasion
    function getSeatsTaken(
        uint256 _occasionId
    ) public view returns (uint256[] memory) {
        return seatsTaken[_occasionId];
    }

    // Function to withdraw contract balance (for the owner)
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
