// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RandomUnsplashImages is ERC721, Ownable {
    uint256 counter;

    constructor() ERC721("Random Unsplash Images", "RUI") {}

    modifier mintchecks(uint _mintAmount) {
        require(counter <= 100, "only 100 tokens can be minted and no more");
        require(_mintAmount <= 5, "max 5 NFTs in a single transaction");
        require(
            msg.value == _mintAmount * 1 * 10**16,
            "NFT costs 0.01 eth each"
        );
        _;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmcKNJ1DDWVGguC39coADcDz46bUpSazEBQYKQyhq82Sgh/0";
    }

    function safeMint(address _to, uint _mintAmount)
        public
        payable
        onlyOwner
        mintchecks(_mintAmount)
    {
        for (uint i; i < _mintAmount; i++) {
            _safeMint(_to, counter);
            counter++;
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFunds() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }
}
