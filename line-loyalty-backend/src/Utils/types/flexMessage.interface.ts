export type ButtonOption = {
  label: string;
  postbackData: string;
};

export interface WebsiteCard {
  title: string;
  imageUrl: string;
  location: string;
  url: string; // New field for the link
}

export interface PostbackCard {
  title: string;
  imageUrl: string;
  location: string;
  postbackData: string; // New field for the link
}