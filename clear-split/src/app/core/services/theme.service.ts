import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'clearSplit_theme';

  constructor() {
    //this.loadTheme();
    this.setDarkMode(); // TODO remove this, and implement a toggle in the UI
  }

  private setDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('clearSplit_theme', 'dark');
  }

  toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  private loadTheme() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
}