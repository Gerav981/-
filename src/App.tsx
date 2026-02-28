/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  PenTool, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  FileText, 
  Mail, 
  Send, 
  ChevronDown, 
  Instagram, 
  Twitter, 
  Facebook, 
  Globe,
  CheckCircle2,
  Quote,
  Github,
  Linkedin,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Translations ---
type Language = 'ru' | 'uz' | 'en';

const translations = {
  ru: {
    nav: {
      home: 'Главная',
      services: 'Услуги',
      portfolio: 'Портфолио',
      reviews: 'Отзывы',
      about: 'Обо мне',
      faq: 'FAQ',
      contact: 'Контакты'
    },
    hero: {
      title: 'Профессиональный копирайтинг и рерайтинг на заказ',
      subtitle: 'Качественные тексты для бизнеса и личных нужд. Мы создаем контент, который продает и вдохновляет.',
      cta: 'Заказать'
    },
    services: {
      title: 'Наши Услуги',
      items: [
        {
          title: 'Написание статей',
          desc: 'Информационные, экспертные и развлекательные статьи для блогов и СМИ.',
          price: 'от 800 руб. за 1000 зн.',
          icon: <PenTool className="w-8 h-8" />
        },
        {
          title: 'SEO-тексты',
          desc: 'Оптимизированный контент для поисковых систем, повышающий позиции вашего сайта.',
          price: 'от 1000 руб. за 1000 зн.',
          icon: <Search className="w-8 h-8" />
        },
        {
          title: 'Рерайтинг',
          desc: 'Качественная переработка существующих текстов с сохранением смысла и высокой уникальностью.',
          price: 'от 500 руб. за 1000 зн.',
          icon: <RefreshCw className="w-8 h-8" />
        },
        {
          title: 'Слоганы и Маркетинг',
          desc: 'Креативные слоганы, нейминг и продающие тексты для рекламы.',
          price: 'от 3000 руб. за проект',
          icon: <MessageSquare className="w-8 h-8" />
        }
      ]
    },
    portfolio: {
      title: 'Портфолио',
      readMore: 'Читать полностью',
      items: [
        {
          title: 'Разработка стратегии отзывов для сферы услуг',
          preview: 'Создание и управление репутацией для бизнесов в сфере услуг. Разработка стратегии органичных отзывов для повышения рейтинга и доверия клиентов по всему миру.',
          full: 'Полный кейс: Разработана комплексная стратегия по управлению репутацией для сети клиентских сервисов. За 3 месяца было создано и размещено более 80 уникальных, нативных отзывов на ключевых платформах. В результате средний рейтинг компании вырос с 3.8 до 4.7, а конверсия из поисковых систем увеличилась на 40%.'
        },
        {
          title: 'SEO-оптимизация для E-commerce',
          preview: 'Написание продающих SEO-текстов для категорий и карточек товаров интернет-магазинов. Увеличение органического трафика и видимости в поисковых системах.',
          full: 'Полный кейс: Для крупного e-commerce проекта было создано более 50 SEO-оптимизированных описаний для категорий товаров. Тексты были насыщены LSI-ключами и структурированы для улучшения поведенческих факторов. Спустя 2 месяца 70% категорий вышли в ТОП-10 поисковых систем по высокочастотным запросам, увеличив органический трафик на 60%.'
        },
        {
          title: 'Контент-маркетинг для IT-компаний',
          preview: 'Ведение блога для компании, занимающейся разработкой мобильных приложений. Экспертные статьи для привлечения B2B-клиентов.',
          full: 'Полный кейс по контент-маркетингу: Разработан контент-план и написано 12 экспертных статей для блога IT-компании. Темы включали сравнение технологий, разбор кейсов и тренды в разработке. Статьи активно распространялись в профильных сообществах. За 6 месяцев органический трафик на блог вырос в 3 раза, компания получила 5 крупных лидов напрямую из статей.'
        }
      ]
    },
    reviews: {
      title: 'Отзывы клиентов',
      formTitle: 'Оставить отзыв',
      name: 'Имя',
      email: 'Email',
      text: 'Ваш отзыв',
      submit: 'Отправить',
      items: [
        { name: 'Александр В.', text: 'Работа выполнена в срок, тексты очень качественные. Рекомендую!' },
        { name: 'Марина К.', text: 'Отличный SEO-копирайтинг. Позиции сайта заметно выросли через месяц.' },
        { name: 'Иван П.', text: 'Быстрый и грамотный рерайт. Уникальность 100%.' }
      ]
    },
    about: {
      title: 'Обо мне',
      text: 'Я — копирайтер, который работает с клиентами по всему миру. Мой «удаленный офис» — это сочетание опыта и передовых технологий. Я использую нейросети для глубокой аналитики рынка и проверки каждого текста, что позволяет мне создавать контент, который точно попадает в цель. Это мое конкурентное преимущество перед обычными копирайтерами. Моя цель — помочь вашему бизнесу заговорить на языке клиента, где бы он ни находился.'
    },
    faq: {
      title: 'Часто задаваемые вопросы',
      items: [
        { q: 'Какие сроки выполнения работы?', a: 'Сроки зависят от объема и сложности задачи. Например, SEO-статья на 5000 знаков обычно готова в течение 2-3 рабочих дней. Я всегда оговариваю дедлайны заранее и строго их соблюдаю.' },
        { q: 'Как проверяется уникальность?', a: 'Все тексты проходят проверку на уникальность через сервис Text.ru (базовая проверка) или по вашему запросу через любой другой сервис, например, Advego. Я гарантирую уникальность не ниже 95% для всех работ.' },
        { q: 'Работаете ли вы по ТЗ?', a: 'Да, работа по четкому техническому заданию — это основа качественного результата. Я внимательно изучаю ТЗ, задаю уточняющие вопросы и строго следую всем требованиям.' },
        { q: 'Есть ли скидки на большие объемы?', a: 'Конечно. При заказе текстов общим объемом от 20 000 знаков в месяц предоставляется скидка 10%. Для постоянных клиентов действуют индивидуальные условия.' }
      ]
    },
    footer: {
      copy: '© 2024 CopyPro Services. Все права защищены.'
    }
  },
  uz: {
    nav: {
      home: 'Asosiy',
      services: 'Xizmatlar',
      portfolio: 'Portfolio',
      reviews: 'Sharhlar',
      about: 'Men haqimda',
      faq: 'FAQ',
      contact: 'Kontaktlar'
    },
    hero: {
      title: 'Professional kopirayting va rerayting xizmatlari',
      subtitle: 'Biznes va shaxsiy ehtiyojlar uchun sifatli matnlar. Biz sotadigan va ilhomlantiradigan kontent yaratamiz.',
      cta: 'Buyurtma berish'
    },
    services: {
      title: 'Bizning Xizmatlar',
      items: [
        {
          title: 'Maqolalar yozish',
          desc: 'Bloglar va OAV uchun axborot beruvchi, ekspertlik va ko\'ngilochar maqolalar.',
          price: '1000 belgi uchun 50 000 so\'mdan',
          icon: <PenTool className="w-8 h-8" />
        },
        {
          title: 'SEO-matnlar',
          desc: 'Qidiruv tizimlari uchun optimallashtirilgan, saytingiz reytingini oshiruvchi kontent.',
          price: '1000 belgi uchun 70 000 so\'mdan',
          icon: <Search className="w-8 h-8" />
        },
        {
          title: 'Rerayting',
          desc: 'Mavjud matnlarni ma\'nosini saqlagan holda yuqori unikallik bilan qayta ishlash.',
          price: '1000 belgi uchun 30 000 so\'mdan',
          icon: <RefreshCw className="w-8 h-8" />
        },
        {
          title: 'Sloganlar va Marketing',
          desc: 'Kreativ sloganlar, neyming va reklama uchun sotuvchi matnlar.',
          price: 'Loyiha uchun 200 000 so\'mdan',
          icon: <MessageSquare className="w-8 h-8" />
        }
      ]
    },
    portfolio: {
      title: 'Portfolio',
      readMore: 'To\'liq o\'qish',
      items: [
        {
          title: 'Yandex.Maps uchun tabiiy sharhlar',
          preview: 'Penza va Samara shaharlaridagi kompaniyalar reytingini oshirish uchun organik sharhlar yaratish va joylashtirish. Obro\'ni yaxshilash va mijozlarni jalb qilish.',
          full: 'Tabiiy sharhlar bo\'yicha to\'liq keys: Penza va Samara shaharlaridagi qahvaxonalar tarmog\'ining obro\'sini yaxshilash strategiyasi ishlab chiqildi. 3 oy ichida Yandex.Mapsda 80 dan ortiq unikal, geo-maqsadli sharhlar yozildi va joylashtirildi. Natijada o\'rtacha reyting 3.8 dan 4.7 gacha ko\'tarildi va xaritalardan kelayotgan qo\'ng\'iroqlar soni 40% ga oshdi.'
        },
        {
          title: 'Biznes uchun SEO-tavsiflar',
          preview: 'Maishiy texnika internet-do\'koni kategoriyalari uchun sotuvchi SEO-matnlar yozish. Qidiruv tizimlarida ko\'rinishni oshirish.',
          full: 'SEO-tavsiflar bo\'yicha to\'liq keys: Yirik internet-do\'kon uchun 50 dan ortiq SEO-optimallashtirilgan mahsulot kategoriyalari (muzlatgichlar, kir yuvish mashinalari, televizorlar) uchun tavsiflar yaratildi. Matnlar LSI-kalit so\'zlarni o\'z ichiga olgan va xulq-atvor omillarini yaxshilash uchun tuzilgan. 2 oydan so\'ng kategoriyalarning 70% Yandex va Google qidiruv tizimlarida maqsadli so\'rovlar bo\'yicha TOP-10 ga kirdi.'
        },
        {
          title: 'IT-kompaniyalar uchun kontent-marketing',
          preview: 'Mobil ilovalar ishlab chiqarish bilan shug\'ullanadigan kompaniya uchun blog yuritish. B2B-mijozlarni jalb qilish uchun ekspert maqolalari.',
          full: 'Kontent-marketing bo\'yicha to\'liq keys: IT-kompaniya blogi uchun kontent-reja ishlab chiqildi va 12 ta ekspert maqolasi yozildi. Mavzular texnologiyalarni taqqoslash, keyslarni tahlil qilish va ishlab chiqishdagi trendlarni o\'z ichiga olgan. Maqolalar ixtisoslashgan hamjamiyatlarda faol tarqatildi. 6 oy ichida blogga organik trafik 3 baravar o\'sdi, kompaniya to\'g\'ridan-to\'g\'ri maqolalardan 5 ta yirik lid oldi.'
        }
      ]
    },
    reviews: {
      title: 'Mijozlar sharhlari',
      formTitle: 'Sharh qoldirish',
      name: 'Ism',
      email: 'Email',
      text: 'Sizning sharhingiz',
      submit: 'Yuborish',
      items: [
        { name: 'Alisher V.', text: 'Ish o\'z vaqtida bajarildi, matnlar juda sifatli. Tavsiya qilaman!' },
        { name: 'Malika K.', text: 'Ajoyib SEO-kopirayting. Bir oydan keyin sayt pozitsiyalari sezilarli darajada o\'sdi.' },
        { name: 'Ivan P.', text: 'Tez va savodli rerayt. Unikallik 100%.' }
      ]
    },
    about: {
      title: 'Men haqimda',
      text: 'Men 5 yildan ortiq tajribaga ega professional kopirayterman. Ko\'p tilli kontent yaratishga ixtisoslashganman (rus, o\'zbek, ingliz). Maqsadim — biznesingizga mijoz tilida gapirishga yordam berish.'
    },
    faq: {
      title: 'Ko\'p beriladigan savollar',
      items: [
        { q: 'Ishni bajarish muddati qancha?', a: 'Muddatlar vazifaning hajmiga va murakkabligiga bog\'liq. Masalan, 5000 belgidan iborat SEO-maqola odatda 2-3 ish kuni ichida tayyor bo\'ladi. Men har doim muddatlarni oldindan kelishib olaman va ularga qat\'iy rioya qilaman.' },
        { q: 'Unikallik qanday tekshiriladi?', a: 'Barcha matnlar Text.ru xizmati orqali (asosiy tekshiruv) yoki sizning talabingizga binoan Advego kabi boshqa har qanday xizmat orqali unikallikka tekshiriladi. Men barcha ishlar uchun kamida 95% unikallikni kafolatlayman.' },
        { q: 'Texnik topshiriq (TZ) bo\'yicha ishlaysizmi?', a: 'Ha, aniq texnik topshiriq bo\'yicha ishlash sifatli natijaning asosidir. Men TZni diqqat bilan o\'rganaman, aniqlashtiruvchi savollar beraman va barcha talablarga qat\'iy amal qilaman.' },
        { q: 'Katta hajmlar uchun chegirmalar bormi?', a: 'Albatta. Oyiga umumiy hajmi 20 000 belgidan ortiq bo\'lgan matnlarga buyurtma berilganda 10% chegirma taqdim etiladi. Doimiy mijozlar uchun individual shartlar amal qiladi.' }
      ]
    },
    footer: {
      copy: '© 2024 CopyPro Services. Barcha huquqlar himoyalangan.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      reviews: 'Reviews',
      about: 'About Me',
      faq: 'FAQ',
      contact: 'Contacts'
    },
    hero: {
      title: 'Professional Copywriting and Rewriting Services',
      subtitle: 'High-quality texts for business and personal needs. We create content that sells and inspires.',
      cta: 'Order Now'
    },
    services: {
      title: 'Our Services',
      items: [
        {
          title: 'Article Writing',
          desc: 'Informative, expert, and entertaining articles for blogs and media.',
          price: 'from $15 per 1000 chars',
          icon: <PenTool className="w-8 h-8" />
        },
        {
          title: 'SEO Texts',
          desc: 'Optimized content for search engines that boosts your website rankings.',
          price: 'from $20 per 1000 chars',
          icon: <Search className="w-8 h-8" />
        },
        {
          title: 'Rewriting',
          desc: 'High-quality processing of existing texts with meaning preservation and high uniqueness.',
          price: 'from $10 per 1000 chars',
          icon: <RefreshCw className="w-8 h-8" />
        },
        {
          title: 'Slogans & Marketing',
          desc: 'Creative slogans, naming, and selling texts for advertising.',
          price: 'from $50 per project',
          icon: <MessageSquare className="w-8 h-8" />
        }
      ]
    },
    portfolio: {
      title: 'Portfolio',
      readMore: 'Read More',
      items: [
        {
          title: 'Native Reviews for Yandex.Maps',
          preview: 'Creating and posting organic reviews to increase company ratings in Penza and Samara. Enhancing reputation and attracting customers.',
          full: 'Full case study on native reviews: A strategy was developed to improve the reputation of a coffee shop chain in Penza and Samara. Over 3 months, more than 80 unique, geo-targeted reviews were written and posted on Yandex.Maps. As a result, the average rating increased from 3.8 to 4.7, and the number of calls from the maps increased by 40%.'
        },
        {
          title: 'SEO Descriptions for Business',
          preview: 'Writing selling SEO texts for the categories of an online store of household appliances. Increasing visibility in search engines.',
          full: 'Full case study on SEO descriptions: For a large online store, 50+ SEO-optimized descriptions were created for product categories (refrigerators, washing machines, TVs). The texts included LSI keywords and were structured to improve behavioral factors. After 2 months, 70% of the categories entered the TOP-10 of Yandex and Google for target queries.'
        },
        {
          title: 'Content Marketing for IT Companies',
          preview: 'Maintaining a blog for a company that develops mobile applications. Expert articles to attract B2B clients.',
          full: 'Full case study on content marketing: A content plan was developed and 12 expert articles were written for the blog of an IT company. Topics included technology comparisons, case studies, and development trends. The articles were actively distributed in specialized communities. In 6 months, organic traffic to the blog increased 3-fold, and the company received 5 large leads directly from the articles.'
        }
      ]
    },
    reviews: {
      title: 'Client Reviews',
      formTitle: 'Leave a Review',
      name: 'Name',
      email: 'Email',
      text: 'Your Review',
      submit: 'Send',
      items: [
        { name: 'Alex V.', text: 'Work completed on time, texts are very high quality. Highly recommend!' },
        { name: 'Marina K.', text: 'Excellent SEO copywriting. Website rankings grew significantly in a month.' },
        { name: 'Ivan P.', text: 'Fast and professional rewriting. 100% uniqueness.' }
      ]
    },
    about: {
      title: 'About Me',
      text: 'I am a professional copywriter with over 5 years of experience. I specialize in creating multilingual content (Russian, Uzbek, English). My goal is to help your business speak the customer\'s language.'
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What is the turnaround time?', a: 'Turnaround time depends on the volume and complexity of the task. For example, a 5000-character SEO article is usually ready within 2-3 business days. I always agree on deadlines in advance and strictly adhere to them.' },
        { q: 'How is uniqueness checked?', a: 'All texts are checked for uniqueness through the Text.ru service (basic check) or, at your request, through any other service such as Advego. I guarantee at least 95% uniqueness for all work.' },
        { q: 'Do you work according to a brief?', a: 'Yes, working according to a clear technical brief is the basis for a quality result. I carefully study the brief, ask clarifying questions, and strictly follow all requirements.' },
        { q: 'Are there discounts for large volumes?', a: 'Of course. A 10% discount is provided for orders with a total volume of 20,000 characters or more per month. Individual conditions apply for regular clients.' }
      ]
    },
    footer: {
      copy: '© 2024 CopyPro Services. All rights reserved.'
    }
  }
};

