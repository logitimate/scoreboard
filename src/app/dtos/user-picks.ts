export class UserPicks {
  picks: Array<PickData> = [];
  name: string;
  row: number;
  wins = 0;
  losses = 0;
  differences = 0;

  constructor(data) {
    this.name = data.name;
    this.row = data.row;
  }
}


export interface PickData {
  col: number;
  pick: string;
  bowl: string;
  win: boolean;
  loss: boolean;
}
