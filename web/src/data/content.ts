/* Content migrated from the approved static site (scripts/convert.py). Edit freely. */
export { posts } from "./posts";
import type {
  ClassItem,
  FeaturedTestimonial,
  GalleryPhoto,
  HeroSlide,
  Img,
  Membership,
  Modality,
  PassGroup,
  Post,
  Product,
  ShortTestimonial,
  Teacher,
  TestimonialChapter,
  Video,
} from "@/lib/types";

/** Home hero slideshow, in the order of its tagline: yoga, strength, mobility, wellbeing. To show a video on a slide,
    add video: "/videos/name.mp4" (file in public/videos/, muted and looping); the photo shows until it plays. */
export const heroSlides: HeroSlide[] = [
  {
    src: "/images/gallery/hero_DSC00182.jpg",
    alt: "A full class practising triangle pose in The Yoga School studio",
    width: 1920,
    height: 1080,
    position: "55% 40%",
  },
  {
    src: "/images/gallery/hero_DSC00140.jpg",
    alt: "Students holding plank pose together",
    width: 1920,
    height: 1080,
    position: "62% 50%",
  },
  {
    src: "/images/gallery/hero_DSC00184.jpg",
    alt: "A class standing strong in a wide-legged pose",
    width: 1920,
    height: 1080,
  },
  {
    src: "/images/gallery/hero_DSC00180.jpg",
    alt: "Students balancing in tree pose with arms raised",
    width: 1920,
    height: 1080,
    position: "50% 30%",
  },
];

export const moments: Img[] = [
  {
    src: "/images/gallery/DSC00179-2.jpg",
    alt: "Students balancing in tree pose",
    width: 2049,
    height: 1464,
  },
  {
    src: "/images/gallery/DSC00207.jpg",
    alt: "A student in dolphin pose",
    width: 2308,
    height: 1299,
  },
  {
    src: "/images/gallery/DSC00186.jpg",
    alt: "Students in a wide-legged standing pose",
    width: 1464,
    height: 2049,
  },
  {
    src: "/images/gallery/DSC00115.jpg",
    alt: "A student in a forward fold",
    width: 2308,
    height: 1299,
  },
  {
    src: "/images/gallery/DSC00203.jpg",
    alt: "A student seated in front of the studio logo",
    width: 1299,
    height: 2308,
  },
  {
    src: "/images/gallery/DSC00185.jpg",
    alt: "A class in warrior two pose",
    width: 2308,
    height: 1299,
  },
  {
    src: "/images/gallery/DSC00121-2.jpg",
    alt: "A student kneeling in prayer position",
    width: 1464,
    height: 2049,
  },
  {
    src: "/images/gallery/DSC00142.jpg",
    alt: "Students in plank pose in front of the studio logo",
    width: 2308,
    height: 1299,
  },
  {
    src: "/images/gallery/DSC00211.jpg",
    alt: "An older student balancing with arms outstretched",
    width: 1299,
    height: 2308,
  },
  {
    src: "/images/gallery/DSC00056edit.jpg",
    alt: "Students in seated twists",
    width: 2973,
    height: 2124,
  },
  {
    src: "/images/gallery/DSC00141.jpg",
    alt: "A row of students in plank pose",
    width: 1464,
    height: 2049,
  },
  {
    src: "/images/gallery/DSC00217.jpg",
    alt: "The studio with mats and blocks laid out",
    width: 2308,
    height: 1299,
  },
];

