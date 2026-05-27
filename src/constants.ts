import { Property, PropertyType } from './types/property';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'عمارت دوکله کلاسیک ولیعصر',
    description: 'ویلای لوکس کلاسیک طراحی شده توسط معمار بنام تبریز در بهترین کوی ولیعصر تبریز. نمای رومی پرکار، سنگ تراورتن عباس‌آباد درجه یک، استخر سرپوشیده، سونا، جکوزی و شاه‌نشین مجلل.',
    price: 185000000000,
    type: PropertyType.HOUSE,
    location: { lat: 38.0722, lng: 46.3451, address: 'تبریز، کوی ولیعصر، خیابان همام تبریزی' },
    bedrooms: 5,
    bathrooms: 6,
    area: 650,
    yearBuilt: 1401,
    images: [
      './public/images/Ads/1.jpg',
      './public/images/Ads/2.jpg',
      './public/images/Ads/3.jpg'
    ],
    virtualTourUrl: 'https://kuula.co/post/79WNW',
    createdAt: Date.now() - 3600000 * 4,
    isFeatured: true,
    ownerId: 'admin1',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'گرمایش مرکزی', 'استخر', 'سونا', 'روف گاردن']
  },
  {
    id: '2',
    title: 'پنت‌هاوس مدرن برج ائل‌گلی',
    description: 'واحد فوق‌العاده با ویوی ۳۶۰ درجه مستقیم به استخر ائل‌گلی تبریز. دارای تراس گاردن چیدمان شده به متراژ ۵۰ متر، ارتفاع سقف ۴ متر و متریال لوکس وارداتی.',
    price: 95000000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0245, lng: 46.3712, address: 'تبریز، بلوار ائل‌گلی، مشرف به پارک ائل گلی' },
    bedrooms: 4,
    bathrooms: 5,
    area: 380,
    yearBuilt: 1402,
    videoUrl: './public/images/Ads/19.jpg',
    images: [
      './public/images/Ads/3.jpg',
      './public/images/Ads/2.jpg',
      './public/images/Ads/1.jpg'
    ],
    virtualTourUrl: 'https://kuula.co/post/79WNW',
    createdAt: Date.now() - 3600000 * 24,
    isFeatured: true,
    ownerId: 'admin1',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'استخر', 'روف گاردن']
  },
  {
    id: '3',
    title: 'ویلای دوبلکس نوساز رشدیه',
    description: 'ویلای لوکس هوشمند تمام بتن در محله اعیان‌نشین رشدیه تبریز. دارای سیستم خانه هوشمند KNX، سالن سینما، روف گاردن و حیاط سرسبز با درختان خاص.',
    price: 120000000000,
    type: PropertyType.HOUSE,
    location: { lat: 38.0945, lng: 46.3312, address: 'تبریز، شهرک رشدیه، خیابان بهارستان' },
    bedrooms: 4,
    bathrooms: 4,
    area: 480,
    yearBuilt: 1400,
    images: [
      './public/images/Ads/4.jpg',
      './public/images/Ads/1.jpg',
      './public/images/Ads/3.jpg'
    ],
    createdAt: Date.now() - 3600000 * 48,
    ownerId: 'admin2',
    features: ['پارکینگ', 'انباری', 'گرمایش مرکزی', 'استخر', 'روف گاردن']
  },
  {
    id: '4',
    title: 'دفتر اداری شیک چهارراه آبرسان',
    description: 'یک واحد اداری با موقعیت بی‌نظیر اقتصادی در قلب تجاری تبریز (آبرسان). کاملا بازسازی شده و مدرن، مناسب هلدینگ‌ها، مطب پزشکی یا دفاتر بازرگانی.',
    price: 28000000000,
    type: PropertyType.OFFICE,
    location: { lat: 38.0701, lng: 46.3195, address: 'تبریز، چهارراه آبرسان، برج سفید آبرسان' },
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    yearBuilt: 1398,
    images: [
      './public/images/Ads/5.jpg',
      './public/images/Ads/6.jpg',
      './public/images/Ads/1.jpg',
    ],
    createdAt: Date.now() - 3600000 * 72,
    ownerId: 'admin1',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'گرمایش مرکزی']
  },
  {
    id: '5',
    title: 'سه خوابه خوش‌نقشه زعفرانیه',
    description: 'آپارتمان نوساز کلید نخورده در دنج‌ترین فرعی زعفرانیه تبریز. نورگیری از سه طرف، سالن پذیرایی وسیع و بدون پرتی، متریال درجه یک.',
    price: 24000000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0512, lng: 46.3421, address: 'تبریز، زعفرانیه، خیابان ۳۰ متری مسجد' },
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    yearBuilt: 1401,
    images: [
      './public/images/Ads/7.jpg',
      './public/images/Ads/8.jpg',
      './public/images/Ads/10.jpg'
    ],
    createdAt: Date.now() - 3600000 * 96,
    ownerId: 'admin2',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'گرمایش مرکزی']
  },
  {
    id: '6',
    title: 'پنت‌هاوس شیک و دلباز یاغچیان',
    description: 'پنت‌هاوس شیک و استثنایی با ویوی باز به کوه عینالی در یاغچیان تبریز. مجهز به لاندری روم، جکوزی داخل واحد و مطبخ وسیع.',
    price: 32000000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0431, lng: 46.3621, address: 'تبریز، شهرک یاغچیان، خیابان توحید' },
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    yearBuilt: 1402,
    videoUrl: './public/images/Ads/19.jpg',
    images: [
      './public/images/Ads/9.jpg',
      './public/images/Ads/10.jpg',
      './public/images/Ads/12.jpg'
    ],
    createdAt: Date.now() - 3600000 * 120,
    ownerId: 'admin1',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'گرمایش مرکزی', 'روف گاردن']
  },
  {
    id: '7',
    title: 'آپارتمان نوساز کوی میرداماد',
    description: 'سه خوابه غرق در نور، آشپزخانه تمام ممبران، همسایگان عالی و ساخت بی‌نظیر توسط سازنده خوش‌نام منطقه میرداماد تبریز.',
    price: 19500000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0355, lng: 46.3481, address: 'تبریز، شهرک میرداماد، کوچه اصلی' },
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    yearBuilt: 1401,
    images: [
      './public/images/Ads/11.jpg',
      './public/images/Ads/12.jpg',
      './public/images/Ads/13.jpg'
    ],
    createdAt: Date.now() - 3600000 * 144,
    ownerId: 'admin3',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'گرمایش مرکزی']
  },
  {
    id: '8',
    title: 'ویلای تریپلکس ولیعصر جنوبی',
    description: 'بافت کاملا اعیان‌نشین، دسترسی عالی، دارای سالن بازی مستقل و استخر آب گرم مجهز با موتورخانه اروپایی در کوی مخابرات.',
    price: 165000000000,
    type: PropertyType.HOUSE,
    location: { lat: 38.0581, lng: 46.3512, address: 'تبریز، ولیعصر جنوبی، کوی مخابرات' },
    bedrooms: 5,
    bathrooms: 5,
    area: 550,
    yearBuilt: 1399,
    images: [
      './public/images/Ads/12.jpg',
      './public/images/Ads/13.jpg',
      './public/images/Ads/14.jpg'
    ],
    createdAt: Date.now() - 3600000 * 200,
    ownerId: 'admin2',
    features: ['پارکینگ', 'انباری', 'استخر', 'سونا', 'روف گاردن']
  },
  {
    id: '9',
    title: 'زمین کلنگی عالی در خیابان ششگلان',
    description: 'مناسب ساخت آپارتمان چند طبقه یا هتل در یکی از با اصالت‌ترین و تاریخی‌ترین نقاط شهر تبریز با بر مناسب.',
    price: 47000000000,
    type: PropertyType.LAND,
    location: { lat: 38.0805, lng: 46.3051, address: 'تبریز، خیابان ششگلان، کوی میر شفیع' },
    bedrooms: 0,
    bathrooms: 0,
    area: 320,
    yearBuilt: 1370,
    images: [
      './public/images/Ads/14.jpg',
      './public/images/Ads/15.jpg',
      './public/images/Ads/16.jpg'
    ],
    createdAt: Date.now() - 3600000 * 250,
    ownerId: 'admin1',
    features: ['انباری']
  },
  {
    id: '10',
    title: 'واحد شخصی‌ساز کلید نخورده مارالان',
    description: 'یک واحد خوش‌نقشه و با کیفیت ساخت عالی در منطقه‌ای امن و دنج در مارالان تبریز. نما رومی نورپردازی شده.',
    price: 12500000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0598, lng: 46.3112, address: 'تبریز، خیابان مارالان، بالاتر از سجادیه' },
    bedrooms: 2,
    bathrooms: 2,
    area: 115,
    yearBuilt: 1403,
    videoUrl: './public/images/Ads/19.jpg',
    images: [
      './public/images/Ads/15.jpg',
      './public/images/Ads/16.jpg',
      './public/images/Ads/11.jpg'
    ],
    createdAt: Date.now() - 3600000 * 30,
    ownerId: 'admin3',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'گرمایش مرکزی']
  },
  {
    id: '11',
    title: 'سند دار سه خوابه رشدیه',
    description: 'واحد شیک با پنجره‌های قدی در یکی از بهترین کوی‌های رشدیه تبریز (محله الهیه). کابینت های‌گلس، کناف‌کاری حرفه‌ای و گرمایش از کف.',
    price: 29000000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0905, lng: 46.3402, address: 'تبریز، شهرک رشدیه، الهیه، کوی یاس' },
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    yearBuilt: 1401,
    images: [
      './public/images/Ads/3.jpg',
      './public/images/Ads/11.jpg',
      './public/images/Ads/18.jpg'
    ],
    createdAt: Date.now() - 3600000 * 15,
    ownerId: 'admin2',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'گرمایش مرکزی']
  },
  {
    id: '12',
    title: 'تک‌واحدی مجلل کوی صفی ولیعصر',
    description: 'سازه‌ای مارکدار با سیستم تهویه مطبوع مرکزی چیلر رفت و برگشت، شیرآلات توکار آلمانی، آشپزخانه مجهز کثیف و تمیز در ولیعصر تبریز.',
    price: 80000000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0705, lng: 46.3498, address: 'تبریز، کوی ولیعصر، کوی صفی' },
    bedrooms: 3,
    bathrooms: 3,
    area: 260,
    yearBuilt: 1402,
    images: [
      './public/images/Ads/17.jpg',
      './public/images/Ads/18.jpg',
      './public/images/Ads/20.jpg'
    ],
    createdAt: Date.now() - 3600000 * 8,
    ownerId: 'admin1',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'استخر', 'سونا', 'روف گاردن']
  },
  {
    id: '13',
    title: 'آپارتمان سوپرلوکس ویو ابدی ائل‌گلی',
    description: 'غرق در نور با بالکن بزرگ و قابل چیدمان مستقیم رو به استخر شاه‌گلی ائل‌گلی تبریز. سونا خشک مستقل داخل واحد، سرایداری ۲۴ ساعته.',
    price: 72000000000,
    type: PropertyType.APARTMENT,
    location: { lat: 38.0268, lng: 46.3745, address: 'تبریز، جاده ائل‌گلی، کوی فردوس' },
    bedrooms: 3,
    bathrooms: 3,
    area: 240,
    yearBuilt: 1402,
    videoUrl: './public/images/Ads/19.jpg',
    images: [
      './public/images/Ads/19.jpg',
      './public/images/Ads/20.jpg',
      './public/images/Ads/14.jpg'
    ],
    createdAt: Date.now() - 3600000 * 2,
    ownerId: 'admin1',
    features: ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'گرمایش مرکزی', 'استخر', 'روف گاردن']
  },
  {
    id: '14',
    title: 'زمین باغ مسکونی قطعه خاص ولیعصر',
    description: 'یکی از معدود باغات مسکونی سند شش‌دانگ باقی‌مانده در محدوده ولیعصر تبریز با درختان بارده قدیمی و موقعیت ساخت عالی.',
    price: 110000000000,
    type: PropertyType.LAND,
    location: { lat: 38.0641, lng: 46.3551, address: 'تبریز، کوی ولیعصر، فرعی دنج همام تبریزی' },
    bedrooms: 0,
    bathrooms: 0,
    area: 850,
    yearBuilt: 1390,
    videoUrl: './public/images/Ads/19.jpg',
    images: [
      './public/images/Ads/14.jpg',
      './public/images/Ads/20.jpg',
      './public/images/Ads/14.jpg'
    ],
    createdAt: Date.now() - 3600000 * 240,
    ownerId: 'admin2',
    features: ['پارکینگ', 'انباری']
  }
];
