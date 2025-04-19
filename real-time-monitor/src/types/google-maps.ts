
/// <reference types="@googlemaps/js-api-loader" />

declare global {
  interface Window {
    google: any; // Using 'any' type since we can't reference google directly
  }
}

export {};
