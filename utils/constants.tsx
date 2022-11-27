import React from "react";
import { Option } from "../components/select/Select";
import AddonGroup from "./types/AddonGroup";
import { AppCurrency, AppLink } from "./types/Core";
import { PaymentMethod } from "./types/Order";
import {
  Service,
  Occasion,
  UserReview,
  OfficeAddress,
  BlogPost
} from "./types/Regal";

export const defaultCurrency: AppCurrency = {
  name: "NGN",
  conversionRate: 1,
  sign: "₦"
};

export const currencyOptions: AppCurrency[] = [
  { ...defaultCurrency },
  { name: "USD", conversionRate: 415, sign: "$" },
  { name: "GBP", conversionRate: 523, sign: "£" }
];

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

export const otherSampleProducts = {
  id: 1,
  name: "A Kiss of Rose",
  addonsGroups: [
    {
      name: "Perfumes",
      image: "/images/addons/Rectangle133.png",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    },
    {
      name: "Teady Bears",
      image: "/images/addons/Rectangle133.png",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    }
  ],
  featured: true,
  images: [
    { alt: "flower1", src: "/images/product-image/flower1.png", id: 1 },
    { alt: "flower2", src: "/images/addons/Rectangle131.png", id: 2 },
    { alt: "flower3", src: "/images/flower.png", id: 3 },
    { alt: "flower4", src: "/images/product-image/flower1.png", id: 4 }
  ],
  price: 70000,
  salePrice: 80000,
  sku: "u2i2093092",
  slug: "belleza-regal-two-colors-rose-red-yellow-white-pink-orange",
  type: "variable",
  variants: [
    { name: "Small (15 Roses)", price: 75000, class: "regular" },
    { name: "Medium (20 Roses)", price: 90000, class: "vip" }
  ],
  productDescription:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
  title: "A Kiss of Rose",
  sizes: [
    "Entry (5 roses)",
    "Extra Small (10 roses)",
    "Small (15 roses)",
    "Medium (20 roses)",
    "Standard (24cm box)",
    "Standard Plus (27cm box)",
    "Standard Premium (30cm box)",
    "VIP Entry",
    "VIP Medium",
    "VIP Standard",
    "VIP Standard Premium",
    "VIP Large"
  ],
  designOptions: ["wrappedBouquet", "invase", "inLargeVase", "box"],
  note:
    "Single stem rose only available for pickup, except as part of larger order.",
  description:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors."
};

