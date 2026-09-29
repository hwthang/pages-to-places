export interface PlaceContent {
  title: string;
  description: string;
  content: string;
}

export interface PlaceReference {
  page: number;
  quote: string;
}

export interface IPlace {
  slug: string;
  name: string;
  images: any[];
  contents: PlaceContent[];
  references: PlaceReference[];
}
