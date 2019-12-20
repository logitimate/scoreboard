import '@pwabuilder/pwainstall';
import {Component, HostListener, OnInit} from '@angular/core';
import {BowlService} from './bowl.service';
import {UserPicks} from './dtos/user-picks';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class AppComponent implements OnInit {
  userPicks: Array<UserPicks>;
  selectedUserPicks: UserPicks;
  loading = false;
  expandedElement: any;
  columnsToDisplay = ['name', 'wins', 'losses', 'differences'];

  @HostListener('document:visibilitychange', [])
  visibilityChange() {
    if (!document.hidden) {
      this.loadPicks();
    }
  }

  constructor(private bowlService: BowlService) {
  }

  ngOnInit(): void {
    this.loadPicks();
  }

  loadPicks() {
    this.loading = true;
    this.bowlService.getPicks().subscribe(picks => {
      this.loading = false;
      this.userPicks = picks.sort((pick1, pick2) => {
        return pick1.wins > pick2.wins ? -1 : 1;
      });
    });
  }

  selectUser(selectedUserPicks: UserPicks) {
    this.selectedUserPicks = selectedUserPicks;
    this.userPicks.forEach(up => {
      up.differences = 0;
      up.picks.forEach(p => {
        const selectedUserPick = selectedUserPicks.picks.find(suPicks => suPicks.col === p.col).pick;
        const isSameUser = selectedUserPicks.row === up.row;
        const undecidedGame = !p.win && !p.loss;
        if (p.pick === selectedUserPick && p.col <= 44 && !isSameUser && undecidedGame) {
          up.differences++;
        }
      });
    });
  }
}
