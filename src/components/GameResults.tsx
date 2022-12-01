import { useEffect, useState } from "react";
import PlayerControlPanel from "./PlayerControlPanel";
import { ITotalInfo, ITotalInfoKey } from "../Types/TotalInfo";

interface IGameResultsTextProps {
  didPlayerWin: boolean | null;
}

function GameResultsText({ didPlayerWin }: IGameResultsTextProps) {
  const winLoseText =
    didPlayerWin === null ? (
      <></>
    ) : (
      <div>{didPlayerWin ? "You Won" : "You Lose"}</div>
    );
  return winLoseText;
}

interface IGameResultsProps {
  totalPlayerInfo: ITotalInfo;
  setTotalPlayerInfo: React.Dispatch<React.SetStateAction<ITotalInfo>>;
  deckId: null | string;
}

function GameResults({
  totalPlayerInfo,
  setTotalPlayerInfo,
  deckId,
}: IGameResultsProps) {
  const [didPlayerWin, setDidPlayerWin] = useState<null | boolean>(null);
  const [didPlayerStand, setDidPlayerStand] = useState<boolean>(false);

  // check if a winner is present
  useEffect(() => {
    const playerTotal = totalPlayerInfo.player.total;
    const computerTotal = totalPlayerInfo.computer.total;
    const playerNumAces = totalPlayerInfo.player.acePositions.length;
    const computerNumAces = totalPlayerInfo.computer.acePositions.length;

    // helper to set the correct totalInfo Obj
    const setTotalInfoObj = (objKey: ITotalInfoKey) =>
      setTotalPlayerInfo((prevState) => ({
        ...prevState,
        [objKey]: {
          ...prevState[objKey],
          total: prevState[objKey].total - 11 + 1,
          acePositions: prevState[objKey].acePositions.slice(0, -1),
        },
      }));

    // if the player and the computer both get 21, the player loses
    if (playerTotal === 21 && computerTotal === 21) {
      setDidPlayerWin(false);
    } else if (playerTotal === 21) {
      // if the player has a total of 21, the game is over and they win
      setDidPlayerWin(true);
    } else if (computerTotal === 21) {
      // if the computer has a total of 21, the game is over and it wins
      setDidPlayerWin(false);
    } else if (playerTotal > 21) {
      // if the user has a score of over 21, check to see if they have aces
      if (playerNumAces > 0) {
        // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
        setTotalInfoObj("player");
      } else {
        // if not the user automatically loses
        setDidPlayerWin(false);
      }
    } else if (computerTotal > 21) {
      // if the Computer has a score of over 21 (2 aces), check to see if they have aces
      if (computerNumAces > 0) {
        // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
        setTotalInfoObj("computer");
      } else {
        // if not the computer automatically loses
        setDidPlayerWin(true);
      }
    } else if (didPlayerStand) {
      // if the player did stand and there is a tie OR the users cards total less than the computers cards, the computer wins
      if (playerTotal === computerTotal || playerTotal < computerTotal) {
        setDidPlayerWin(false);
      }

      // if the player has more points than the computer, the player wins
      if (playerTotal > computerTotal) {
        setDidPlayerWin(true);
      } else {
        // if the player and computer tie or the player has few points than the computer, the player loses
        setDidPlayerWin(false);
      }
    }
  }, [
    didPlayerStand,
    setTotalPlayerInfo,
    totalPlayerInfo.computer.acePositions.length,
    totalPlayerInfo.computer.total,
    totalPlayerInfo.player.acePositions.length,
    totalPlayerInfo.player.total,
  ]);

  return (
    <>
      <GameResultsText didPlayerWin={didPlayerWin} />
      <PlayerControlPanel
        setDidPlayerStand={setDidPlayerStand}
        didPlayerWin={didPlayerWin}
        didPlayerStand={didPlayerStand}
        deckId={deckId}
        setTotalPlayerInfo={setTotalPlayerInfo}
      />
    </>
  );
}

export default GameResults;