export const gallery: GalleryPhoto[] = [
  {
    src: "/images/gallery/DSC00180.jpg",
    alt: "Students balancing in tree pose, arms raised overhead",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00180.jpg",
  },
  {
    src: "/images/gallery/DSC00121-2.jpg",
    alt: "A student kneeling with hands in prayer position",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00121-2.jpg",
  },
  {
    src: "/images/gallery/DSC00115.jpg",
    alt: "A student in a forward fold with head resting on the mat",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00115.jpg",
  },
  {
    src: "/images/gallery/DSC00132.jpg",
    alt: "A student reaching upward in an extended side pose",
    width: 563,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00132.jpg",
  },
  {
    src: "/images/gallery/DSC00207.jpg",
    alt: "A student in dolphin pose on a mat",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00207.jpg",
  },
  {
    src: "/images/gallery/DSC00186.jpg",
    alt: "Students in a wide-legged standing pose",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00186.jpg",
  },
  {
    src: "/images/gallery/DSC00128.jpg",
    alt: "A full class reaching into triangle pose together",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00128.jpg",
  },
  {
    src: "/images/gallery/DSC00203.jpg",
    alt: "A student seated in front of The Yoga School logo",
    width: 563,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00203.jpg",
  },
  {
    src: "/images/gallery/DSC00141.jpg",
    alt: "A row of students holding plank pose",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00141.jpg",
  },
  {
    src: "/images/gallery/DSC00213.jpg",
    alt: "A student in extended triangle pose",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00213.jpg",
  },
  {
    src: "/images/gallery/DSC00200.jpg",
    alt: "Students sitting cross-legged in meditation",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00200.jpg",
  },
  {
    src: "/images/gallery/DSC00059edit.jpg",
    alt: "A smiling student stretching forward over her legs",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00059edit.jpg",
  },
  {
    src: "/images/gallery/DSC00019edit.jpg",
    alt: "A teacher giving a student a hands-on adjustment",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00019edit.jpg",
  },
  {
    src: "/images/gallery/DSC00056edit.jpg",
    alt: "Students in seated twists on their mats",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00056edit.jpg",
  },
  {
    src: "/images/gallery/DSC00060edit.jpg",
    alt: "A student smiling during a seated forward bend",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00060edit.jpg",
  },
  {
    src: "/images/gallery/DSC00075edit.jpg",
    alt: "Students practising headstands and shoulder stands",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00075edit.jpg",
  },
  {
    src: "/images/gallery/DSC00090edit.jpg",
    alt: "Students standing with arms raised in prayer overhead",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00090edit.jpg",
  },
  {
    src: "/images/gallery/DSC00112.jpg",
    alt: "Students kneeling on mats at the start of class",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00112.jpg",
  },
  {
    src: "/images/gallery/DSC00113.jpg",
    alt: "Students seated on mats listening to the teacher",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00113.jpg",
  },
  {
    src: "/images/gallery/DSC00117.jpg",
    alt: "A class in triangle pose with arms reaching up",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00117.jpg",
  },
  {
    src: "/images/gallery/DSC00119.jpg",
    alt: "A class in warrior pose",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00119.jpg",
  },
  {
    src: "/images/gallery/DSC00121.jpg",
    alt: "Students kneeling with hands in prayer position",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00121.jpg",
  },
  {
    src: "/images/gallery/DSC00125.jpg",
    alt: "Students kneeling quietly on their mats",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00125.jpg",
  },
  {
    src: "/images/gallery/DSC00126.jpg",
    alt: "A class kneeling on mats, viewed from behind",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00126.jpg",
  },
  {
    src: "/images/gallery/DSC00129.jpg",
    alt: "A class in extended side angle pose",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00129.jpg",
  },
  {
    src: "/images/gallery/DSC00131.jpg",
    alt: "Students in warrior and triangle poses",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00131.jpg",
  },
  {
    src: "/images/gallery/DSC00134.jpg",
    alt: "Students stretching in a side bend",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00134.jpg",
  },
  {
    src: "/images/gallery/DSC00137.jpg",
    alt: "A student in a seated twist on the floor",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00137.jpg",
  },
  {
    src: "/images/gallery/DSC00140.jpg",
    alt: "Students holding plank pose",
    width: 1000,
    height: 649,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00140.jpg",
  },
  {
    src: "/images/gallery/DSC00142.jpg",
    alt: "Students in plank pose in front of the studio logo",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00142.jpg",
  },
  {
    src: "/images/gallery/DSC00144.jpg",
    alt: "Students resting and stretching on their mats",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00144.jpg",
  },
  {
    src: "/images/gallery/DSC00179.jpg",
    alt: "Students balancing in tree pose",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00179.jpg",
  },
  {
    src: "/images/gallery/DSC00179-2.jpg",
    alt: "Students balancing in tree pose, hands overhead",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00179-2.jpg",
  },
  {
    src: "/images/gallery/DSC00181.jpg",
    alt: "A full class in triangle pose",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00181.jpg",
  },
  {
    src: "/images/gallery/DSC00182.jpg",
    alt: "A full class reaching into triangle pose",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00182.jpg",
  },
  {
    src: "/images/gallery/DSC00183.jpg",
    alt: "A student in revolved triangle pose",
    width: 1000,
    height: 714,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00183.jpg",
  },
  {
    src: "/images/gallery/DSC00183-2.jpg",
    alt: "A student in revolved triangle pose, portrait view",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00183-2.jpg",
  },
  {
    src: "/images/gallery/DSC00184.jpg",
    alt: "A class standing in a wide-legged pose",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00184.jpg",
  },
  {
    src: "/images/gallery/DSC00185.jpg",
    alt: "A class in warrior two pose",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00185.jpg",
  },
  {
    src: "/images/gallery/DSC00192.jpg",
    alt: "A student kneeling on a mat, viewed from behind",
    width: 563,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00192.jpg",
  },
  {
    src: "/images/gallery/DSC00193.jpg",
    alt: "A student kneeling quietly on a mat",
    width: 563,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00193.jpg",
  },
  {
    src: "/images/gallery/DSC00209.jpg",
    alt: "A class in triangle pose, portrait view",
    width: 563,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00209.jpg",
  },
  {
    src: "/images/gallery/DSC00210.jpg",
    alt: "Students in triangle pose with arms reaching up",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00210.jpg",
  },
  {
    src: "/images/gallery/DSC00211.jpg",
    alt: "An older student balancing with arms outstretched",
    width: 563,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00211.jpg",
  },
  {
    src: "/images/gallery/DSC00212.jpg",
    alt: "A student in triangle pose, portrait view",
    width: 714,
    height: 1000,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00212.jpg",
  },
  {
    src: "/images/gallery/DSC00217.jpg",
    alt: "The empty studio with mats and blocks laid out",
    width: 1000,
    height: 563,
    full: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/photo-gallery/updated/DSC00217.jpg",
  },
];

