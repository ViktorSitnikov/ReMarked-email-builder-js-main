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


  let htmlCode = renderToStaticMarkup(internalDocument, { rootBlockId: 'root' });

  const json = useMemo(() => JSON.stringify(internalDocument, null, '  '), [internalDocument]);

  const onClick = async () => {
    showLoader();

    htmlCode = htmlCode.replace(
      'max-width:600px', 
      'max-width:600px;overflow:hidden'
    );

    const layoutBlock = Object.values(internalDocument).find(b => b.type === 'EmailLayout');
    const preHeaderText = layoutBlock?.data?.preHeader;
    if (preHeaderText) {
      const preheaderHtml = `
        <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">
          ${preHeaderText}
          ${"\u00A0\u200C".repeat(200)}
        </div>`.replace(/\s+/g, ' ').trim();

      htmlCode = htmlCode.replace('<body>', `<body>${preheaderHtml}`);
    }

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
