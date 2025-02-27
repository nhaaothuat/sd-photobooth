import React from 'react'
import LocaleSelect from './LocaleSelect';
import { useLocale, useTranslations } from 'next-intl';

export default function ButtonTest  ()  {
  const t = useTranslations('ButtonTest');
  const locale = useLocale();
  return (
    <LocaleSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en')
        },
        {
          value: 'vi',
          label: t('vi')
        }
      ]}
      label={t('label')}
    />
  )
}


