import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold dark:text-slate-100">{t('about.title')}</h1>
      <p className="mt-4 dark:text-slate-300">{t('about.subtitle')}</p>
    </div>
  );
};

export default About;
