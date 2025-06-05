import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'clearSplit_theme';

  constructor() {
    this.loadTheme();
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