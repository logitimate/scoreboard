import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PickData, UserPicks} from './dtos/user-picks';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BowlService {
  constructor(private http: HttpClient) {
  }

  getPicks(): Observable<Array<UserPicks>> {
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1HYk8SrH1Rpqs9mV1GbEVF9z7RxisnVOrkX5jlsfa1HY/values:batchGet?key=AIzaSyBZz6fjQ2MG0S7o7_U35GREVZEO1yFUjZk&ranges=B1:AR12`)
      .pipe(
        map((sheetData: any) => this.formatCells(sheetData.valueRanges[0].values))
      );
  }

  formatCells(cells: string[][]): Array<UserPicks> {
    const bowlGames = cells[0];
    bowlGames.shift();

    return cells.reduce((userList: Array<UserPicks>, row, index) => {
      if (index <= 1) {
        return userList;
      }

      const name = row[0];
      row.shift();
      const picks = row.map((p, i) => this._generatePicks(p, bowlGames[i]));
      userList.push({
        name,
        picks,
        wins: picks.reduce((wins, pick) => {
          if (pick.win) {
            wins = wins + 1;
          }
          return wins;
        } , 0),
        losses: picks.reduce((losses, pick) => {
          if (pick.loss) {
            losses = losses + 1;
          }
          return losses;
        } , 0)
      });

      return userList;
    }, []);
  }

  private _generatePicks(pick: string, bowl: string): PickData {
    return {
      pick,
      bowl,
      win : pick.includes('(W)'),
      loss: pick.includes('(L)')
    };
  }
}