export const featuredFlowers = [
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
    url: "/filters",
    image: "/images/occasions-love-bday.png"
  },
  {
    title: "Just to say Hi, Sorry, Thank You",
    url: "/filters",
    image: "/images/occasions-sorry-thanks.png"
  },
  {
    title: "Bridal Flowers",
    url: "/filters",
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

export const deliveryStates: Option[] = [
  {
    label: "Lagos",
    value: "lagos"
  },
  {
    label: "Abuja",
    value: "abuja"
  },
  {
    label: "Port Harcourt",
    value: "port-harcourt"
  },
  {
    label: "Anambra",
    value: "anambra"
  },
  {
    label: "Adamawa",
    value: "adamawa"
  },
  {
    label: "Abia",
    value: "abia"
  },
  {
    label: "Akwa Ibom",
    value: "akwa-ibom"
  },
  {
    label: "Borno",
    value: "borno"
  },
  {
    label: "Bauchi",
    value: "bauchi"
  },
  {
    label: "Benue",
    value: "benue"
  },
  {
    label: "Bayelsa",
    value: "bayelsa"
  },
  {
    label: "Cross River",
    value: "cross-river"
  },
  {
    label: "Delta",
    value: "delta"
  },
  {
    label: "Enugu",
    value: "enugu"
  },
  {
    label: "Edo",
    value: "edo"
  },
  {
    label: "Ekiti",
    value: "ekiti"
  },
  {
    label: "Ebonyi",
    value: "ebonyi"
  },
  {
    label: "Gombe",
    value: "gombe"
  },
  {
    label: "Imo",
    value: "imo"
  },
  {
    label: "Jigawa",
    value: "jigawa"
  },
  {
    label: "Kebbi",
    value: "kebbi"
  },
  {
    label: "Kano",
    value: "kano"
  },
  {
    label: "Kaduna",
    value: "kaduna"
  },
  {
    label: "Katsina",
    value: "katsina"
  },
  {
    label: "Kwara",
    value: "kwara"
  },
  {
    label: "Kogi",
    value: "kogi"
  },
  {
    label: "Niger",
    value: "niger"
  },
  {
    label: "Nasarawa",
    value: "nasarawa"
  },
  {
    label: "Oyo",
    value: "oyo"
  },

  {
    label: "Ogun",
    value: "ogun"
  },
  {
    label: "Osun",
    value: "osun"
  },

  {
    label: "Ondo",
    value: "ondo"
  },

  {
    label: "Plateau",
    value: "plateau"
  },
  {
    label: "Rivers",
    value: "rivers"
  },
  {
    label: "Sokoto",
    value: "sokoto"
  },
  {
    label: "Taraba",
    value: "taraba"
  },
  {
    label: "Yobe",
    value: "yobe"
  },

  {
    label: "Zamfara",
    value: "zamfara"
  }
];

export const paymentMethod: PaymentMethod[] = [
  {
    title: "Pay with Paystack",
    paymentName: "paystack",
    icon: (
      <svg
        width="13"
        height="19"
        viewBox="0 0 13 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="generic-icon large"
      >
        <path
          d="M11.1835 0H0.654771C0.301195 0 0 0.447668 0 0.992655V2.76386C0 3.30884 0.301195 3.75651 0.654771 3.75651H11.1835C11.5502 3.75651 11.8383 3.30884 11.8514 2.76386V1.01212C11.8514 0.447667 11.5502 0 11.1835 0ZM11.1835 9.82922H0.654771C0.484531 9.82922 0.31429 9.92654 0.196431 10.1212C0.0654771 10.3158 0 10.5494 0 10.8219V12.5931C0 13.1381 0.301195 13.5857 0.654771 13.5857H11.1835C11.5502 13.5857 11.8383 13.1575 11.8514 12.5931V10.8219C11.8383 10.2574 11.5502 9.82922 11.1835 9.82922ZM6.587 14.7341H0.654771C0.484531 14.7341 0.31429 14.8314 0.196431 15.026C0.0785726 15.2207 0 15.4543 0 15.7267V17.498C0 18.0429 0.301195 18.4906 0.654771 18.4906H6.5739C6.94058 18.4906 7.22867 18.0429 7.22867 17.5174V15.7462C7.24177 15.1623 6.95367 14.7146 6.587 14.7341ZM11.8514 4.90488H0.654771C0.484531 4.90488 0.31429 5.00219 0.196431 5.19683C0.0785726 5.39147 0 5.62504 0 5.89753V7.66874C0 8.21372 0.301195 8.66139 0.654771 8.66139H11.8383C12.2049 8.66139 12.493 8.21372 12.493 7.66874V5.89753C12.5061 5.35254 12.2049 4.92434 11.8514 4.90488Z"
          fill="#00C3F7"
        />
      </svg>
    ),
    info: "You will be redirected to Paystack to complete your payment",
    other: [
      {
        icon: (
          <svg
            width="74"
            height="32"
            viewBox="0 0 74 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="generic-icon small"
          >
            <g clipPath="url(#clip0_1186_55307)">
              <path
                d="M33.2411 26.0464H28.1136L31.3182 6.35191H36.4463L33.2411 26.0464ZM23.8001 6.35191L18.9117 19.8979L18.3333 16.9809L18.3338 16.982L16.6085 8.12518C16.6085 8.12518 16.3999 6.35191 14.1762 6.35191H6.09483L6 6.68539C6 6.68539 8.47129 7.19956 11.3635 8.93647L15.8183 26.0469H21.1607L29.3185 6.35191H23.8001ZM64.1304 26.0464H68.8386L64.7337 6.35139H60.6118C58.7085 6.35139 58.2449 7.81909 58.2449 7.81909L50.5976 26.0464H55.9427L57.0116 23.121H63.5299L64.1304 26.0464ZM58.4883 19.0798L61.1824 11.7096L62.698 19.0798H58.4883ZM50.9985 11.088L51.7303 6.85871C51.7303 6.85871 49.4723 6 47.1185 6C44.574 6 38.5314 7.11211 38.5314 12.5199C38.5314 17.6079 45.6234 17.6711 45.6234 20.3436C45.6234 23.0162 39.2621 22.5373 37.1627 20.852L36.4004 25.2741C36.4004 25.2741 38.69 26.3862 42.188 26.3862C45.6871 26.3862 50.9658 24.5745 50.9658 19.6435C50.9658 14.5228 43.8101 14.0461 43.8101 11.8197C43.8106 9.59288 48.8043 9.87894 50.9985 11.088Z"
                fill="#2566AF"
              />
              <path
                d="M17.9158 16.5141L16.1905 7.65729C16.1905 7.65729 15.9819 5.88403 13.7582 5.88403H5.67686L5.58203 6.21751C5.58203 6.21751 9.46624 7.02248 13.1919 10.0385C16.7542 12.9212 17.9158 16.5141 17.9158 16.5141Z"
                fill="#E6A540"
              />
            </g>
            <defs>
              <clipPath id="clip0_1186_55307">
                <rect width="74" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )
      },
      {
        icon: (
          <svg
            width="42"
            height="32"
            viewBox="0 0 42 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="generic-icon small"
          >
            <g clipPath="url(#clip0_1186_55308)">
              <path
                d="M41.1734 30.8948V30.9788H41.2517C41.2664 30.9791 41.2809 30.9754 41.2937 30.9681C41.2988 30.9645 41.303 30.9597 41.3057 30.9541C41.3085 30.9485 41.3098 30.9423 41.3095 30.936C41.3098 30.9299 41.3084 30.9238 41.3057 30.9183C41.3029 30.9128 41.2988 30.9082 41.2937 30.9047C41.2811 30.8971 41.2665 30.8934 41.2517 30.894H41.1734V30.8948ZM41.2526 30.8354C41.2862 30.8334 41.3194 30.843 41.3467 30.8627C41.3576 30.8717 41.3663 30.8831 41.372 30.896C41.3777 30.9089 41.3803 30.9229 41.3796 30.9371C41.3801 30.9492 41.378 30.9613 41.3735 30.9726C41.3689 30.9838 41.362 30.994 41.3532 31.0024C41.3321 31.0206 41.3058 31.0316 41.278 31.0337L41.383 31.1534H41.3021L41.2055 31.0345H41.1743V31.1534H41.1066V30.8356H41.2536L41.2526 30.8354ZM41.2316 31.263C41.267 31.2633 41.3022 31.2562 41.3347 31.242C41.366 31.2285 41.3945 31.2092 41.4187 31.1851C41.4429 31.161 41.4622 31.1325 41.4756 31.1011C41.5032 31.0345 41.5032 30.9597 41.4756 30.8932C41.462 30.8619 41.4427 30.8334 41.4187 30.8092C41.3945 30.7851 41.366 30.7658 41.3347 30.7523C41.302 30.7388 41.2669 30.7321 41.2316 30.7325C41.1956 30.7322 41.16 30.7389 41.1266 30.7523C41.0945 30.7655 41.0654 30.7848 41.0407 30.8092C41.0035 30.8473 40.9784 30.8955 40.9685 30.9477C40.9585 31 40.9641 31.0541 40.9846 31.1032C40.9974 31.1347 41.0165 31.1633 41.0407 31.1872C41.0654 31.2115 41.0946 31.2308 41.1266 31.2441C41.1598 31.2582 41.1955 31.2654 41.2316 31.2651V31.263ZM41.2316 30.6561C41.3239 30.656 41.4125 30.6922 41.4783 30.7569C41.5101 30.7879 41.5353 30.825 41.5527 30.8659C41.5706 30.9078 41.5799 30.953 41.5799 30.9987C41.5799 31.0443 41.5706 31.0895 41.5527 31.1315C41.5349 31.1722 41.5097 31.2091 41.4783 31.2405C41.4461 31.2714 41.4086 31.2963 41.3677 31.314C41.3246 31.3323 41.2783 31.3416 41.2316 31.3413C41.1843 31.3416 41.1374 31.3324 41.0938 31.314C41.0524 31.2967 41.0145 31.2718 40.9823 31.2405C40.9509 31.208 40.9261 31.1698 40.909 31.1279C40.8911 31.086 40.8818 31.0408 40.8818 30.9951C40.8818 30.9495 40.8911 30.9043 40.909 30.8623C40.9264 30.8214 40.9516 30.7844 40.9834 30.7533C41.0152 30.7215 41.0531 30.6965 41.0949 30.6798C41.1385 30.6615 41.1853 30.6522 41.2326 30.6525L41.2316 30.6561ZM9.07638 29.429C9.07638 28.8232 9.47328 28.3255 10.122 28.3255C10.7419 28.3255 11.1602 28.8018 11.1602 29.429C11.1602 30.0563 10.7419 30.5326 10.122 30.5326C9.47328 30.5326 9.07638 30.0349 9.07638 29.429ZM11.8669 29.429V27.7049H11.1174V28.1249C10.8797 27.8146 10.5191 27.6199 10.0287 27.6199C9.06273 27.6199 8.30463 28.3776 8.30463 29.4299C8.30463 30.4822 9.06231 31.2399 10.0287 31.2399C10.5189 31.2399 10.8797 31.045 11.1174 30.7348V31.1534H11.866V29.429H11.8669ZM37.1912 29.429C37.1912 28.8232 37.5881 28.3255 38.237 28.3255C38.8575 28.3255 39.2752 28.8018 39.2752 29.429C39.2752 30.0563 38.8575 30.5326 38.237 30.5326C37.5883 30.5326 37.1912 30.0349 37.1912 29.429ZM39.9825 29.429V26.321H39.2324V28.1249C38.9947 27.8146 38.6341 27.6199 38.1437 27.6199C37.1777 27.6199 36.4196 28.3776 36.4196 29.4299C36.4196 30.4822 37.1773 31.2399 38.1437 31.2399C38.6341 31.2399 38.9947 31.045 39.2324 30.7348V31.1534H39.9825V29.429ZM21.169 28.29C21.652 28.29 21.9622 28.5928 22.0414 29.126H20.253C20.333 28.6283 20.6352 28.29 21.1692 28.29H21.169ZM21.1841 27.618C20.174 27.618 19.4674 28.353 19.4674 29.428C19.4674 30.524 20.2024 31.238 21.2343 31.238C21.7535 31.238 22.2289 31.1084 22.6472 30.755L22.2799 30.1995C21.991 30.4305 21.623 30.5601 21.2772 30.5601C20.7942 30.5601 20.3544 30.3365 20.2463 29.7159H22.8056C22.8129 29.6227 22.8205 29.5286 22.8205 29.4278C22.8129 28.3532 22.1485 27.6178 21.1837 27.6178L21.1841 27.618ZM30.2326 29.4278C30.2326 28.8219 30.6295 28.3242 31.2782 28.3242C31.8981 28.3242 32.3165 28.8005 32.3165 29.4278C32.3165 30.0551 31.8981 30.5313 31.2782 30.5313C30.6295 30.5313 30.2324 30.0336 30.2324 29.4278H30.2326ZM33.0229 29.4278V27.7049H32.2738V28.1249C32.0353 27.8146 31.6755 27.6199 31.1852 27.6199C30.2192 27.6199 29.4611 28.3776 29.4611 29.4299C29.4611 30.4822 30.2188 31.2399 31.1852 31.2399C31.6755 31.2399 32.0353 31.045 32.2738 30.7348V31.1534H33.0231V29.429L33.0229 29.4278ZM26.0001 29.4278C26.0001 30.4734 26.7279 31.2378 27.8388 31.2378C28.358 31.2378 28.7038 31.1223 29.0778 30.8268L28.7179 30.221C28.4365 30.4232 28.141 30.5313 27.8149 30.5313C27.2166 30.524 26.7766 30.0914 26.7766 29.4278C26.7766 28.7642 27.2166 28.3318 27.8149 28.3242C28.1402 28.3242 28.4356 28.4324 28.7179 28.6346L29.0778 28.0288C28.7032 27.7333 28.3573 27.6178 27.8388 27.6178C26.7279 27.6178 26.0001 28.382 26.0001 29.4278ZM35.6622 27.6178C35.2298 27.6178 34.9482 27.82 34.7535 28.1228V27.7049H34.0107V31.1515H34.7611V29.2195C34.7611 28.6491 35.0061 28.3322 35.4961 28.3322C35.6565 28.3299 35.8158 28.3594 35.9648 28.4189L36.1958 27.7125C36.0299 27.6472 35.8136 27.6184 35.6618 27.6184L35.6622 27.6178ZM15.5723 27.979C15.2117 27.7413 14.7149 27.6184 14.1668 27.6184C13.2936 27.6184 12.7314 28.037 12.7314 28.7218C12.7314 29.2837 13.15 29.6304 13.9207 29.7386L14.2747 29.789C14.6857 29.8467 14.8797 29.9549 14.8797 30.1496C14.8797 30.416 14.6067 30.5681 14.0941 30.5681C13.575 30.5681 13.2004 30.4022 12.9477 30.2075L12.5956 30.7919C13.0065 31.0948 13.5257 31.2392 14.0878 31.2392C15.0832 31.2392 15.6601 30.7705 15.6601 30.1143C15.6601 29.5084 15.2061 29.1915 14.456 29.0834L14.1027 29.0321C13.7783 28.9901 13.5183 28.9248 13.5183 28.6938C13.5183 28.4418 13.7634 28.2902 14.1746 28.2902C14.6145 28.2902 15.0404 28.4561 15.2491 28.5857L15.5736 27.9798L15.5723 27.979ZM25.243 27.6191C24.8106 27.6191 24.529 27.8213 24.3352 28.1241V27.7049H23.5924V31.1515H24.3419V29.2195C24.3419 28.6491 24.587 28.3322 25.0769 28.3322C25.2373 28.3299 25.3967 28.3594 25.5456 28.4189L25.7766 27.7125C25.6107 27.6472 25.3944 27.6184 25.2426 27.6184L25.243 27.6191ZM18.8473 27.7049H17.6217V26.6594H16.864V27.7049H16.1649V28.39H16.864V29.9622C16.864 30.7619 17.1744 31.2382 18.061 31.2382C18.3863 31.2382 18.761 31.1374 18.9987 30.9717L18.7822 30.3299C18.5585 30.4595 18.3134 30.5248 18.1186 30.5248C17.7439 30.5248 17.6217 30.2938 17.6217 29.948V28.3906H18.8473V27.7049ZM7.64187 31.1523V28.9893C7.64187 28.1747 7.12275 27.6266 6.2859 27.6193C5.84595 27.6119 5.39214 27.7488 5.07441 28.2325C4.83669 27.8503 4.46205 27.6193 3.93537 27.6193C3.56724 27.6193 3.20751 27.7274 2.9259 28.131V27.7049H2.17578V31.1515H2.93178V29.2405C2.93178 28.6422 3.26358 28.3242 3.77598 28.3242C4.27368 28.3242 4.52547 28.6487 4.52547 29.2329V31.151H5.28315V29.24C5.28315 28.6418 5.62902 28.3238 6.12651 28.3238C6.63828 28.3238 6.88251 28.6483 6.88251 29.2325V31.1506L7.64187 31.1523Z"
                fill="#231F20"
              />
              <path
                d="M41.5997 20.6876V20.1836H41.4685L41.3167 20.5295L41.1657 20.1836H41.034V20.6876H41.1272V20.3079L41.2692 20.6355H41.3658L41.5078 20.3071V20.6876H41.6002H41.5997ZM40.7671 20.6876V20.2699H40.9351V20.1849H40.5059V20.2699H40.6739V20.6876H40.7663H40.7671Z"
                fill="#F79410"
              />
              <path
                d="M26.6823 22.849H15.3242V2.43701H26.6825L26.6823 22.849Z"
                fill="#FF5F00"
              />
              <path
                d="M16.044 12.6434C16.044 8.50288 17.9827 4.81444 21.0017 2.43745C18.7165 0.635538 15.89 -0.342421 12.9799 -0.338121C5.81112 -0.338121 0 5.47384 0 12.6434C0 19.8131 5.81112 25.625 12.9799 25.625C15.8901 25.6294 18.7166 24.6514 21.0019 22.8495C17.9831 20.4729 16.044 16.7842 16.044 12.6434Z"
                fill="#EB001B"
              />
              <path
                d="M42.0049 12.6434C42.0049 19.8131 36.1938 25.625 29.025 25.625C26.1145 25.6293 23.2876 24.6514 21.002 22.8495C24.0218 20.4725 25.9605 16.7842 25.9605 12.6434C25.9605 8.50267 24.0218 4.81444 21.002 2.43745C23.2876 0.635592 26.1143 -0.342345 29.0248 -0.338121C36.1936 -0.338121 42.0047 5.47384 42.0047 12.6434"
                fill="#F79E1B"
              />
            </g>
            <defs>
              <clipPath id="clip0_1186_55308">
                <rect width="42" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )
      }
    ]
  },
  {
    title: "PayPal",
    paymentName: "payPal",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="generic-icon large"
      >
        <path
          d="M26.0726 12.6507C26.234 13.4014 26.214 14.312 26.0193 15.3854C25.2433 19.356 22.7166 21.34 18.442 21.34H17.8526C17.6286 21.34 17.434 21.4147 17.2606 21.5614C17.0926 21.708 16.9833 21.8987 16.942 22.1307L16.8873 22.3827L16.15 27.0214L16.122 27.2227C16.078 27.456 15.9686 27.644 15.7926 27.7907C15.6193 27.9387 15.422 28.012 15.1966 28.012H11.8326C11.6433 28.012 11.4966 27.9467 11.3913 27.812C11.2846 27.676 11.2446 27.5174 11.2713 27.328C11.3526 26.8307 11.4686 26.0774 11.6273 25.076C11.7833 24.076 11.902 23.324 11.9833 22.824C12.0646 22.324 12.1833 21.5734 12.346 20.5774C12.5073 19.58 12.6286 18.8307 12.7073 18.3307C12.7513 18 12.946 17.836 13.2846 17.836H15.0393C16.23 17.8534 17.282 17.76 18.206 17.5547C19.7686 17.2054 21.0513 16.5627 22.054 15.6227C22.9673 14.7734 23.658 13.6734 24.134 12.3254C24.35 11.6987 24.5033 11.1027 24.6033 10.5414C24.6113 10.4867 24.622 10.4534 24.6366 10.4427C24.6473 10.428 24.666 10.424 24.6833 10.428C24.6993 10.4334 24.726 10.4494 24.766 10.4747C25.4646 11.0054 25.9046 11.7294 26.0726 12.6507ZM23.7686 8.86937C23.7686 9.82537 23.5633 10.88 23.1486 12.0347C22.4326 14.1174 21.086 15.5254 19.0993 16.2587C18.0886 16.6174 16.9633 16.8027 15.7193 16.8254C15.7193 16.8334 15.318 16.8347 14.514 16.8347L13.31 16.8254C12.414 16.8254 11.8873 17.252 11.7273 18.1107C11.71 18.1814 11.33 20.5507 10.5873 25.216C10.5766 25.304 10.5233 25.352 10.426 25.352H6.47264C6.2753 25.352 6.1113 25.2787 5.98064 25.132C5.84997 24.9827 5.80063 24.8107 5.8273 24.612L8.93663 4.88537C8.9793 4.62537 9.1033 4.41337 9.30463 4.24137C9.50597 4.07204 9.73797 3.98804 9.99663 3.98804H18.0153C18.3193 3.98804 18.7553 4.0467 19.3206 4.1627C19.8913 4.2747 20.3886 4.42137 20.818 4.5907C21.7753 4.95604 22.506 5.50804 23.0113 6.24004C23.5166 6.97604 23.7686 7.84937 23.7686 8.86937Z"
          fill="#1C6DD0"
        />
      </svg>
    ),
    info:
      "You will be redirected to the PayPal website after submitting your order"
  },
  {
    title: "GooglePay",
    paymentName: "googlePay",
    info: "Use your GooglePay saved payment methods",
    icon: (
      <svg
        width="13"
        height="19"
        viewBox="0 0 13 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="generic-icon large"
      >
        <path
          d="M11.1835 0H0.654771C0.301195 0 0 0.447668 0 0.992655V2.76386C0 3.30884 0.301195 3.75651 0.654771 3.75651H11.1835C11.5502 3.75651 11.8383 3.30884 11.8514 2.76386V1.01212C11.8514 0.447667 11.5502 0 11.1835 0ZM11.1835 9.82922H0.654771C0.484531 9.82922 0.31429 9.92654 0.196431 10.1212C0.0654771 10.3158 0 10.5494 0 10.8219V12.5931C0 13.1381 0.301195 13.5857 0.654771 13.5857H11.1835C11.5502 13.5857 11.8383 13.1575 11.8514 12.5931V10.8219C11.8383 10.2574 11.5502 9.82922 11.1835 9.82922ZM6.587 14.7341H0.654771C0.484531 14.7341 0.31429 14.8314 0.196431 15.026C0.0785726 15.2207 0 15.4543 0 15.7267V17.498C0 18.0429 0.301195 18.4906 0.654771 18.4906H6.5739C6.94058 18.4906 7.22867 18.0429 7.22867 17.5174V15.7462C7.24177 15.1623 6.95367 14.7146 6.587 14.7341ZM11.8514 4.90488H0.654771C0.484531 4.90488 0.31429 5.00219 0.196431 5.19683C0.0785726 5.39147 0 5.62504 0 5.89753V7.66874C0 8.21372 0.301195 8.66139 0.654771 8.66139H11.8383C12.2049 8.66139 12.493 8.21372 12.493 7.66874V5.89753C12.5061 5.35254 12.2049 4.92434 11.8514 4.90488Z"
          fill="#00C3F7"
        />
      </svg>
    )
  },
  {
    title: "Bank Transfer",
    paymentName: "bankTransfer",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="generic-icon large"
      >
        <g clipPath="url(#clip0_1186_55310)">
          <path
            d="M31.52 19.8703C29.383 28.4418 20.701 33.6578 12.1285 31.5208C3.55999 29.3838 -1.65651 20.7018 0.48099 12.1308C2.61699 3.55831 11.2985 -1.65869 19.8685 0.47831C28.4405 2.61531 33.6565 11.2983 31.5195 19.8703H31.52Z"
            fill="#F7931A"
          />
          <path
            d="M23.0546 13.7205C23.3726 11.5915 21.7516 10.447 19.5351 9.68345L20.2541 6.79945L18.4981 6.36195L17.7981 9.16995C17.3371 9.05495 16.8631 8.94645 16.3921 8.83895L17.0971 6.01245L15.3426 5.57495L14.6231 8.45795C14.2411 8.37095 13.8661 8.28495 13.5021 8.19445L13.5041 8.18545L11.0831 7.58095L10.6161 9.45595C10.6161 9.45595 11.9186 9.75445 11.8911 9.77295C12.6021 9.95045 12.7311 10.421 12.7091 10.794L11.8901 14.0795C11.9391 14.092 12.0026 14.11 12.0726 14.1379L11.8876 14.092L10.7391 18.6944C10.6521 18.9104 10.4316 19.2344 9.93461 19.1114C9.95211 19.1369 8.65861 18.7929 8.65861 18.7929L7.78711 20.8029L10.0721 21.3724C10.4971 21.4789 10.9136 21.5904 11.3231 21.6954L10.5966 24.613L12.3501 25.0505L13.0701 22.1644C13.5486 22.2944 14.0136 22.4144 14.4686 22.5274L13.7516 25.4L15.5071 25.8375L16.2336 22.926C19.2271 23.4925 21.4786 23.2639 22.4251 20.5569C23.1886 18.3769 22.3876 17.1194 20.8126 16.299C21.9596 16.0335 22.8236 15.279 23.0541 13.7205H23.0546ZM19.0431 19.3449C18.5001 21.5249 14.8301 20.347 13.6396 20.051L14.6036 16.1865C15.7936 16.4835 19.6091 17.0714 19.0436 19.3449H19.0431ZM19.5856 13.689C19.0906 15.672 16.0356 14.6644 15.0441 14.4174L15.9181 10.9125C16.9096 11.1595 20.1016 11.6205 19.5856 13.689Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_1186_55310">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    info: "Transfer with Monnify"
  }
];

