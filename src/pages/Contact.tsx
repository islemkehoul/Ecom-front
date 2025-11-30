import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold dark:text-slate-100">{t('contact.title')}</h1>
      <p className="mt-4 dark:text-slate-300">{t('contact.subtitle')}</p>
    </div>
  );
};

export default Contact;