// --- Components ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal = ({ isOpen, onClose, title, content }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="text-gray-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

interface AccordionProps {
  question: string;
  answer: string;
  key?: React.Key;
}

const AccordionItem = ({ question, answer }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Свяжитесь со мной</h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          Для заказа услуг или консультации, пожалуйста, напишите мне в Telegram или на электронную почту.
        </p>
        <div className="space-y-4">
            <button 
                onClick={() => { window.open('https://t.me/gfdfbhm', '_blank'); onClose(); }}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Telegram: @gfdfbhm
              </button>
              <div className="flex items-center gap-4 group justify-center">
                  <Mail className="w-6 h-6 text-gray-500" />
                  <p className="text-gray-800 font-bold">geravgavroskin@gmail.com</p>
              </div>
        </div>
      </motion.div>
    </div>
  );
}

const HeadlineImprover = ({ t }: { t: any }) => {
  const [headline, setHeadline] = useState('');
  const [improvedHeadline, setImprovedHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setIsLoading(true);
    setError('');
    setImprovedHeadline('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert copywriter. Your task is to improve the following headline to make it more catchy, powerful, and engaging. Provide only one, final, improved version of the headline, without any extra text or explanations.\n\nOriginal headline: "${headline}"\n\nImproved headline:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const improvedText = response.text?.trim();

      if (!improvedText) {
        throw new Error('AI returned an empty response.');
      }

      setImprovedHeadline(improvedText);
    } catch (err) {
      setError('Не удалось получить ответ от ИИ. Попробуйте позже.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 bg-white p-8 rounded-3xl shadow-lg border border-blue-100/50">
      <h4 className="text-xl font-bold text-center mb-1 text-gray-900">Проверьте свою идею заголовка</h4>
      <p className="text-center text-sm text-gray-500 mb-6">Введите заголовок, и ИИ предложит улучшенный вариант.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Например, 'Услуги копирайтера'"
          className="flex-grow px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Думаю...' : 'Улучшить'}
        </button>
      </form>
      {improvedHeadline && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <p className="text-sm font-bold text-green-800 mb-2">Предложенный вариант:</p>
          <p className="font-serif text-lg text-green-900">«{improvedHeadline}»</p>
        </div>
      )}
      {error && <p className="mt-4 text-center text-red-600 text-sm">{error}</p>}
    </div>
  );
}


export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<{ title: string, content: string } | null>(null);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const t = translations[lang];

  const [reviews, setReviews] = useState([]);

  const [stats, setStats] = useState({ visitCount: 0, reviewCount: 0 });

  useEffect(() => {
    // 1. Track visit
    fetch('/api/track-visit', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(error => console.error('Error tracking visit:', error));

    // 2. Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    // 3. Fetch reviews
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error fetching reviews:', err));

    // 4. Scroll listener
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Header --- */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <PenTool className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              CopyPro Services
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {Object.entries(t.nav).map(([key, label]) => (
              <button 
                key={key} 
                onClick={() => scrollTo(key)}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {(['ru', 'uz', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === l ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setContactModalOpen(true)}
              className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              {t.hero.cta}
            </button>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {t.hero.title.split(' ').map((word, i) => (
                <span key={i} className={i > 2 ? 'text-blue-600' : ''}>{word} </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t.hero.cta}
              </button>
              <button 
                onClick={() => scrollTo('services')}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold text-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
              >
                {t.nav.services}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section id="services" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.services.title}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.services.items.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 h-24">
                  {item.desc}
                </p>
                <div className="pt-6 border-t border-gray-100">
                  <span className="text-blue-600 font-bold">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <HeadlineImprover t={t} />

        </div>
      </section>

      {/* --- Portfolio Section --- */}
      <section id="portfolio" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.portfolio.title}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.portfolio.items.map((item, i) => (
              <div key={i} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Кейс {i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-8 flex-grow">
                    "{item.preview}"
                  </p>
                  <button 
                    onClick={() => setActiveModal({ title: item.title, content: item.full })}
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all mt-auto"
                  >
                    {t.portfolio.readMore}
                    <ChevronDown className="-rotate-90 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-[40px] blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                  alt="Professional male copywriter" 
                  className="relative w-full aspect-[3/4] object-cover rounded-[32px] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl hidden lg:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Experience</p>
                      <p className="text-lg font-bold text-gray-900">5+ Years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">{t.about.title}</h2>
              <p className="text-lg md:text-xl leading-relaxed text-blue-50 mb-10">
                {t.about.text}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-bold mb-2">500+</p>
                  <p className="text-blue-100 text-sm">Projects Completed</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">100%</p>
                  <p className="text-blue-100 text-sm">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Reviews Section --- */}
      <section id="reviews" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.reviews.title}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Review Form */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-8">{t.reviews.formTitle}</h3>
              <form className="space-y-6" onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                const name = (form.elements[0] as HTMLInputElement).value;
                const email = (form.elements[1] as HTMLInputElement).value;
                const text = (form.elements[2] as HTMLTextAreaElement).value;
                await fetch('/api/reviews', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, text }),
                });
                fetch('/api/reviews').then(res => res.json()).then(data => setReviews(data));
                form.reset();
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">{t.reviews.name}</label>
                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">{t.reviews.email}</label>
                    <input type="email" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t.reviews.text}</label>
                  <textarea rows={4} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none" placeholder="..." />
                </div>
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
                  {t.reviews.submit}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="space-y-8">
              {reviews.slice(0, 1).map((review, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative"
                >
                  <Quote className="absolute top-6 right-8 w-10 h-10 text-blue-50" />
                  <p className="text-gray-600 leading-relaxed mb-6 italic relative z-10">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {review.name[0]}
                    </div>
                    <span className="font-bold text-gray-900">{review.name}</span>
                  </div>
                </motion.div>
              ))}
              {reviews.length > 1 && (
                <button 
                  onClick={() => setActiveModal({ title: 'Все отзывы', content: reviews.map(r => `<div><p><b>${r.name}</b></p><p>${r.text}</p></div>`).join('') })}
                  className="w-full py-4 bg-gray-100 text-gray-800 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Показать все отзывы
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.faq.title}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="bg-white rounded-[32px] p-4 md:p-8 border border-gray-100 shadow-sm">
            {t.faq.items.map((item, i) => (
              <AccordionItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer id="contact" className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <PenTool className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">CopyPro Services</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {t.hero.subtitle}
              </p>

            </div>

            <div>
              <h4 className="text-lg font-bold mb-8">{t.nav.services}</h4>
              <ul className="space-y-4 text-gray-400">
                {t.services.items.map((item, i) => (
                  <li key={i} className="hover:text-white transition-colors cursor-pointer">{item.title}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-8">{t.nav.contact}</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open('https://t.me/gfdfbhm', '_blank')}>
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Telegram</p>
                    <p className="text-white font-bold">@gfdfbhm</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email</p>
                    <p className="text-white font-bold">geravgavroskin@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-gray-500">
              <p>{t.footer.copy}</p>
            </div>
            
            <div className="flex items-center gap-10 bg-gray-900/50 px-8 py-4 rounded-2xl border border-gray-800/50">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Посетителей</p>
                <p className="text-xl font-bold text-blue-400">{stats.visitCount}</p>
              </div>
              <div className="w-px h-8 bg-gray-800"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Заказов</p>
                <p className="text-xl font-bold text-cyan-400">{stats.reviewCount}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isContactModalOpen && <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {activeModal && (
          <Modal 
            isOpen={!!activeModal} 
            onClose={() => setActiveModal(null)} 
            title={activeModal.title} 
            content={activeModal.content} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}

