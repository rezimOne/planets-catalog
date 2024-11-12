export interface ResponseData {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
  id?: string;
}

export interface Planets {
  count: number;
  planets: Planet[];
}

type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: keyof Planet;
  order: SortOrder;
}
