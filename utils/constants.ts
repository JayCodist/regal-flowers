import { otherSampleProducts } from "../pages/filters/[filter]";
import AddonGroup from "./types/AddonGroup";
import { AppCurrency } from "./types/Core";
import Product from "./types/Product";
import {
  Service,
  Occasion,
  UserReview,
  OfficeAddress,
  BlogPost
} from "./types/Regal";

export const defaultCurrency: AppCurrency = {
  name: "NGN",
  conversionRate: 1
};

export const aboutUsContent: {
  [key: string]: { title: string; content: string };
} = {
  howItBegan: {
    title: "How it Began",
    content:
      "Warning: This is not a typical About Us story, because you see, Regal Flowers started in an unusual way. It was a Sunday morning, the year was 2016, in the vibrant city of Lagos, Nigeria, and our founder, reeling from the very recent heartbreak of his relationship (Hint: She left him) was determined to get his girlfriend back.  She was traveling to Abuja, Nigeria that afternoon, and he wanted to get beautiful flowers for her so he decided to check online for flower shops in Lagos or Abuja that could deliver a bouquet of red roses and chocolates to her the same day. He searched high and low, and while he found other online flower delivery shops in Lagos and Abuja, Nigeria, he couldn’t find one that ticked all the right boxes.  The flower shops he found either didn’t look reputable enough (after all he was already heartbroken, he couldn’t afford to lose his money too, and this is Nigeria, where you have to be vigilant), or were out of stock (even though they didn’t say so on their website until he called), or they didn’t have enough options for various budgets. He finally found one that claimed to be open 24 hours on their Google Maps, and when they didn’t pick up the phone, he drove down there, only to meet it closed. Ouch. No, he eventually didn’t get her back, and No, it wasn't because he couldn't send her the red roses and chocolates. Instead, it was, as the dictionary would say, irreconcilable differences, and they remain friends, but he instead gained the passion for flowers and gifts that would eventually see him open his own online and walk-in fresh flower shop in Lagos and Abuja An online flower shop that would precisely tick all the right boxes: "
  },

  openingHour: {
    content:
      "It would be open 24 hours not only for online orders but also for walk-ins. We once had a client take us up on the offer by walking in by 3 am. He was on his way to pick up his wife at the airport and wanted to buy red roses to welcome her. He was shocked we were actually open. Regal Flowers and Gifts is also open every day of the year including weekends and public holidays (yes, Christmas, Easter, and New Year's Day too). We are badass like that ",
    title: "Always Open Online and Walk-in 24hours everyday"
  },
  reputation: {
    content:
      "The flower shop would be reputable. Once you place your order, you can completely relax. We have the highest rating  (4.97 stars on average) and the highest number of Google Reviews in Nigeria (over 1000 reviews from our 3 branches). Regal Flowers has delivered to over 10,000 people including various celebrities and 2 Nigerian Presidents. We have probably delivered roses for and to someone you know. Furthermore, the flowers are always fresh and imported into Nigeria every week from rose farms across the world. You can definitely say Regal flowers is your plug for reputable and premium fresh flowers in Nigeria.",
    title: "Reputable and Premium Fresh Flowers in Nigeria"
  },
  deliveryTime: {
    content:
      "It would offer fast and same-day delivery of flower bouquets and gifts everywhere in Lagos and Abuja. Some locations we offer delivery of fresh flowers in Lagos include Ikoyi, Victoria Island, Ikeja, Lekki Phase 1, Chevron, Lekki, Ajah, Ikate, Sangotedo, Gbagada, Yaba, Surulere, Ilupeju, Magodo, Maryland, Opebi, Ogba, Ogudu, Allen Avenue, and delivery of fresh flowers in Abuja include Wuse 2, Maitama, Central Area, Garki, Jabi, Asokoro, Gwarinpa, Jahi, Lokogoma, Apo, Life Camp, Lugbe, Dawaki, Abuja Municipal Area Council etcetera.",
    title: "Same Day Flower Delivery in Lagos and Abuja"
  },
  budget: {
    title: "Fresh Flowers For All Occasions and Budgets",
    content:
      "We stock flowers for various occasions such as Birthday Flowers, Romantic Flowers, Anniversary Flowers, Mothers’ Day Flowers, Get Well Soon Flowers, Funeral Wreaths, Condolence Flowers, Bridal Bouquets, and of course, Valentine’s Day flowers available And finally, there are suitable options for all budgets, so when you see a design you like, you can simply pick the size that suits your budget. Want to go all out too? We got you, withe our VIP Category of roses. "
  }
};

export const featuredFlowers: Product[] = [
  {
    ...otherSampleProducts,
    id: 11,
    name: "5 Peas in a pod",
    price: 6000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-1.png"
      }
    ]
  },
  {
    ...otherSampleProducts,
    id: 12,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-2.png"
      }
    ]
  },
  {
    ...otherSampleProducts,
    id: 13,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-3.png"
      }
    ]
  },
  {
    ...otherSampleProducts,
    id: 16,
    name: "5 Peas in a pod",
    price: 36000,
    details: "5 Peas in a pod",
    images: [
      {
        alt: "5 peas in a pod",
        id: 1,
        src: "/images/sample-flowers/sample-4.png"
      }
    ]
  }
];

export const regalFeatures: Service[] = [
  {
    image: "/images/truck.png",
    title: "Same Day Delivery",
    subtitle: "In Lagos & Abuja, Nigeria"
  },
  {
    image: "/images/headset.png",
    title: "Order Online or Walk-in 24/7",
    subtitle: "Weekends and public holidays too"
  },
  {
    image: "/images/shield.png",
    title: "Various Payment Options",
    subtitle: "Change site to USD for PayPal/Bitcoin"
  }
];

