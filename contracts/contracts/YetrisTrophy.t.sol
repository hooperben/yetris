// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {YetrisTrophy} from "./YetrisTrophy.sol";

contract YetrisTrophyTest is Test {
    YetrisTrophy public yetrisCrown;

    address public deployer;
    address public kingMaker;
    address public addr1;
    address public addr2;
    address public addr3;

    bytes32 public constant KING_MAKER_ROLE = keccak256("KING_MAKER");
    uint256 public constant TOKEN_ID = 1;
    string public constant METADATA_URI = "ipfs://XYZ";

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    function setUp() public {
        deployer = address(this);
        kingMaker = makeAddr("kingMaker");
        addr1 = makeAddr("addr1");
        addr2 = makeAddr("addr2");
        addr3 = makeAddr("addr3");

        yetrisCrown = new YetrisTrophy();

        // Grant KING_MAKER role to kingMaker address
        yetrisCrown.grantRole(KING_MAKER_ROLE, kingMaker);
    }

    function test_CorrectNameAndSymbol() public view {
        assertEq(yetrisCrown.name(), "YetrisTrophy");
        assertEq(yetrisCrown.symbol(), "CROWN");
    }

    function test_MaxSupplyAndInitialTotalSupply() public view {
        assertEq(yetrisCrown.maxSupply(), 1);
        assertEq(yetrisCrown.totalSupply(), 0);
    }

    function test_DefaultAdminRoleGrantedToDeployer() public view {
        bytes32 defaultAdminRole = yetrisCrown.DEFAULT_ADMIN_ROLE();
        assertTrue(yetrisCrown.hasRole(defaultAdminRole, deployer));
    }

    function test_AdminCanGrantKingMakerRole() public {
        address newKingMaker = makeAddr("newKingMaker");

        yetrisCrown.grantRole(KING_MAKER_ROLE, newKingMaker);
        assertTrue(yetrisCrown.hasRole(KING_MAKER_ROLE, newKingMaker));
    }

    function test_AdminCanRevokeKingMakerRole() public {
        yetrisCrown.revokeRole(KING_MAKER_ROLE, kingMaker);
        assertFalse(yetrisCrown.hasRole(KING_MAKER_ROLE, kingMaker));
    }

    function test_NonAdminCannotGrantKingMakerRole() public {
        vm.prank(addr1);
        vm.expectRevert();
        yetrisCrown.grantRole(KING_MAKER_ROLE, addr2);
    }

    function test_CoronationMintsTokenWhenNoTokenExists() public {
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr1);
        assertEq(yetrisCrown.totalSupply(), 1);
        assertEq(yetrisCrown.balanceOf(addr1), 1);
    }

    function test_CoronationEmitsTransferEventWhenMinting() public {
        vm.prank(kingMaker);
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), addr1, TOKEN_ID);
        yetrisCrown.coronation(addr1);
    }

    function test_OnlyKingMakerCanCallCoronation() public {
        vm.prank(addr1);
        vm.expectRevert();
        yetrisCrown.coronation(addr2);
    }

    function test_CoronationTransfersTokenBetweenOwners() public {
        // Initial coronation to addr1
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        // Transfer to addr2
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr2);

        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr2);
        assertEq(yetrisCrown.balanceOf(addr1), 0);
        assertEq(yetrisCrown.balanceOf(addr2), 1);
        assertEq(yetrisCrown.totalSupply(), 1);
    }

    function test_CoronationEmitsTransferEventWhenTransferring() public {
        // Initial coronation
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        // Transfer to addr2
        vm.prank(kingMaker);
        vm.expectEmit(true, true, true, true);
        emit Transfer(addr1, addr2, TOKEN_ID);
        yetrisCrown.coronation(addr2);
    }

    function test_CoronationAllowsTransferToSameOwner() public {
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr1);
    }

    function test_MultipleTransfersBetweenDifferentOwners() public {
        // Transfer to addr1
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);
        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr1);

        // Transfer to addr2
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr2);
        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr2);

        // Transfer to addr3
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr3);
        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr3);

        // Transfer back to addr1
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);
        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr1);
    }

    function test_TokenURIReturnsCorrectMetadata() public {
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        assertEq(yetrisCrown.tokenURI(TOKEN_ID), METADATA_URI);
    }

    function test_TokenURIRevertsForNonExistentToken() public {
        vm.expectRevert();
        yetrisCrown.tokenURI(2);
    }

    function test_SupplyRemainsOneAfterMultipleTransfers() public {
        vm.startPrank(kingMaker);
        yetrisCrown.coronation(addr1);
        yetrisCrown.coronation(addr2);
        yetrisCrown.coronation(addr3);
        vm.stopPrank();

        assertEq(yetrisCrown.totalSupply(), 1);
        assertEq(yetrisCrown.ownerOf(TOKEN_ID), addr3);
    }

    function test_SupportsERC721Interface() public view {
        // ERC721 interface ID: 0x80ac58cd
        assertTrue(yetrisCrown.supportsInterface(0x80ac58cd));
    }

    function test_SupportsAccessControlInterface() public view {
        // AccessControl interface ID: 0x7965db0b
        assertTrue(yetrisCrown.supportsInterface(0x7965db0b));
    }

    function test_SupportsERC165Interface() public view {
        // ERC165 interface ID: 0x01ffc9a7
        assertTrue(yetrisCrown.supportsInterface(0x01ffc9a7));
    }

    function test_CoronationRevertsWithZeroAddress() public {
        vm.prank(kingMaker);
        vm.expectRevert();
        yetrisCrown.coronation(address(0));
    }

    function test_NonKingMakerCannotCoronateEvenAfterTokenExists() public {
        vm.prank(kingMaker);
        yetrisCrown.coronation(addr1);

        vm.prank(addr1);
        vm.expectRevert();
        yetrisCrown.coronation(addr2);
    }

    function test_FuzzCoronationWithMultipleAddresses(address to) public {
        vm.assume(to != address(0));
        vm.assume(to.code.length == 0); // Ensure it's not a contract

        vm.prank(kingMaker);
        yetrisCrown.coronation(to);

        assertEq(yetrisCrown.ownerOf(TOKEN_ID), to);
        assertEq(yetrisCrown.totalSupply(), 1);
        assertEq(yetrisCrown.balanceOf(to), 1);
    }

    function test_FuzzMultipleCoronations(address[5] memory addresses) public {
        // Filter out zero addresses and ensure uniqueness
        for (uint i = 0; i < addresses.length; i++) {
            vm.assume(addresses[i] != address(0));
            vm.assume(addresses[i].code.length == 0);
        }

        address lastOwner;
        vm.startPrank(kingMaker);

        for (uint i = 0; i < addresses.length; i++) {
            yetrisCrown.coronation(addresses[i]);
            lastOwner = addresses[i];

            assertEq(yetrisCrown.ownerOf(TOKEN_ID), lastOwner);
            assertEq(yetrisCrown.totalSupply(), 1);
            assertEq(yetrisCrown.balanceOf(lastOwner), 1);
        }

        vm.stopPrank();
    }
}
