# كلية الحاسبات والمعلومات — جامعة العريش

موقع تفاعلي رسمي لكلية الحاسبات والمعلومات بجامعة العريش. Arabic-first, RTL, "Digital Academic Glass" design system.

## البنية

```
fci-arish/
├── index.html
├── css/
│   ├── style.css          # design tokens, reset, nav, footer, glass primitives
│   ├── departments.css    # department cards + full-screen department experience
│   ├── animations.css     # scroll-reveal + shared motion utilities
│   └── responsive.css     # breakpoint overrides
├── js/
│   ├── content.js         # single source of truth for real faculty content
│   ├── navigation.js      # nav scroll state, mobile menu, scroll-spy
│   ├── animations.js      # preloader + generic reveal engine
│   ├── departments.js     # full-screen department experience controller
│   ├── interactions.js    # card/stat/gallery micro-interactions
│   └── app.js             # entry point + service worker registration
├── assets/
│   ├── logos/              # official Arish University + FCI logos (as supplied)
│   ├── faculty/             # real faculty building photo (+ optimized JPEG)
│   ├── departments/         # department-specific visuals (added as built)
│   ├── icons/
│   └── images/
├── manifest.json
├── sw.js
└── README.md
```

## حالة البناء (Build status)

يُبنى الموقع قسمًا بقسم حسب طلب العميل. الحالة الحالية:

- [x] هيكل الملفات + نظام التصميم الأساسي (tokens, reset, glass primitives)
- [x] شريط التنقل (Nav) — شفاف يتحول إلى زجاجي عند التمرير، قائمة جوال، scroll-spy
- [x] الفوتر (Footer)
- [x] PWA shell (manifest + service worker)
- [ ] Hero Section
- [ ] عن الكلية (About)
- [ ] المسارات الأكاديمية + تجربة القسم كاملة الشاشة
- [ ] لماذا الكلية
- [ ] نظام الدراسة
- [ ] الحياة الأكاديمية
- [ ] قسم QR
- [ ] الدعوة الختامية (Final CTA)

## قاعدة سلامة المحتوى (Content Integrity)

كل الحقائق والإحصائيات الحقيقية موجودة فقط في `js/content.js`. أي حقل لا يزال `null` أو مصفوفة فارغة يعني أن المحتوى الرسمي لم يُؤكَّد بعد — يجب أن يظهر في الواجهة كعنصر نائب (placeholder) وليس كرقم أو ادعاء مُختلَق.

## الأصول (Assets)

- الشعارات محفوظة كما وردت دون إعادة إنشاء أو تعديل، بامتداد PNG شفاف.
- صورة المبنى الحقيقية محفوظة بصيغتها الأصلية، مع نسخة JPEG محسّنة للأداء (`assets/faculty/building-optimized.jpg`) تُستخدم في الواجهة بدلاً من الأصل الكبير 1.8MB.