export const teachers: Teacher[] = [
  {
    slug: "ronnieperry",
    name: "Ronnie Perry",
    role: "Studio Owner & Teacher",
    spec: "200 hrs Knoff teacher training · owner since 2018",
    photo: {
      src: "/images/teachers/teacher_0.jpg",
      alt: "Portrait of Ronnie Perry",
      width: 456,
      height: 640,
    },
    bio: [
      "Ronnie's first experience with yoga was when he was travelling with the Australian Parachute Team (APT) as coach and manager. 'I always knew the body could heal itself but how do you get into that healing state'. Ronnie soon learnt that using breath work and yoga is a great way into the body's self healing mechanism.",
      "Ronnie's first class as a student at The Yoga School was in 2015, he then went on 'yoga binges' where he would be seen at classes 8 days in a row and he felt a genuine calming of the mind and a greater awareness of his 'inner dialogue'.",
      "Between 2017 and 2020 Ronnie completed 200hrs of teacher Training with Nicky Knoff and so the teaching journey began.",
      "In 2018 he had the opportunity to take ownership of The Yoga School, because of the authenticity and high quality of teaching provided by the Knoff trained teachers it was an easy decision to make.",
      "Here's to a bright and shiny future!",
    ],
  },
  {
    slug: "nicolamaxwell",
    name: "Nicola Maxwell",
    role: "Teacher & Office Manager",
    spec: "Yoga Alliance E-RYT 500 · Kids & Teens yoga",
    photo: {
      src: "/images/teachers/teacher_1.jpg",
      alt: "Portrait of Nicola Maxwell",
      width: 457,
      height: 640,
    },
    bio: [
      "Nicola discovered yoga just after giving birth to her second child in 2006. “I was searching for some solace in my crazy, sleep deprived world. Yoga has taught me patience, resilience and acceptance, all of which I am convinced has made me a better mother.”",
      "She was introduced to Knoff Yoga in 2008 and was so impressed by the quality of the teaching and the commitment and passion of the teachers, that she became a regular student. In 2013 she completed the Knoff Discovery Teacher Training course and began her teaching career. “I immediately loved teaching, I'd found my passion.” She carried on with her education by completing Foundation and Chair Yoga in 2014, Intermediate in 2015, Pregnancy in 2017 and Holistic Healing A&B in 2018. In early 2020 she embarked on the next chapter of her yoga adventure with Zenergy Yoga, an internationally accredited Kids and Teens Teacher Training establishment, having now completed Foundation, Yoga Therapy One, Yoga Therapy Two, Advanced and Mastery levels she is now a recognised fully trained Kids and Teens Yoga Teacher.",
      "As well as teaching at The Yoga School Nicola’s job description extends to the Yoga School Manager where she ensures that the Yoga School is running smoothly. “Yoga can and will change your life, and one of the things I love about it the most, is that you can do it for the rest of your life.”",
      "Nicola is a Yoga Alliance E.R.Y.T 500.",
    ],
  },
  {
    slug: "rossipostler",
    name: "Rossi Postler",
    role: "Yoga Teacher",
    spec: "Knoff Master Level teacher training",
    photo: {
      src: "/images/teachers/teacher_2.jpg",
      alt: "Portrait of Rossi Postler",
      width: 570,
      height: 640,
    },
    bio: [
      "Rossi first tried yoga in 2007, when she was pregnant with her son Jacky. Her life has always been very active, with lots of traveling and different sports. The pregnancy yoga was ideal to slow everything down during the pregnancy and also to reconnect with herself, helping her to stay in the present moment.",
      'Rossi started with The Knoff Yoga School in 2013 and was surprised at how much strength and flexibility could be gained through yoga. "After my first yoga class I knew I had found something that would stay with me forever. It felt like it was meant to be."',
      "Yoga has helped Rossi to be more patient as a mother, more compassionate as a friend, more balanced at work and much gentler with herself. In 2014 Rossi completed Discovery and Foundation Teacher Training with Nicky in Dresden, which she considers to be one of her most amazing experiences. She then finished the Intermediate Teacher Training in 2016 and Advanced in 2017.",
      "In 2019 she finished the Master Level of Teacher Training with Nicky Knoff in Cairns.",
      '"Being taught and mentored by Nicky and James is very precious. Yoga is like a journey that never ends, which makes it so interesting and fun and challenging at the same time."',
    ],
  },
  {
    slug: "tomokogregory",
    name: "Tomoko Gregory",
    role: "Yoga Teacher",
    spec: "All 9 levels of Knoff teacher training",
    photo: {
      src: "/images/teachers/teacher_3.jpg",
      alt: "Portrait of Tomoko Gregory",
      width: 605,
      height: 640,
    },
    bio: [
      "Tomoko first began practising yoga in Japan when she was 17 years old. When she moved to Australia she began training under Nicky Knoff and James Bryan at the Cairns Ashtanga Yoga School in 1997. She completed her first teacher training course with Nicky in 2006. Over the last 15 years she has completed all 9 levels of teacher training including: Discovery, Foundation, Intermediate, Advanced and Master levels as well as specialist yoga disciplines, including Chair yoga, Pregnancy yoga and Holistic yoga A&B.",
    ],
  },
  {
    slug: "janwatson",
    name: "Jan Watson",
    role: "Yoga Teacher",
    spec: "Certified Iyengar teacher · Senior Teacher, Yoga Australia",
    photo: {
      src: "/images/teachers/teacher_4.jpg",
      alt: "Portrait of Jan Watson",
      width: 640,
      height: 593,
    },
    bio: [
      "Yoga has been a part of Jan’s life since early adulthood; starting yoga in the 1970’s. Jan’s practice has been diverse; from the glamour and glitz of Bette Carman to Ashrams to Michael Volin, who established the first yoga school in Australia. Her first teacher training was a 12 month, correspondence course, through S.A. Yoga Teachers Association. She was granted a Diploma of Teaching in 1991. She began teaching yoga in 1992 in Gordonvale. In 1993, Jan apprenticed to Nicky Knoff for 3 years and certified as an Iyengar Yoga Teacher in 1997. She taught classes for Nicky and James until she established The Yoga Centre, in Cairns, in 2001. She went to India twice, to study with Dr. Geeta Iyengar and to meet BKS Iyengar. She has also studied and worked with Peter Scott. Jan Qualifications: Intermediate (JI 2) Iyengar Yoga certificate Senior Teacher with Yoga Australia Senior Level 5 Teacher with Yoga Alliance What inspires Jan about Yoga is that It keeps you in tune with yourself; physically and mentally.",
    ],
  },
  {
    slug: "nicolamellick",
    name: "Nicola Mellick",
    role: "Yoga Teacher",
    spec: "Pregnancy yoga · Yoga Therapy A & B",
    photo: {
      src: "/images/teachers/teacher_5.jpg",
      alt: "Portrait of Nicola Mellick",
      width: 455,
      height: 640,
    },
    bio: [
      "Yoga has been focal/central part of Nicola’s life since childhood with her grandparents and mother practising.  She has memories of her Nana in shoulder stand and a sign on their dining room table ‘BREATHE’. Her career path ventured through Education, Psychology and a  Masters in Education,  always drawn to roles within the community. After completing Discovery and Foundation Teacher Training in 2011, with no plans to teach, her mother told her they needed a yoga teacher at the studio she attended. That was the beginning of her love of teaching yoga. In 2012 Nicola completed Intermediate, Pregnancy, Yoga Therapy A and B.",
      "'With almost 10 years teaching yoga, it still doesn’t feel like a job. It’s my passion. It empowers people to lead a healthier, stronger, fitter, calmer life with an ability to respond to day to day activities or challenges. It creates space in our day and mind to make positive choices.  Yoga is for everyone!’",
    ],
  },
  {
    slug: "jenniferearl",
    name: "Jennifer Earl",
    role: "Yoga Teacher",
    spec: "Hatha yoga & Ayurveda, studied in India",
    photo: {
      src: "/images/teachers/teacher_6.jpg",
      alt: "Portrait of Jennifer Earl",
      width: 457,
      height: 640,
    },
    bio: [
      "Jennifer has always been drawn to the more Eastern and holistic version of health and wellness and had a deep desire to blend proven western sciences and traditional eastern medicine. This led her to spend 5 months in India studying Ayurveda and becoming a Yoga teacher.",
      "She has studied very authentic HATHA YOGA in the foothills of the Himalaya’s.  Then she has done studies throughout Australia and online with various schools and a variety of teachers including Power living Studio – assisting and aligning,  Jivamukti yoga – pregnancy yoga, Loraine Rushton - kids yoga training, Jan Watson – Iyenga and of course Nicky Knoff at the Yoga School – a variety of courses.",
      "She loves sharing Yoga with all walks of life and helping them navigate through their practices, challenging them to their edge but also encouraging people to listen to their bodies and pull back.",
      "Yoga is all about bringing the body back into balance and harmony and Yoga Asana is one way of working with the body to achieve this sense of calm and centring.",
      "I look forward to seeing you at the Yoga School.",
    ],
  },
  {
    slug: "tanjarichter",
    name: "Tanja Richter",
    role: "Yoga Teacher",
    spec: "500+ hrs training · Chair Yoga & Therapy A",
    photo: {
      src: "/images/teachers/teacher_7.jpg",
      alt: "Portrait of Tanja Richter",
      width: 455,
      height: 640,
    },
    bio: [
      "Tanja started her yoga journey during her career as a Personal Trainer in 2009.",
      "Looking for a practice that wasn’t merely physical , but also opened a deeper spiritual and emotional connection with Body, Mind and breath.",
      "Since attending her first class she knew it was going to be a lifelong journey of learning , and after more than 500hrs of teacher training , it is still very much a huge passion she wants to share with her students.",
      "After owning her own studio for 5 years in Melbourne, she relocated to Cairns in 2021, and was thrilled to be able to join TYS community as a student and teacher .",
      "Tanja has so far completed the Knoff trainings Discovery, Chair Yoga and Therapy A.",
    ],
  },
  {
    slug: "pennieburke",
    name: "Pennie Burke",
    role: "Yoga Teacher",
    spec: "20+ years of practice · Chair & Holistic A",
    photo: {
      src: "/images/teachers/teacher_8.jpg",
      alt: "Portrait of Pennie Burke",
      width: 457,
      height: 640,
    },
    bio: [
      "Pennie has been regularly practicing yoga for over 20 years, first dabbling in yoga during her teens and twenties. Yoga has helped her grow stronger, more flexible and live more fearless off the mat. Yoga inspires her to live her best life. Pennie commenced her teaching training in 2013 and has completed Discover, Foundation, Intermediate , Chair and Holistic A. She will always be a student and is grateful for the wisdom and freedom yoga has brought to her life. In her classes she likes to create a sense of playfulness and inspiration so students can enjoy and deepen their practice. Her hope is that when students step off the mat they feel revitalised, relaxed and happy.",
    ],
  },
  {
    slug: "tinafielder",
    name: "Tina Fielder",
    role: "Yoga Teacher",
    spec: "Trained with Nicky Knoff · yoga for all ages",
    photo: {
      src: "/images/teachers/teacher_9.jpg",
      alt: "Portrait of Tina Fielder",
      width: 456,
      height: 640,
    },
    bio: [
      "Tina loves Yoga. She says it’s always made her feel better, helping her physically as well as mentally to stay healthy, balanced and focused. ‘When I have given Yoga a break in my life before (the longest was 2 month due to injury), it has become painfully evident that it is vital for my well-being, so I keep stepping back on the mat. I love having the tools to help myself.’",
      "When Tina has a sore back, headache or feels her energy is stagnant, she does her daily practice and always feels better.’ It is extremely powerful to know how to improve your own well-being. Practicing Yoga regularly ensures, I maintain a healthy body, mind and feel good.’",
      "Yoga Teacher Training with Nicky Knoff has deepened Tina’s knowledge and elevated her practice to a higher level. Nicky’s vast experience as well as her tireless effort to ensure every one of her students receives maximum benefit and understands all aspects of Yoga, is inspiring and uplifting. Tina’s own desire to teach has been strong for almost 10 years and she thoroughly enjoys seeing her students progress. Through teaching she wants to offer more people access to Yoga, it’s benefits and the autonomy to help and heal themselves. She believes that Yoga is beneficial for people of all ages and abilities.",
    ],
  },
  {
    slug: "owenscotts",
    name: "Owen Scotts",
    role: "Concierge",
    spec: "Welcoming new students for over 19 years",
    photo: {
      src: "/images/teachers/teacher_10.jpg",
      alt: "Portrait of Owen Scotts",
      width: 457,
      height: 640,
    },
    bio: [
      "Owen is a valued member of The Yoga School team and has been involved in the day to day activities of the studio for over 19 years. He is the official meet and greet person at our busy yoga classes and is skilled at making new students feel welcome and comfortable.",
      "As a community-minded person, Owen has also been involved as a volunteer with the YAPS animal shelter for 15 years, and Crime Stoppers for 9 years.",
    ],
  },
];