export const _countryCodes = [
  { value: "+234", label: "+234" },
  { value: "+44", label: "+44" }
];

export const sortOptions: Option[] = [
  {
    label: "Alphabetically Descending",
    value: 1
  },
  {
    label: "Alphabetically Ascending",
    value: 2
  },
  {
    label: "Lowest Prices First",
    value: 3
  },
  {
    label: "Highest Prices First",
    value: 4
  }
];

export const occasions: { title: string; url: string; category?: string }[] = [
  {
    title: "Love, Birthdays & Anniversary",
    url: "/filters?selectedOccasion=Anniversary Flowers",
    category: "Anniversary Flowers"
  },
  {
    title: "Just to Say",
    url: "/filters?selectedOccasion=just-to-say",
    category: "Just to Say Bouquets"
  },
  {
    title: "Bridal Bouquets",
    url: "/filters?selectedOccasion=bridal-bouquets",
    category:
      "Birthday Flowers, Anniversary Flowers, Love %26amp; Romance flowers, Valentine Flowers, Mother's Day Flowers"
  },
  {
    title: "Funeral & Condolence",
    url: "/filters?selectedOccasion=funeral-condolence",
    category: "Funeral %26amp; Condolence"
  },
  {
    title: "All Occasions",
    url: "/filters?selectedOccasion=all-occasions"
  }
];

