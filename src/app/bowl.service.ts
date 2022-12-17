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
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1e0rZAfFB4Yf9Bc16gcNMWoYcHaJhNJUA0BEyB2P1hrw/values:batchGet?key=AIzaSyA2NSMKGqhbsWlaD9-TIUtu-3viusGQxFE&ranges=A1:AT14`)
      .pipe(
        map((sheetData: any) => this.formatCells(sheetData.valueRanges[0].values))
      );
  }

  formatCells(cells: string[][]): Array<UserPicks> {
    cells[0].splice(0, 2);
    const bowlGames = cells[0];
    return cells.reduce((userList: Array<UserPicks>, row, index) => {
      if (index <= 0) {
        return userList;
      }
      
      const name = row[0];
      row.splice(0, 2);
      row = row.filter(r => r !== '');
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
