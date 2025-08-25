import { useState, useEffect } from 'react';

export interface Route {
  path: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

class Router {
  private listeners: Array<(route: Route) => void> = [];
  private currentRoute: Route = { path: '/' };

  constructor() {
    // Initialize with current URL
    this.updateRoute();
    
    // Listen for browser navigation
    window.addEventListener('popstate', () => {
      this.updateRoute();
    });
  }

  private updateRoute() {
    const url = new URL(window.location.href);
    const path = url.pathname;
    const query: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    this.currentRoute = { path, query };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentRoute));
  }

  navigate(path: string, query?: Record<string, string>) {
    const url = new URL(window.location.origin + path);
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    window.history.pushState({}, '', url);
    this.updateRoute();
  }

  replace(path: string, query?: Record<string, string>) {
    const url = new URL(window.location.origin + path);
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    window.history.replaceState({}, '', url);
    this.updateRoute();
  }

  back() {
    window.history.back();
  }

  subscribe(listener: (route: Route) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  // Parse route with parameters (e.g., /article/:slug)
  matchRoute(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return { match: false, params: {} };
    }

    const params: Record<string, string> = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        // Dynamic parameter
        const paramName = patternPart.slice(1);
        params[paramName] = pathPart;
      } else if (patternPart !== pathPart) {
        // Static part doesn't match
        return { match: false, params: {} };
      }
    }

    return { match: true, params };
  }
}

const router = new Router();

export function useRouter() {
  const [route, setRoute] = useState<Route>(router.getCurrentRoute());

  useEffect(() => {
    const unsubscribe = router.subscribe(setRoute);
    return unsubscribe;
  }, []);

  return {
    route,
    navigate: router.navigate.bind(router),
    replace: router.replace.bind(router),
    back: router.back.bind(router),
    matchRoute: router.matchRoute.bind(router)
  };
}

export { router };