export const classes: ClassItem[] = [
  {
    slug: "l1",
    name: "Level 1",
    level: "Beginners",
    duration: "60–75 min",
    summary: "Introduction to Yoga. Perfect for absolute beginners and anyone wanting a slower practice.",
    description: [
      "The perfect way to start yoga, this entry level class is suitable for absolute beginners and anyone wanting a slower practice with time to explore the postures and foundations of yoga in detail.  Move up to the higher levels whenever you feel ready, or stay here for as long as you like.  You will often see some regulars and more advanced yogis in this class, as coming back to the fundamentals of this practice is essential for progression.",
    ],
    tag: "Start here",
    image: {
      src: "/images/gallery/DSC00112.jpg",
      alt: "Students kneeling on their mats at the start of a class",
      width: 2308,
      height: 1299,
    },
  },
  {
    slug: "l2",
    name: "Level 2",
    level: "Some experience",
    duration: "60–75 min",
    summary: "A quicker pace using Vinyasa to build upper-body strength, create heat and focus the mind.",
    description: [
      "These classes move at a quicker pace than level 1 and expand on the use of Vinyasa (linking techniques) to build upper body strength, create heat and improve mental focus.  We introduce some stronger postures but you are welcome to modify when you need to, students at this level need to be able to self regulate and some experience of yoga is recommend.",
    ],
    tag: null,
    image: {
      src: "/images/gallery/DSC00140.jpg",
      alt: "Students holding plank pose in a vinyasa sequence",
      width: 2149,
      height: 1395,
    },
  },
  {
    slug: "l3",
    name: "Level 3",
    level: "Intermediate",
    duration: "90 min",
    summary: "More demanding postures to increase your proficiency and skill in every area of practice.",
    description: [
      "As you progress, the postures become more demanding. This level is recommended when you are comfortable with the level 2 classes and feel ready to challenge yourself. Here you will learn how to increase your proficiency and skill in all areas of your yoga practice.",
    ],
    tag: null,
    image: {
      src: "/images/gallery/DSC00183.jpg",
      alt: "A student in a strong revolved triangle pose",
      width: 2049,
      height: 1464,
    },
  },
  {
    slug: "l4",
    name: "Level 4",
    level: "Advanced",
    duration: null,
    summary: "Inversions and stronger versions of the other Asana groups. Level 3 competency recommended.",
    description: [
      "At this level we study a number of inversions as well as stronger versions of the other Asana groups.  Competency with Level 3 is recommended before attending.",
    ],
    tag: null,
    image: {
      src: "/images/gallery/DSC00075edit.jpg",
      alt: "Students practising headstands and other inversions",
      width: 3677,
      height: 2626,
    },
  },
  {
    slug: "all",
    name: "All Levels & Combined",
    level: "All levels",
    duration: "60–75 min",
    summary: "Easier Asanas first, with more challenging options. Practise at the level that suits you today.",
    description: [
      "Designed to accommodate different levels of yoga experience and all students (including beginners) are welcome. Easier Asanas and vinyasas will be given first with more challenging options offered for more experienced students.  You are invited to practice at a level that suits your ability and energy level on any given day.",
      "Combined level classes: Blends the two levels together, the class is predominantly taught at the lower level but we introduce some higher level postures as an option for more experienced students and those wishing to progress.",
    ],
    tag: "Everyone welcome",
    image: {
      src: "/images/gallery/DSC00131.jpg",
      alt: "A mixed class of students in warrior and triangle poses",
      width: 2308,
      height: 1299,
    },
  },
  {
    slug: "yin",
    name: "Yin Yoga",
    level: "All levels",
    duration: "60 min",
    summary: "A quiet, passive practice targeting deep connective tissues, fascia, joints and bones.",
    description: [
      "Yin Yoga is a quiet and passive practice. Targeting deep connective tissues, fascia, ligaments, joints and bones.  It’s slow and meditative, allowing you time and space to turn inwards and tune into both your mind and the physical sensations of your body.",
    ],
    tag: null,
    image: {
      src: "/images/gallery/DSC00193.jpg",
      alt: "A student kneeling quietly on a mat",
      width: 1299,
      height: 2308,
    },
  },
  {
    slug: "chair",
    name: "Chair Yoga",
    level: "Gentle",
    duration: null,
    summary: "For seniors and students with limited mobility, balance or joint challenges, or in recovery.",
    description: [
      "For seniors and physically challenged students with disabilities, lack of mobility, balance problems, joint challenges, recovering from illness, accidents and operations. As you build up your strength, stamina and balance, progression to our general mat classes can sometimes become and option.",
    ],
    tag: null,
    image: {
      src: "/images/gallery/DSC00203.jpg",
      alt: "A student seated comfortably on a mat in the studio",
      width: 1299,
      height: 2308,
    },
  },
  {
    slug: "shoshin",
    name: "Shoshin Strength & Mobility",
    level: "All levels",
    duration: "60 min",
    summary: "Strength classes and mobility classes, included in Shoshin Only and Everything memberships.",
    description: [
      "Shoshin strength and mobility classes run alongside our yoga timetable. Unlimited access is included in the Shoshin Only ($80 per fortnight) and Everything ($98 per fortnight) memberships, and in the 180- and 365-day unlimited passes.",
    ],
    tag: "New",
    image: {
      src: "/images/gallery/DSC00184.jpg",
      alt: "A class standing in a wide-legged pose",
      width: 2308,
      height: 1299,
    },
  },
  {
    slug: "private",
    name: "Private Sessions",
    level: "Tailored",
    duration: "60 or 90 min",
    summary: "One-on-one and small-group sessions for technique and specific health challenges.",
    description: [
      "60 or 90 minute, one-on-one (and small group) classes are designed to deepen your understanding and speed up your progress. Ideal for improving technique and for specific health challenges such as: back-pain, posture improvement, structural imbalances, scoliosis, anxiety, insomnia, constipation, depression, headaches, pregnancy etc. Discounts are available for group bookings.",
    ],
    tag: "One-on-one",
    image: {
      src: "/images/gallery/DSC00019edit.jpg",
      alt: "A teacher giving a student a hands-on adjustment",
      width: 5472,
      height: 3080,
    },
  },
];



