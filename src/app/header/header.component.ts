import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html'

})
export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated = false;
  private authListnerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnDestroy(): void {
    this.authListnerSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.authListnerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }
}
