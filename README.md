# yetris

yellow powered tetroids - who's the best player in the world? 

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
    
    %% Start Game
    Client->>Client: Sign message with wallet
    Client->>PlayerWS: startGame {address, message, signature}
    PlayerWS->>PlayerWS: Verify signature with ethers.verifyMessage()
    PlayerWS->>PlayerWS: Generate gameId & initial blocks
    PlayerWS->>Client: gameStarted {gameId, upcomingBlocks}
    
    %% Game Loop
    loop During Game
        Client->>PlayerWS: moveComplete {gameId}
        PlayerWS->>PlayerWS: Validate game & player
        PlayerWS->>PlayerWS: Shift blocks & add new random block
        PlayerWS->>Client: moveCompleted {gameId, upcomingBlocks}
    end
    
    %% Game Over
    Client->>PlayerWS: gameOver {gameId, score}
    PlayerWS->>PlayerWS: Validate game & mark inactive
    PlayerWS->>Contract: Read current high score
    Contract->>PlayerWS: Return current high score
    
    alt Score beats high score
        PlayerWS->>Contract: coronation(address, newScore)
        Contract->>PlayerWS: Return transaction hash
        PlayerWS->>Client: gameEnded {gameId, coronationHash}
    else Score doesn't beat high score
        PlayerWS->>Client: gameEnded {gameId}
    end
    
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