export const filtersCatgories: {
  name: string;
  options: { name: string; category?: string; tag?: string }[];
  limit: number;
  viewMore?: boolean;
}[] = [
  {
    name: "Occasions",
    options: [
      {
        name: "Love, Birthdays & Anniversary",
        category: "Anniversary Flowers"
      },
      {
        name: "Just to say Hi, Sorry, Thank You.",
        category: "Just to Say Bouquets"
      },
      {
        name: "Get well soon",
        category: "Get Well Soon Flowers"
      },
      {
        name: "Bridal",
        category:
          "Birthday Flowers, Anniversary Flowers, Love %26amp; Romance flowers, Valentine Flowers, Mother's Day Flowers"
      }
    ],
    limit: 4,
    viewMore: false
  },
  {
    name: "Budget",
    options: [
      {
        name: "Regular"
      },
      {
        name: "VIP"
      }
    ],
    limit: 2,
    viewMore: false
  },
  {
    name: "Packages",
    options: [
      {
        name: "Bundled Products"
      }
    ],
    limit: 3,
    viewMore: true
  },
  {
    name: "Delivery",
    options: [
      {
        name: "Same Day Delivery",
        tag: "Same Day Delivery"
      }
    ],
    limit: 3,
    viewMore: false
  },
  {
    name: "Flower Name",
    options: [
      {
        name: "Roses",
        tag: "Roses"
      },
      {
        name: "Chrysanthemums"
      },
      {
        name: "Lilies"
      },
      {
        name: "Million Stars",
        tag: "millionstar"
      }
    ],
    limit: 3,
    viewMore: false
  }
];

