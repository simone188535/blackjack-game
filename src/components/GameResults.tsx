import { useEffect } from "react";
import { ITotalInfo } from "../Types/TotalInfo";

type SetStateTotalInfo = React.Dispatch<React.SetStateAction<ITotalInfo>>;

interface GameResultsProps {
  totalPlayerInfo: ITotalInfo;
  totalComputerInfo: ITotalInfo;
  didPlayerStand: boolean;
  didPlayerWin: null | boolean;
  setDidPlayerWin: React.Dispatch<React.SetStateAction<boolean | null>>;
  setTotalPlayerInfo: SetStateTotalInfo;
  setTotalComputerInfo: SetStateTotalInfo;
}

function GameResults({
  totalPlayerInfo,
  totalComputerInfo,
  didPlayerStand,
  didPlayerWin,
  setDidPlayerWin,
  setTotalPlayerInfo,
  setTotalComputerInfo,
}: GameResultsProps) {
  // // check if a winner is present
  // useEffect(() => {
  //   // if the player and the computer both get 21, the player loses
  //   if (totalPlayerInfo.total === 21 && totalComputerInfo.total === 21) {
  //     setDidPlayerWin(false);
  //   } else if (totalPlayerInfo.total === 21) {
  //     // if the player has a total of 21, the game is over and they win
  //     setDidPlayerWin(true);
  //   } else if (totalComputerInfo.total === 21) {
  //     // if the computer has a total of 21, the game is over and it wins
  //     setDidPlayerWin(false);
  //   } else if (totalPlayerInfo.total > 21) {
  //     // if the user has a score of over 21, check to see if they have aces
  //     if (totalPlayerInfo.acePositions.length > 0) {
  //       // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
  //       setTotalPlayerInfo((prevState) => ({
  //         ...prevState,
  //         total: prevState.total - 11 + 1,
  //         acePositions: prevState.acePositions.slice(0, -1),
  //       }));
  //     } else {
  //       // if not the user automatically loses
  //       setDidPlayerWin(false);
  //     }
  //   } else if (totalComputerInfo.total > 21) {
  //     // if the Computer has a score of over 21 (2 aces), check to see if they have aces
  //     if (totalComputerInfo.acePositions.length > 0) {
  //       // if there are aces, subtract 11 points from the user and add 1, pop an ace from the acePositions
  //       setTotalComputerInfo((prevState) => ({
  //         ...prevState,
  //         total: prevState.total - 11 + 1,
  //         acePositions: prevState.acePositions.slice(0, -1),
  //       }));
  //     } else {
  //       // if not the computer automatically loses
  //       setDidPlayerWin(true);
  //     }
  //   } else if (didPlayerStand) {
  //     // if the player did stand and there is a tie OR the users cards total less than the computers cards, the computer wins
  //     if (
  //       totalPlayerInfo.total === totalComputerInfo.total ||
  //       totalPlayerInfo.total < totalComputerInfo.total
  //     ) {
  //       setDidPlayerWin(false);
  //     }

  //     // if the player has more points than the computer, the pplayer wins
  //     if (totalPlayerInfo.total > totalComputerInfo.total) {
  //       setDidPlayerWin(true);
  //     } else {
  //       // if the player and computer tie or the player has few points than the computer, the player loses
  //       setDidPlayerWin(false);
  //     }
  //   }
  // }, [
  //   didPlayerStand,
  //   setDidPlayerWin,
  //   setTotalComputerInfo,
  //   setTotalPlayerInfo,
  //   totalComputerInfo.acePositions.length,
  //   totalComputerInfo.total,
  //   totalPlayerInfo.acePositions.length,
  //   totalPlayerInfo.total,
  // ]);

  const winLoseText =
    didPlayerWin === null ? (
      <></>
    ) : (
      <div>{didPlayerWin ? "You Won" : "You Lose"}</div>
    );

  return winLoseText;
}

export default GameResults;
