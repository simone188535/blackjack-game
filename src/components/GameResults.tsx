import { useEffect, useState } from "react";
import PlayerControlPanel from "./PlayerControlPanel";
import { ITotalInfo } from "../Types/TotalInfo";
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
    // if the player and the computer both get 21, the player loses
    if (
      totalPlayerInfo.player.total === 21 &&
      totalPlayerInfo.computer.total === 21
    ) {
      setDidPlayerWin(false);
    } else if (totalPlayerInfo.player.total === 21) {
      // if the player has a total of 21, the game is over and they win
      setDidPlayerWin(true);
    } else if (totalPlayerInfo.computer.total === 21) {
      // if the computer has a total of 21, the game is over and it wins
      setDidPlayerWin(false);
    } else if (totalPlayerInfo.player.total > 21) {
      // if the user has a score of over 21, check to see if they have aces
      if (totalPlayerInfo.player.acePositions.length > 0) {
        // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
        setTotalPlayerInfo((prevState) => ({
          ...prevState,
          player: {
            ...prevState.player,
            total: prevState.player.total - 11 + 1,
            acePositions: prevState.player.acePositions.slice(0, -1),
          },
        }));
      } else {
        // if not the user automatically loses
        setDidPlayerWin(false);
      }
    } else if (totalPlayerInfo.computer.total > 21) {
      // if the Computer has a score of over 21 (2 aces), check to see if they have aces
      if (totalPlayerInfo.computer.acePositions.length > 0) {
        // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
        setTotalPlayerInfo((prevState) => ({
          ...prevState,
          computer: {
            ...prevState.computer,
            total: prevState.computer.total - 11 + 1,
            acePositions: prevState.computer.acePositions.slice(0, -1),
          },
        }));
      } else {
        // if not the computer automatically loses
        setDidPlayerWin(true);
      }
    } else if (didPlayerStand) {
      // if the player did stand and there is a tie OR the users cards total less than the computers cards, the computer wins
      if (
        totalPlayerInfo.player.total === totalPlayerInfo.computer.total ||
        totalPlayerInfo.player.total < totalPlayerInfo.computer.total
      ) {
        setDidPlayerWin(false);
      }

      // if the player has more points than the computer, the pplayer wins
      if (totalPlayerInfo.player.total > totalPlayerInfo.computer.total) {
        setDidPlayerWin(true);
      } else {
        // if the player and computer tie or the player has few points than the computer, the player loses
        setDidPlayerWin(false);
      }
    }
  }, [
    didPlayerStand,
    setDidPlayerWin,
    setTotalPlayerInfo,
    totalPlayerInfo.computer.acePositions.length,
    totalPlayerInfo.computer.total,
    totalPlayerInfo.player.acePositions.length,
    totalPlayerInfo.player.total,
  ]);

  return (
    <>
      <PlayerControlPanel
        setDidPlayerStand={setDidPlayerStand}
        didPlayerWin={didPlayerWin}
        didPlayerStand={didPlayerStand}
        deckId={deckId}
        setTotalPlayerInfo={setTotalPlayerInfo}
      />
      <GameResultsText didPlayerWin={didPlayerWin} />
    </>
  );
}

export default GameResults;