/** Home page "Our classes": the five ways to practise, each card linking to its class on /pages/classes.
    PLACEHOLDER photos (crops of studio gallery shots): replace the files in public/images/modalities/ with the
    final photos, keeping the file names (600 × 630 px, or any image of that shape). */
export const modalities: Modality[] = [
  {
    name: "Knoff Yoga",
    blurb: "Experience, alignment and flexibility.",
    classMatch: null,
    image: { src: "/images/modalities/knoff-yoga.jpg", alt: "A student in triangle pose", width: 600, height: 630 },
  },
  {
    name: "Strength",
    blurb: "Build real, usable strength.",
    classMatch: /strength|shoshin/i,
    image: { src: "/images/modalities/strength.jpg", alt: "Students holding plank pose", width: 600, height: 630 },
  },
  {
    name: "Mobility",
    blurb: "Move more freely and comfortably.",
    classMatch: /mobility|shoshin/i,
    image: { src: "/images/modalities/mobility.jpg", alt: "A student in a deep seated stretch", width: 600, height: 630 },
  },
  {
    name: "Chair Yoga",
    blurb: "Gentle, accessible movement.",
    classMatch: /chair/i,
    image: { src: "/images/modalities/chair-yoga.jpg", alt: "Students sitting quietly in meditation", width: 600, height: 630 },
  },
  {
    name: "Yin Yoga",
    blurb: "Slow down, release and restore.",
    classMatch: /\byin\b/i,
    image: { src: "/images/modalities/yin-yoga.jpg", alt: "A student folding forward with a strap", width: 600, height: 630 },
  },
];

