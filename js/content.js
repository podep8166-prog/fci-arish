/* ===================================================================
   CONTENT — single source of truth for all real faculty content.
   RULE: never hardcode a stat/fact/claim directly in HTML or other JS
   files. Add it here. Anything not yet officially confirmed by the
   faculty must stay as null / TODO — it must render as a placeholder
   in the UI, never as an invented number or claim.
   =================================================================== */

const FCI_CONTENT = {
  university: {
    name_ar: 'جامعة العريش',
    name_en: 'Arish University',
    founded: 2016
  },
  faculty: {
    name_ar: 'كلية الحاسبات والمعلومات',
    name_en: 'Faculty of Computers and Information'
  },
  stats: {
    credit_hours: null,        // TODO: confirm official value before displaying anywhere
    departments_count: 3
  },
  // NOTE: summary_ar / learn_ar / core_areas_ar / career_paths_ar below are
  // DRAFT placeholder copy — general, field-level descriptions (not specific
  // claims about this faculty's courses, achievements, or job guarantees).
  // Replace with the faculty's official copy before publishing.
  departments: [
    {
      id: 'cs',
      order: '01',
      icon: 'cpu',
      color: '#3C7FC9',
      colorDeep: '#12335C',
      name_ar: 'علوم الحاسب',
      name_en: 'Computer Science',
      summary_ar: 'مسار يركّز على الأسس النظرية والعملية لعلوم الحاسب، من الخوارزميات وهياكل البيانات إلى هندسة البرمجيات والذكاء الاصطناعي، ليؤهّل الطالب لفهم كيف تُبنى الأنظمة الذكية من الداخل.',
      learn_ar: [
        'حل المشكلات برمجياً',
        'بناء وتطوير البرمجيات',
        'تصميم الخوارزميات',
        'التعامل مع هياكل البيانات',
        'تطوير حلول حاسوبية ذكية'
      ],
      core_areas_ar: [
        'البرمجة', 'الخوارزميات وهياكل البيانات', 'هندسة البرمجيات', 'الذكاء الاصطناعي', 'أسس الحوسبة'
      ],
      career_paths_ar: ['الذكاء الاصطناعي', 'تعلم الآلة', 'علم البيانات', 'الحوسبة المتقدمة', 'الأنظمة الذكية']
    },
    {
      id: 'is',
      order: '02',
      icon: 'network',
      color: '#2C7A52',
      colorDeep: '#0F3D28',
      name_ar: 'نظم المعلومات',
      name_en: 'Information Systems',
      summary_ar: 'مسار يجمع بين التقنية وإدارة الأعمال، ويؤهّل الطالب لتصميم وإدارة نظم المعلومات التي تدعم قرارات المؤسسات، ويربط بين الفكر التقني والفكر الإداري في بيئة رقمية متكاملة.',
      learn_ar: [
        'تحليل احتياجات المؤسسات',
        'تحليل وتصميم نظم المعلومات',
        'إدارة وتنظيم البيانات',
        'تحليل الأعمال والمعلومات',
        'استخدام التكنولوجيا لدعم اتخاذ القرار'
      ],
      core_areas_ar: [
        'نظم المعلومات', 'قواعد البيانات', 'تحليل وتصميم النظم', 'تحليل الأعمال', 'إدارة المعلومات'
      ],
      career_paths_ar: ['ذكاء الأعمال', 'تحليل البيانات', 'نظم دعم القرار', 'التحول الرقمي', 'أنظمة المؤسسات']
    },
    {
      id: 'it',
      order: '03',
      icon: 'server',
      color: '#1E4F8C',
      colorDeep: '#0A1F3D',
      name_ar: 'تكنولوجيا المعلومات',
      name_en: 'Information Technology',
      summary_ar: 'مسار يركّز على البنية التحتية الرقمية بكل عناصرها: الشبكات، الحوسبة السحابية، وإدارة الأنظمة والأمن السيبراني، ليؤهّل الطالب لبناء وتشغيل البيئات التقنية التي تعتمد عليها المؤسسات يوميًا.',
      learn_ar: [
        'إدارة الشبكات',
        'تشغيل وإدارة البنية التحتية',
        'التعامل مع أنظمة التشغيل',
        'إدارة الخدمات التقنية',
        'بناء وإدارة البيئات التقنية'
      ],
      core_areas_ar: [
        'الشبكات', 'أنظمة التشغيل', 'البنية التحتية', 'خدمات تقنية المعلومات', 'أمن المعلومات'
      ],
      career_paths_ar: ['الحوسبة السحابية', 'أمن المعلومات', 'DevOps', 'البنية التحتية الحديثة', 'حلول تقنية المعلومات']
    }
  ],
  contact: {
    address_ar: null, // TODO: confirm official address
    university_url: 'https://aru.edu.eg/',
    university_facebook_url: 'https://www.facebook.com/share/19DnTf4kBQ/',
    faculty_facebook_url: 'https://www.facebook.com/share/1eHNq8VyCc/',
    qr_target_url: 'https://aru.edu.eg/',
    qr_image: 'assets/images/qr-aru.jpg'
  }
};
