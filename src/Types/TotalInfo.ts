export interface IPlayerInfo {
    total: number;
    acePositions: number[];
    lastReadCardIndex: number;
}

export interface ITotalInfo {
    player: IPlayerInfo;
    computer: IPlayerInfo;
}

export type ITotalInfoKey = keyof ITotalInfo;