export const videos: Video[] = [
  {
    id: "X9W4SDA4m8Q",
    title: "Knoff Yoga Overview",
    duration: "8:50",
  },
  {
    id: "u3OwQ7D3w_s",
    title: "Dolphin Pose 1",
    duration: "4:54",
  },
  {
    id: "0jfrJDWnG58",
    title: "Dolphin Pose 2 & 3",
    duration: "4:31",
  },
  {
    id: "w4iJZ4BJVKY",
    title: "Wall and Chair Dolphin Pose",
    duration: "5:26",
  },
  {
    id: "_D1ygLJdrIM",
    title: "Dolphin Full Sequence",
    duration: "8:03",
  },
  {
    id: "fIjRTF4TXps",
    title: "Chakra Meditation Preview",
    duration: "8:32",
  },
  {
    id: "hItQ3Ojq_DE",
    title: "Chair Yoga 1",
    duration: "2:48",
  },
  {
    id: "OWZ_ywgyOtE",
    title: "Chair Yoga 2",
    duration: "3:01",
  },
  {
    id: "udAbwLafzNM",
    title: "Tadasana",
    duration: "2:14",
  },
  {
    id: "RciVFQigvHE",
    title: "Bhumi Namaskar",
    duration: "5:18",
  },
];

export const sliderTestimonials: ShortTestimonial[] = [
  {
    quote:
      "Since finding The Yoga School through a friend, my depression and anxiety has improved and I can now self manage my emotions a lot better. The meditation at the start of class is so calming.",
    name: "Sarah",
    role: "Regular student",
  },
  {
    quote:
      "The Yoga School teachers have such a thorough, detailed understanding of the entire human body. Their verbal cueing is exceptional and of a standard I have never experienced before.",
    name: "Erin",
    role: "Student",
  },
  {
    quote:
      "Practicing yoga for over 2 years has given me much improved flexibility in all joints and my arthritic pain has virtually disappeared.",
    name: "David Dobinson",
    role: "Student",
  },
  {
    quote:
      "As someone uncomfortable in groups and never a ‘joiner’, I found a place and sense of belonging in the community of TYS that I will always value.",
    name: "CeCelia Roupe",
    role: "Student",
  },
  {
    quote:
      "I rotated 6 vertebra in a snowboarding accident in 2002. Doing yoga a few times a week (the more, the better) helps me live without pain.",
    name: "Cleo Legge",
    role: "Student",
  },
  {
    quote:
      "I had a beautiful birth and I attribute a lot of this to Knoff yoga system and the breathing techniques I learnt at the school.",
    name: "Tanya & Quinn",
    role: "Pregnancy yoga",
  },
  {
    quote:
      "Insomnia used to be my plague… Yoga has taught me to do that. Now I look forward to 5:30 am when I can rise and shine and stretch.",
    name: "Leon Gordon",
    role: "Student for about 20 years",
  },
  {
    quote:
      "I never knew how little of a lung capacity I had until now and it also continues to expand further. Every week I am noticing a little extra with my breathing.",
    name: "Adam Phillips",
    role: "Teacher training graduate",
  },
];

/* Testimonials page. Stories are the students' own words (only run-together sentences and paragraph breaks tidied).
   "highlight" is a line quoted from the story and set large above it; stories without one are short enough to show
   whole as the quote. */
export const featuredTestimonial: FeaturedTestimonial = {
  name: "CeCelia Roupe",
  role: "Student",
  highlight: "It was the best thing I’ve ever done for myself.",
  paragraphs: [
    "I cannot recommend The Yoga School at Manunda, Cairns, enough. On my first visit there I was met with welcoming smiles from the friendly staff and yoga students. When I learned how affordable the fees schedule was and how frequently classes were run (7 days a week with multiple time slots) and that they were open to all skill levels, I signed up for a trial membership. It was the best thing I've ever done for myself.",
    "I had no idea how transformative my classes would be. All of the instructors were supportive and genuinely interested in my individual needs and progress. It was only weeks later that I learned they are some of the most highly qualified in the country.",
  ],
  benefits: [
    "Reduced stress and more energy",
    "Improved sense of wellbeing",
    "Greater poise, posture, and balance",
    "Better skin tone and complexion, reduction of fine lines",
    "Increased muscle strength and flexibility",
    "Greater concentration and memory recall",
    "More restful sleep, uninterrupted by digestion or other issues overnight",
  ],
  closing: [
    "The list goes on, right down to my fingernails where fluting is less evident and they don't chip or split anymore.",
    "As someone uncomfortable in groups and never a ‘joiner’, I found a place and sense of belonging in the community of TYS that I will always value.",
  ],
};