export const productSampleData = {
  id: 1,
  name: "A Kiss of Rose",
  addonsGroups: [
    {
      name: "Perfumes",
      image: "/images/addons/Rectangle133.png",
      description: "",
      slug: "#",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    },
    {
      name: "Teady Bears",
      image: "/images/addons/Rectangle133.png",
      description: "",
      slug: "#",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    }
  ],
  featured: true,
  images: [
    {
      alt: "flower1",
      src: "/images/sample-flowers/single-product.png",
      id: 1
    },
    {
      alt: "flower2",
      src: "/images/sample-flowers/single-product.png",
      id: 2
    },
    {
      alt: "flower3",
      src: "/images/sample-flowers/single-product.png",
      id: 3
    },
    {
      alt: "flower4",
      src: "/images/sample-flowers/single-product.png",
      id: 4
    }
  ],
  price: 70000,
  salePrice: 80000,
  sku: "u2i2093092",
  slug: "ejodei-iejeo-ooeoei",
  type: "variable",
  variants: [
    { name: "Small (15 Roses)", price: 75000, class: "regular" },
    { name: "Medium (20 Roses)", price: 90000, class: "vip" }
  ],
  productDescription:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
  title: "A Kiss of Rose",
  sizes: [
    "Entry (5 roses)",
    "Extra Small (10 roses)",
    "Small (15 roses)",
    "Medium (20 roses)",
    "Standard (24cm box)",
    "Standard Plus (27cm box)",
    "Standard Premium (30cm box)",
    "VIP Entry",
    "VIP Medium",
    "VIP Standard",
    "VIP Standard Premium",
    "VIP Large"
  ],
  designOptions: ["wrappedBouquet", "inVase", "inLargeVase", "box"],
  note:
    "Single stem rose only available for pickup, except as part of larger order.",
  description:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
  details: "5 Peas in a pod"
};

