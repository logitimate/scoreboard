export interface UserPicks {
  picks: Array<PickData>;
  name: string;
  wins?: number;
  losses?: number;
  differences?: number;
}


export interface PickData {
  pick: string;
  bowl: string;
  win: boolean;
  loss: boolean;
}
