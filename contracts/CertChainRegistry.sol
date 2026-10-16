// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CertChainRegistry
 * @notice Institutional Academic Credential Merkle Root & Revocation Registry on Polygon PoS
 * @dev Anchors entire graduate cohorts in O(1) storage gas using SHA-256 binary Merkle trees
 *      and supports O(1) individual credential revocation by credential hash or ID.
 */
contract CertChainRegistry {
    struct CohortBatch {
        bytes32 merkleRoot;
        string batchId;
        string course;
        uint256 certificateCount;
        address issuer;
        uint256 anchoredAt;
        uint256 blockNumber;
        bool exists;
    }

    address public owner;
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => CohortBatch) public batchesByRoot;
    mapping(string => bytes32) public rootByBatchId;
    mapping(bytes32 => bool) public revokedCredentialHashes;

    event BatchAnchored(
        bytes32 indexed merkleRoot,
        string batchId,
        string course,
        uint256 certificateCount,
        address indexed issuer,
        uint256 timestamp
    );

    event CredentialRevocationUpdated(
        bytes32 indexed credentialHash,
        string credentialId,
        bool isRevoked,
        address indexed updatedBy,
        uint256 timestamp
    );

    event IssuerAuthorizationChanged(address indexed issuer, bool authorized);

    modifier onlyOwner() {
        require(msg.sender == owner, "CertChain: caller is not owner");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner,
            "CertChain: caller is not an authorized institutional issuer"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorizationChanged(msg.sender, true);
    }

    /**
     * @notice Authorize or deauthorize a university registrar wallet
     */
    function setAuthorizedIssuer(address issuer, bool status) external onlyOwner {
        authorizedIssuers[issuer] = status;
        emit IssuerAuthorizationChanged(issuer, status);
    }

    /**
     * @notice Anchor a new graduate cohort batch via its 32-byte Merkle Root
     */
    function anchorBatch(
        bytes32 merkleRoot,
        string calldata batchId,
        string calldata course,
        uint256 certificateCount
    ) external onlyAuthorizedIssuer {
        require(merkleRoot != bytes32(0), "CertChain: invalid empty merkle root");
        require(!batchesByRoot[merkleRoot].exists, "CertChain: merkle root already anchored");

        batchesByRoot[merkleRoot] = CohortBatch({
            merkleRoot: merkleRoot,
            batchId: batchId,
            course: course,
            certificateCount: certificateCount,
            issuer: msg.sender,
            anchoredAt: block.timestamp,
            blockNumber: block.number,
            exists: true
        });

        rootByBatchId[batchId] = merkleRoot;

        emit BatchAnchored(
            merkleRoot,
            batchId,
            course,
            certificateCount,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Revoke or restore an individual certificate on-chain
     */
    function setCredentialRevocation(
        bytes32 credentialHash,
        string calldata credentialId,
        bool isRevoked
    ) external onlyAuthorizedIssuer {
        revokedCredentialHashes[credentialHash] = isRevoked;
        emit CredentialRevocationUpdated(
            credentialHash,
            credentialId,
            isRevoked,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Verify a certificate leaf hash against an on-chain SHA-256 Merkle Root
     * @param merkleRoot The 32-byte cohort Merkle root anchored on Polygon
     * @param leafHash The SHA-256 digest of the candidate PDF certificate
     * @param proof Array of sibling hashes along the binary Merkle path
     * @param isLeftSibling Boolean flags indicating whether each sibling is on the left
     */
    function verifyCredentialMerkleProof(
        bytes32 merkleRoot,
        bytes32 leafHash,
        bytes32[] calldata proof,
        bool[] calldata isLeftSibling
    ) external view returns (bool isValid, bool isRevoked) {
        if (!batchesByRoot[merkleRoot].exists) {
            return (false, false);
        }

        isRevoked = revokedCredentialHashes[leafHash];

        bytes32 computedHash = leafHash;
        require(proof.length == isLeftSibling.length, "CertChain: proof length mismatch");

        for (uint256 i = 0; i < proof.length; i++) {
            if (isLeftSibling[i]) {
                computedHash = sha256(abi.encodePacked(proof[i], computedHash));
            } else {
                computedHash = sha256(abi.encodePacked(computedHash, proof[i]));
            }
        }

        isValid = (computedHash == merkleRoot) && !isRevoked;
    }
}