export const links: AppLink[] = [
  {
    url: "#",
    title: "Send To",
    subtitle: "Send Flowers To",
    children: [
      {
        title: "",
        children: [
          {
            title: "Bouquets",
            children: [],
            url: ""
          },
          {
            title: "Bouquets",
            children: [],
            url: ""
          },
          {
            title: "Bouquets",
            children: [],
            url: ""
          }
        ],
        url: ""
      }
    ]
  },
  {
    url: "/filters?selectedOccasion=Anniversary Flowers",
    title: "Occasions",
    subtitle: "Select Occassion",
    children: [
      {
        title: "Romance, Birthdays & Anniversary",
        url: "/filters?selectedOccasion=Anniversary Flowers",
        children: []
      },
      {
        title: "Just to say Hi, Sorry, Thank You",
        url: "/filters?selectedOccasion=just-to-say",
        children: []
      },
      {
        title: "Get well soon",
        url: "",
        children: []
      },
      {
        title: "Bridal",
        url: "/filters?selectedOccasion=bridal-bouquets",
        children: []
      },
      {
        title: "Funeral & Condolence",
        url: "/filters?selectedOccasion=funeral-condolence",
        children: []
      },
      {
        title: "Events & Centerpiece",
        url: "",
        children: []
      },
      {
        title: "Father's Day",
        url: "",
        children: []
      },
      {
        title: "Mother's Day",
        url: "",
        children: []
      },
      {
        title: "Valentine’s Day",
        url: "",
        children: []
      }
      // {
      //   title: "Others",
      //   url: "",
      //   children: [
      //     {
      //       title: "VIP Statements",
      //       url: "",
      //       children: []
      //     },
      //     {
      //       title: "Events & Centerpiece",
      //       url: "",
      //       children: []
      //     },
      //     {
      //       title: "Father's Day",
      //       url: "",
      //       children: []
      //     },
      //     {
      //       title: "Mother's Day",
      //       url: "",
      //       children: []
      //     }
      //   ]
      // }
    ]
  },
  {
    url: "#",
    title: "Shop By",
    children: [
      {
        title: "Design",
        url: "",
        children: [
          {
            title: "Bouquets",
            url: "",
            children: []
          },
          {
            title: "Bouquets",
            url: "",
            children: []
          },
          {
            title: "Bouquets",
            url: "",
            children: []
          }
        ]
      },
      {
        title: "Delivery",
        url: "",
        children: [
          {
            title: "Bouquets",
            url: "",
            children: []
          },
          {
            title: "Bouquets",
            url: "",
            children: []
          },
          {
            title: "Bouquets",
            url: "",
            children: []
          }
        ]
      },
      {
        title: "Packages",
        url: "",
        children: [
          {
            title: "Bouquets",
            url: "",
            children: []
          },
          {
            title: "Bouquets",
            url: "",
            children: []
          },
          {
            title: "Bouquets",
            url: "",
            children: []
          }
        ]
      }
    ]
  },
  {
    url: "#",
    title: "Flower Types",
    children: []
  },
  {
    url: "#",
    title: "Gifts",
    children: []
  },
  {
    url: "/faq",
    title: "FAQ",
    children: []
  }
];
