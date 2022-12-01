import { ICard } from './Cards';
export interface IPlayerInfo {
    total: number;
    acePositions: number[];
    lastReadCardIndex: number;
    cards: ICard[];
}

export interface ITotalInfo {
    player: IPlayerInfo;
    computer: IPlayerInfo;
}

export type ITotalInfoKey = keyof ITotalInfo;