export const testimonialChapters: TestimonialChapter[] = [
  {
    id: "less-pain",
    title: "Living with less pain",
    intro: "An old spinal injury, arthritis, a sore neck, recovery from major surgery.",
    image: {
      src: "/images/gallery/DSC00115.jpg",
      alt: "A student in a forward fold with head resting on the mat",
      width: 1000,
      height: 563,
    },
    stories: [
      {
        name: "Cleo Legge",
        role: "Student",
        paragraphs: [
          "I rotated 6 vertebra in a snowboarding accident in 2002. Doing yoga a few times a week (the more, the better) helps me live without pain. If I miss a week or 2 of classes, the pain comes back.",
        ],
      },
      {
        name: "David Dobinson",
        role: "Student",
        paragraphs: [
          "Practicing yoga for over 2 years has given me much improved flexibility in all joints and my arthritic pain has virtually disappeared. Improved breathing technique has also resulted in a calmer disposition.",
        ],
      },
      {
        name: "Erin",
        role: "Student",
        highlight: "It has also helped me on my journey of recovering from a major surgery.",
        paragraphs: [
          "Before coming to The Yoga school I thought I had been practicing yoga... little did I know that I had only just been touching the surface and my practice was about to transform entirely.",
          "The Yoga School teachers have such a thorough, detailed understanding of the entire human body. Their verbal cueing on how to access each and every posture is exceptional and of a standard I have never experienced before.",
          "Practicing at The Yoga School has helped me on an emotional level through an extremely challenging period of life. It has also helped me on my journey of recovering from a major surgery and the subsequent functional misalignments I have experienced in my body.",
          "Thank you so much to each teacher at The Yoga School for offering such a wonderful space to learn, transform and feel at home. Cairns is very blessed to have such a great school.",
        ],
      },
      {
        name: "Judy Chapell",
        role: "Private therapy session with Nicky Knoff for neck pain",
        paragraphs: [
          "Dear Nicky, Please accept my sincere gratitude and thanks. I feel honoured and nurtured to have been with you yesterday for the private session. I had the best nights sleep and am awake early ready to do my neck exercises.",
        ],
      },
    ],
  },
  {
    id: "calmer-mind",
    title: "A calmer mind",
    intro: "Years of insomnia, a toxic workplace, a bleak stretch of life.",
    image: {
      src: "/images/gallery/DSC00200.jpg",
      alt: "Students sitting cross-legged in meditation",
      width: 1000,
      height: 563,
    },
    stories: [
      {
        name: "Leon Gordon",
        role: "Student for about 20 years",
        highlight: "Now I look forward to 5:30 am when I can rise and shine and stretch.",
        paragraphs: [
          "I started Yoga classes during a bleak period in my life, about 20 years ago. While no magic fairy dust transformed me, my whole outlook is different now.",
          "Insomnia used to be my plague, lying awake and beating myself up because I should be asleep and recharging my batteries but my mind wouldn’t shutdown. Yoga has taught me to do that. Now I look forward to 5:30 am when I can rise and shine and stretch for 30 to 40 minutes.",
          "For me, it’s better than sleeping in and way better than insomnia… Yoga is a very welcome part of my life. Thanks to all Yoga teachers.",
        ],
      },
      {
        name: "Regular student",
        role: "Name withheld",
        paragraphs: [
          "My friend introduced me to yoga; we both worked together in a very toxic work environment, which was damaging to my mind and soul. Yoga, and especially The Yoga School’s teaching style, has given me the confidence and the determination to set up my own business. Yoga will now be a huge part of my life.",
        ],
      },
      {
        name: "Judy Chappell",
        role: "Long-term student at The Yoga School",
        paragraphs: [
          "Thank you for the Chakra Meditation which I have recently purchased. I have just given the time to listening and reading. What a clear simple helpful and informative presentation you have developed for us. It was a pleasure to watch listen and learn. I will find the technique most helpful I am sure.",
        ],
      },
    ],
  },
  {
    id: "breath",
    title: "Breathing fully",
    intro: "Lung capacity for a hill run, and breathing techniques for a birth.",
    image: {
      src: "/images/gallery/DSC00090edit.jpg",
      alt: "Students standing with arms raised in prayer overhead",
      width: 1000,
      height: 714,
    },
    stories: [
      {
        name: "Adam Phillips",
        role: "Teacher training graduate",
        highlight: "I never knew how little of a lung capacity I had until now.",
        paragraphs: [
          "I regularly attempted to run up Earl Hill, but could not run all the way to the top, I could always only get around half way.",
          "Long story short I damaged my MCL in my Right Knee and put me out of action, I could not run anymore.",
          "I had my teacher training course with Knoff Yoga which is a 3 week intensive course.",
          "Total time with my injury and teacher training time, meant I had not ran at all or attempted Earl Hill for 3 months.",
          "After my teacher training I went back and ran up 3/4 of the way. Couple of days after I attempted it again and could run the whole of Earl Hill and have been ever since.",
          "My lung capacity was not there before my teacher training course. Now my lungs are able to expand further to allow a full breath and supply my body with more oxygen. Allowing me to have enough fuel to reach the top of Earl Hill, running.",
          "To go from never being able to run Earl Hill, then not running at all for 3 months and then suddenly being able to run all the way to the top, was 100% due to an increase in Lung Volume. The Yoga Postures and Pranayama (Breathing exercises) allowed the surrounding muscles of my Thoracic Cavity (rib cage area) to release and my lungs can expand further. This along with the strengthening of my Diaphragm.",
          "I never knew how little of a lung capacity I had until now and it also continues to expand further. Every week I am noticing a little extra with my breathing. There are many more improvements in my overall health and wellbeing thanks to the Knoff Yoga System and the teachers.",
        ],
      },
      {
        name: "Tanya and Quinn",
        role: "Yoga through pregnancy",
        highlight: "I had a beautiful birth and I attribute a lot of this to Knoff yoga system and the breathing techniques I learnt at the school.",
        paragraphs: [
          "I want to say a very big thank you to Nicki, James and the entire Knoff Yoga teaching staff for supporting and nurturing me and my baby through my yoga practice during pregnancy. Your guidance allowed me to continue to practice yoga asana safely, with suitable adjustments and modifications right up to the day of my birth.",
          "I felt so much support and kindness from the entire Knoff yoga community, including other students at the school. I had a beautiful birth and I attribute a lot of this to Knoff yoga system and the breathing techniques I learnt at the school. See you all back in class soon.",
        ],
      },
    ],
  },
  {
    id: "teachers",
    title: "Letters from teachers",
    intro: "Yoga teachers writing to Nicky and James Knoff.",
    image: {
      src: "/images/gallery/DSC00019edit.jpg",
      alt: "A teacher giving a student a hands-on adjustment",
      width: 1000,
      height: 563,
    },
    stories: [
      {
        name: "Tess Boes",
        role: "Owner of Yoga Align Australia",
        paragraphs: [
          "Dearest Nicky. Working with you today was amazing, my sincerest gratitude for your mastery and your wisdom. I can't imagine where I would be today if I had not met you many years ago. You have also shown my children a way to live their lives, I could never thank you enough. Thank you for your kind words, they give me much inspiration. My love is always with you xxx.",
        ],
      },
      {
        name: "Tomoko Gregory",
        role: "Knoff Yoga System Teacher",
        highlight: "Teaching and doing the principle of practice is very simple but very powerful.",
        paragraphs: [
          "Dear Nicky, I see you often but every time when I see you I don't have time to talk to you. I decided to write Email instead.",
          "I had 3 new students in my class the other day. They have been doing yoga for about 10 years. As soon as they were on the mat I realised that they didn't know the foundation and any other principles of practice. They have their own habits. After that class I was just thinking about yoga generally. All physical habits come from the habits of our mind which is our ego.",
          "The way you have been teaching us by using the principle of practice leads us to change our old physical incorrect habits. That changes our mental habits and we become free from ego.",
          "Both our body and mind are balanced and have harmony. We feel comfortable physically and mentally. Comfort makes us happy. This is what the difference between yoga and other physical exercise too.",
          "That reminds me that teaching and doing the principle of practice is very simple but very powerful.",
          "There is a possibility that I could have been stuck with my old habits if I went to other yoga school. I can't appreciate enough that you are my teacher. I am so lucky.",
        ],
      },
      {
        name: "Kristin Nelson",
        role: "Fleurieu Yoga",
        highlight: "I feel like you just perfectly articulated everything I’m trying to put out there.",
        paragraphs: [
          "Hello,",
          "I just wanted to say I LOVED JAMES workshop in Adelaide a few weekends back- I got SO much out of it- thank you!!",
          "I've been teaching for ten years now and I feel like you just perfectly articulated everything I'm trying to put out there, so thank you for your skill and clarity in sharing.",
          "I would LOVE a copy of your closing words/ prayers you use if you are open to sharing? Your words resonated beautifully.",
          "Many Thanks :).",
        ],
      },
    ],
  },
];

