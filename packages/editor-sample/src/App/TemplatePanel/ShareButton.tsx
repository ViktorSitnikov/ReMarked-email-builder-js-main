import React, { useMemo } from 'react';

import { IosShareOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { UseLoader } from '../LoaderContext';
import { UseNotification } from '../NotificationContext';

import { useDocument } from '../../documents/editor/EditorContext';
import { useTranslation } from '../LocalizationContext';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function ShareButton() {
  const { t } = useTranslation();
  const internalDocument = useDocument();

  const { showLoader, hideLoader } = UseLoader();
  const { showNotification } = UseNotification();

  const htmlCode = useMemo(() => renderToStaticMarkup(internalDocument, { rootBlockId: 'root' }), [internalDocument]);
  const json = useMemo(() => JSON.stringify(internalDocument, null, '  '), [internalDocument]);

  const onClick = async () => {
    showLoader();

    const targetTextAreaEl = document.getElementById("emailHtml") as HTMLTextAreaElement | null;

    if (targetTextAreaEl) {
      targetTextAreaEl.value = htmlCode;
      
      const event = new Event('input', { bubbles: true });
      targetTextAreaEl.dispatchEvent(event);
    }

    const targetTemplateTextareaEl = document.getElementById("messageTemplateJson") as HTMLTextAreaElement | null;

    if (targetTemplateTextareaEl) {
      targetTemplateTextareaEl.value = json;
    }

    const rootEl = document.getElementById("emailBuilder") as HTMLElement | null;

    rootEl?.classList.remove("opened");

    (window as any).hideEmailBuilder();
    
    hideLoader();
  };

  return (
    <>
      <IconButton onClick={() => onClick()}>
        <Tooltip title={t('tooltips.share')}>
          <IosShareOutlined fontSize="small" />
        </Tooltip>
      </IconButton>
    </>
  );
}
