import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UserPicks} from './dtos/user-picks';
import {HttpClient} from '@angular/common/http';
import {isNullOrUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class BowlService {
  constructor(private http: HttpClient) {
  }

  getPicks(): Observable<Array<UserPicks>> {
    return this.http.get(`https://spreadsheets.google.com/feeds/cells/1cKx_J-bW6X98RQOeM-YwNLmItDNXaSSC77NX57prLbA/1/public/full?alt=json`)
      .pipe(map((sheetData: any) => this.formatCells(sheetData.feed.entry)));
  }

  formatCells(cells): Array<UserPicks> {
    return cells.reduce((userList: Array<UserPicks>, cell) => {
      const col = Number(cell.gs$cell.col);
      const row = Number(cell.gs$cell.row);
      if (row <= 1 || col <= 1) {
        return userList;
      }
      const user = userList.find(u => u.row === row);
      if (isNullOrUndefined(user)) {
        const name = cells.find(c => Number(c.gs$cell.row) === row && Number(c.gs$cell.col) === 2).content.$t;
        userList.push(new UserPicks({row, name}));
      } else {
        const bowl = cells.find(c => Number(c.gs$cell.row) === 1 && Number(c.gs$cell.col) === col).content.$t;
        const pick = cell.content.$t;
        const win = pick.trim().includes('(W)');
        const loss = pick.trim().includes('(L)');
        if (win) {
          user.wins = user.wins + 1;
        } else if (loss) {
          user.losses = user.losses + 1;
        }
        user.picks.push({
          bowl,
          col,
          pick,
          win,
          loss
        });
      }
      return userList;
    }, []);
  }
}
