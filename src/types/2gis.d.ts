// Типы для 2GIS Map SDK v1.65.0
declare module '@2gis/mapgl' {
  export interface MapOptions {
    center: [number, number]
    zoom: number
    key: string
    appId?: string
  }

  export interface MarkerOptions {
    coordinates: [number, number]
    icon?: HTMLElement | string
    title?: string
  }

  export class MapGL {
    constructor(container: string | HTMLElement, options: MapOptions)
    on(event: string, callback: Function): void
    off(event: string, callback: Function): void
    destroy(): void
    getCenter(): { lng: number; lat: number }
    getZoom(): number
  }

  export class Marker {
    constructor(map: MapGL, options: MarkerOptions)
    on(event: string, callback: Function): void
    off(event: string, callback: Function): void
    destroy(): void
  }

  // Экспорт для обратной совместимости
  export { MapGL as Map }
}