// TODO: use dynamic urls
export const regalOccasions: Occasion[] = [
  {
    title: "Love, Birthdays & Anniversary",
    url: "/filters/occasions",
    image: "/images/occasions-love-bday.png"
  },
  {
    title: "Just to say Hi, Sorry, Thank You",
    url: "/filters/occasions",
    image: "/images/occasions-sorry-thanks.png"
  },
  {
    title: "Bridal Flowers",
    url: "/filters/occasions",
    image: "/images/occasions-bridal.png"
  }
];

export const sampleReviews: UserReview[] = [
  {
    text: "Regal flowers is the best among the best. I totally loved it!!",
    date: "24 May, 2022",
    rating: 5,
    user: {
      name: "Juliet",
      avatar: "/images/review-user.png"
    }
  },
  {
    text: "The delivery was on time and the courier was courteous and neat",
    date: "17 June, 2022",
    rating: 5,
    user: {
      name: "Emeka",
      avatar: "/images/review-user.png"
    }
  },
  {
    text: "I liked the 5 peas in a pod. I totally recommend their bouquets",
    date: "20 January, 2022",
    rating: 4,
    user: {
      name: "Sandra",
      avatar: "/images/review-user.png"
    }
  },
  {
    text:
      "Great arrangement and packaging and was punctual too. Very professional work",
    date: "6 April, 2022",
    rating: 5,
    user: {
      name: "Adebayo",
      avatar: "/images/review-user.png"
    }
  }
];

export const regalReasons: Service[] = [
  {
    image: "/images/mixer.png",
    title: "Premium Fresh Flowers",
    subtitle:
      "We stock only the very best fresh flowers, and arrange them withe care. Don't forget to add your free personalized message too."
  },
  {
    image: "/images/bulb.png",
    title: "Affordable Prices",
    subtitle:
      "Whether you want to go all out, or you want something affordable, we have flowers and gifts for you"
  },
  {
    image: "/images/rocket.png",
    title: "Swift Delivery",
    subtitle:
      "We are the most reliable flower shop in Lagos, Nigeria and provide same day delivery in Lagos,  Nigeria"
  }
];

export const featuredAddons: AddonGroup[] = [
  {
    name: "Cakes and Cupcakes",
    description: "Cakes and cupcakes are a great choice",
    image: "/images/sample-flowers/addon-group-1.png",
    slug: "#",
    addons: []
  },
  {
    name: "Chocolates and Biscuits",
    description: "What are flowers without chocolate?",
    image: "/images/sample-flowers/addon-group-2.png",
    slug: "#",
    addons: []
  },
  {
    name: "Teddy Bears",
    description: "Various sizes of teddies, even Life Size",
    image: "/images/sample-flowers/addon-group-3.png",
    slug: "#",
    addons: []
  },
  {
    name: "Giftsets",
    description: "Caravaggio Italian Giftsets are the ultimate luxury",
    image: "/images/sample-flowers/addon-group-4.png",
    slug: "#",
    addons: []
  }
];

export const regalHowItWorks: Service[] = [
  {
    image: "/images/bulb.png",
    title: "See what you like? Contact us",
    subtitle:
      "Visit our Website, Call, Whatsapp, or Walk into any of our stores (The Ikoyi and Abuja stores are open 24 hours every day while the Silverbird Galleria, Victoria Island is open till 7 pm every day)"
  },
  {
    image: "/images/payment.png",
    title: "Make payment",
    subtitle:
      "Make payment for your flowers online via card, Bank Transfer, PayPal, or even Bitcoin (yes, we accept Bitcoin)"
  },
  {
    image: "/images/rocket.png",
    title: "Wait by the phone for that call",
    subtitle:
      "Relax and wait for the recipient to thank you withe a smile once we deliver."
  }
];

export const regalAddresses: OfficeAddress[] = [
  {
    name: "Lagos Head Office/Delivery Center",
    location: "81b, Lafiaji Way, Dolphin Estate, Ikoyi, Lagos",
    workingTimes: "24/7"
  },
  {
    name: "Lagos VI Branch",
    location:
      "133, Ahmadu Bello Way, Silverbird Galleria, Victoria Island, Lagos",
    workingTimes: "8am-7pm (Everyday)"
  },
  {
    name: "Abuja Office",
    location: "5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja",
    workingTimes: "24/7"
  }
];

export const regalEmail = "info@regalflowers.com.ng";

export const regalPhones = [
  "(+234) 7010 006665",
  "(+234) 7010 006664",
  "(+234) 7011 992888"
];

export const blogPosts: BlogPost[] = [
  {
    title: "5 awesome methods of receiving payment in your store",
    excerpt:
      "Most of us wonder if there is a God and if He really is the God of the Bible. In the Bible of a there is a God  the God of the Bible. In the Bible of a there is a God, then He must like flowers, because, what's there not to like?",
    date: "7 May, 2022",
    readDuration: "6 mins read",
    image: "/images/sample-flowers/blog-1.png"
  },
  {
    title: "Why everyone buys lillies in November",
    excerpt:
      "Most of us wonder if there is a God and if He really is the God of the Bible. In the Bible of a there is a God  the God of the Bible.",
    date: "25 Apr, 2022",
    readDuration: "10 mins read",
    image: "/images/sample-flowers/blog-2.png"
  },
  {
    title: "So we hit the 2 million users milestone",
    excerpt:
      "Most of us wonder if there is a God and if He really is the God of the Bible. In the Bible of a there is a God  the God of the Bible. In the Bible of a there is a God, then He must like flowers, because, what's there not to like?",
    date: "18 Mar, 2022",
    readDuration: "2 mins read",
    image: "/images/sample-flowers/blog-1.png"
  }
];
