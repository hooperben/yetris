// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract YetrisTrophy is ERC721, AccessControl {
    bytes32 public constant KING_MAKER = keccak256("KING_MAKER");
    uint256 private constant TOKEN_ID = 1;
    uint256 private constant MAX_SUPPLY = 1;
    string private _metadataURI = "ipfs://";

    uint256 private _currentSupply;

    uint256 public highScore;

    constructor() ERC721("YetrisTrophy", "CROWN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _metadataURI;
    }

    function coronation(
        address to,
        uint256 newHigh
    ) external onlyRole(KING_MAKER) {
        if (_currentSupply == 0) {
            // Mint the token if it doesn't exist
            _mint(to, TOKEN_ID);
            _currentSupply = 1;
        } else {
            // Transfer from current owner to new owner
            address currentOwner = ownerOf(TOKEN_ID);
            _transfer(currentOwner, to, TOKEN_ID);
        }

        highScore = newHigh;
    }

    function totalSupply() external view returns (uint256) {
        return _currentSupply;
    }

    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setMetadataURI(
        string calldata newMetadataURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _metadataURI = newMetadataURI;
    }
}