export const memberships: Membership[] = [
  {
    name: "Yoga Only",
    description: "Unlimited access to all regular TYS yoga classes.",
    priceLabel: "$80",
    period: "fortnight",
    terms: "Minimum 12-week commitment",
    features: [
      "Knoff Yoga, Yin Yoga & Chair Yoga",
      "Monthly Sunday Sessions",
      "10% off retail · $10 child’s passes",
      "1 free pass a month for a friend or family member",
    ],
    badge: null,
    featured: false,
    ctaLabel: "Join Yoga Only",
    ctaUrl: "/pages/contact-us?enquiry=Yoga%20Only%20membership",
  },
  {
    name: "Everything",
    description: "All TYS yoga plus Shoshin strength & mobility classes.",
    priceLabel: "$98",
    period: "fortnight",
    terms: "Minimum 12-week commitment",
    features: [
      "Unlimited yoga & Shoshin classes",
      "Monthly Sunday Sessions",
      "10% off retail · $10 child’s passes",
      "1 free pass a month for a friend or family member",
    ],
    badge: "All access",
    featured: true,
    ctaLabel: "Join Everything",
    ctaUrl: "/pages/contact-us?enquiry=Everything%20membership",
  },
  {
    name: "Shoshin Only",
    description: "Unlimited access to all Shoshin strength & mobility classes.",
    priceLabel: "$80",
    period: "fortnight",
    terms: "Minimum 12-week commitment",
    features: [
      "All Shoshin strength & mobility classes",
      "10% off retail",
      "$10 child’s passes",
      "1 free pass a month for a friend or family member",
    ],
    badge: null,
    featured: false,
    ctaLabel: "Join Shoshin Only",
    ctaUrl: "/pages/contact-us?enquiry=Shoshin%20Only%20membership",
  },
];

export const passes: PassGroup[] = [
  {
    title: "Drop in",
    items: [
      {
        name: "Adult",
        price: "$35",
        url: "https://momence.com/The-Yoga-School/membership/1-Class-Pass/54228",
      },
      {
        name: "Child (aged 6–12)",
        price: "$14",
        url: "https://momence.com/The-Yoga-School/membership/Child---1-Class-Pass./54244",
      },
    ],
    note: null,
  },
  {
    title: "Chair Yoga passes",
    items: [
      {
        name: "1 class",
        price: "$20",
        url: "https://momence.com/The-Yoga-School/membership/Chair-Yoga---1-Class-Pass/54227",
      },
      {
        name: "5 classes",
        price: "$100",
        url: "https://momence.com/The-Yoga-School/membership/Chair-Yoga---5-Class-Pass/54242",
      },
    ],
    note: null,
  },
  {
    title: "Class passes",
    items: [
      {
        name: "5 classes",
        price: "$120",
        url: "https://momence.com/The-Yoga-School/membership/5-Class-Pass/54230",
      },
      {
        name: "20 classes",
        price: "$360",
        url: "https://momence.com/The-Yoga-School/membership/20-Class-Pass/54232",
      },
    ],
    note: "5-class valid 6 months, 20-class valid 12 months from first use. Expiry dates can’t be extended.",
  },
  {
    title: "Unlimited passes",
    items: [
      {
        name: "180 days (max 3-week hold)",
        price: "$1,045",
        url: "https://momence.com/The-Yoga-School/membership/6-Months-up-front-(180-days)/54239",
      },
      {
        name: "365 days (max 6-week hold)",
        price: "$1,969",
        url: "https://momence.com/The-Yoga-School/membership/12-Months-up-front-(365-days)/54240",
      },
    ],
    note: "Includes all Yoga and Shoshin classes, 10% off retail, $10 child’s passes and 1 complimentary pass per month for a friend or family member.",
  },
  {
    title: "Private classes",
    items: [
      {
        name: "1 person: 60 / 90 min",
        price: "$120 / $160",
      },
      {
        name: "Pack of 4: 60 / 90 min (each)",
        price: "$105 / $145",
      },
      {
        name: "2 people: 60 / 90 min",
        price: "$160 / $200",
      },
    ],
    note: "Call 0412 499 700 to book. 4-pack prepaid, valid 12 months. Additional group classes: prices on request.",
  },
];

export const products: Product[] = [
  {
    name: "Timber meditation seat",
    category: "Meditation",
    description: "A quality timber meditation seat, locally made to our specifications and purchased directly from us.",
    priceLabel: "Enquire in studio",
    image: {
      src: "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/meditation-stool-336x280.jpg",
      alt: "Timber meditation seat",
      width: 336,
      height: 280,
    },
    ctaLabel: "Enquire",
    ctaUrl: "/pages/contact-us",
  },
  {
    name: "Props & equipment",
    category: "Props",
    description: "Browse yoga props and equipment in our online shop.",
    priceLabel: "Online",
    image: {
      src: "/images/gallery/DSC00140.jpg",
      alt: "Yoga blocks and mats in use during class",
      width: 1000,
      height: 649,
    },
    ctaLabel: "Shop now",
    ctaUrl: "https://momence.com/The-Yoga-School/products/23652",
  },
];
