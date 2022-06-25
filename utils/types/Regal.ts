export interface Service {
  title: string;
  subtitle: string;
  image: string;
}

export interface Occasion {
  title: string;
  image: string;
  url: string;
}

export interface UserReview {
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  user: {
    avatar: string;
    name: string;
  };
}

export interface OfficeAddress {
  name: string;
  location: string;
  workingTimes: string;
}

export interface BlogPosts {
  date: string;
  readDuration: string;
  title: string;
  excerpt: string;
}
