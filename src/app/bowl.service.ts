import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PickData, UserPicks} from './dtos/user-picks';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({providedIn: 'root'})
export class BowlService {
  private http = inject(HttpClient);

  getPicks(): Observable<Array<UserPicks>> {
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/11npBIlQaH8GhotqIoL7OXMWMcWhKcJvKbRVWt5kNb68/values:batchGet?key=AIzaSyA2NSMKGqhbsWlaD9-TIUtu-3viusGQxFE&ranges=A1:AX16`)
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
      
      const name = row[1];
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
