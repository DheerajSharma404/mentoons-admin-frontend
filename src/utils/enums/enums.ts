export enum AgeCategory {
  CHILD = "6-12",
  TEEN = "13-16",
  YOUNG_ADULT = "17-19",
  ADULT = "20+",
}

export enum ProductType {
  COMIC = "comic",
  AUDIO_COMIC = "audio comic",
  PODCAST = "podcast",
  WORKSHOP = "workshop",
  ASSESSMENT = "assessment",
  MERCHANDISE = "merchandise",
  MENTOONS_CARDS = "mentoons cards",
  MENTOONS_BOOKS = "mentoons books",
}

export type AgeCategoryType = keyof typeof AgeCategory;
export type ProductTypeType = keyof typeof ProductType;
