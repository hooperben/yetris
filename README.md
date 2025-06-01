# yetris

yellow powered tetroids - who's the best player in the world? 

## Components

#### `client/`

This is the nextJS app deployed to https://yetris.vercel.app.

#### `state-channel`

This is an expressJS app that facilitates the off chain tetris game state, and submits the high score to the chain in the event that it is beaten.

#### `contracts`

This is a hardhat v3 program that has the Trophy NFT that is minted to the user whos able to get the new high score. It is currently deployed on polygon mainnet [here](https://polygonscan.com/address/0x6d64b04A8ec0dceb6304CC56845C665Fd454a0F1).

### Flow diagram

Below is a diagram on how the system application currently works.

```mermaid
sequenceDiagram
    participant Client as Game Client
    participant PlayerWS as Player WebSocket Server
    participant NitroWS as Nitro WebSocket Client
    participant Broker as Nitro Broker (clearnet.yellow.com)
    participant Contract as Trophy Contract

    %% Nitro Authentication Flow
    Note over NitroWS, Broker: Nitro Broker Authentication
    NitroWS->>Broker: Connect to wss://clearnet.yellow.com/ws
    NitroWS->>NitroWS: Generate auth request message
    NitroWS->>Broker: Send auth request
    Broker->>NitroWS: Send auth challenge
    NitroWS->>NitroWS: Sign challenge with EIP712
    NitroWS->>Broker: Send auth verify message
    Note over NitroWS, Broker: Authentication Complete

    %% Player Game Flow
    Note over Client, PlayerWS: Game Communication
    Client->>PlayerWS: Connect to Player WebSocket
    PlayerWS->>PlayerWS: Generate playerId
    
    %% Start Game with Session Creation
    Client->>Client: Sign message with wallet
    Client->>PlayerWS: startGame {address, message, signature}
    PlayerWS->>PlayerWS: Verify signature with ethers.verifyMessage()
    PlayerWS->>PlayerWS: Generate gameId & initial blocks
    PlayerWS->>NitroWS: createApplicationSession(gameId)
    NitroWS->>Broker: create_session {gameId, sessionType, participants}
    Broker->>NitroWS: Session created response
    NitroWS->>PlayerWS: Session result
    PlayerWS->>Client: gameStarted {gameId, upcomingBlocks, sessionId}
    
    %% Game Loop
    loop During Game
        Client->>PlayerWS: moveComplete {gameId}
        PlayerWS->>PlayerWS: Validate game & player
        PlayerWS->>PlayerWS: Shift blocks & add new random block
        PlayerWS->>Client: moveCompleted {gameId, upcomingBlocks}
    end
    
    %% Game Over with Session Termination
    Client->>PlayerWS: gameOver {gameId, score}
    PlayerWS->>PlayerWS: Validate game & mark inactive
    PlayerWS->>Contract: Read current high score
    Contract->>PlayerWS: Return current high score
    
    alt Score beats high score
        PlayerWS->>Contract: coronation(address, newScore)
        Contract->>PlayerWS: Return transaction hash
    end
    
    PlayerWS->>NitroWS: endApplicationSession(gameId)
    NitroWS->>Broker: end_session {gameId}
    Broker->>NitroWS: Session ended response
    NitroWS->>PlayerWS: End session result
    PlayerWS->>PlayerWS: Clean up game from memory
    PlayerWS->>Client: gameEnded {gameId, coronationHash?}
    
    %% Cleanup
    Client->>PlayerWS: Disconnect
    PlayerWS->>PlayerWS: Clean up player's games
```

### Improvements

- need to use the created application session to manage the game state (sttate diffs, atleast)
- need to validate the game score on the server as the game goes on, rather than at the end
- there's a bug in the game where it crashes and I'm not sure how to recreate
- mobile view of the app is pretty broken
- the leaderboard could probably be written to every game - not just the games where the high score is broken?
