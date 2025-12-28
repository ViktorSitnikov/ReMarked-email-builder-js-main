import React, { useMemo } from 'react';

import { IosShareOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { UseLoader } from '../LoaderContext';

import { useDocument } from '../../documents/editor/EditorContext';
import { useTranslation } from '../LocalizationContext';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function ShareButton() {
  const { t } = useTranslation();
  const internalDocument = useDocument();

  const { showLoader, hideLoader } = UseLoader();

  const htmlCode = useMemo(() => renderToStaticMarkup(internalDocument, { rootBlockId: 'root' }), [internalDocument]);
  const json = useMemo(() => JSON.stringify(internalDocument, null, '  '), [internalDocument]);

  const onClick = async () => {
    showLoader()
    try {
      // const data = {
      //   jsonrpc: "2.0",
      //   method: "EmailEditor.Save",
      //   json: json,
      //   html: htmlCode,
      //   id: Date.now(),
      // }

      // const request = await fetch(`/${(window as any).appOptions.point}/Какой-то эндпоинт`, {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json;charset=utf-8'
      //     },
      //     body: JSON.stringify(data)
      // });
      
      // const result = await request.json();

    }
    catch(error) {
      console.log("А надо дорабатывать)))")
    }
    finally {
      hideLoader();

      const targetTextAreaEl = document.getElementById("emailHtml") as HTMLTextAreaElement | null;

      if (targetTextAreaEl) {
        targetTextAreaEl.value = htmlCode;

        targetTextAreaEl.value = htmlCode;
        
        const event = new Event('input', { bubbles: true });
        targetTextAreaEl.dispatchEvent(event);
      }

      const rootEl = document.getElementById("emailBuilder") as HTMLElement | null;

      rootEl?.classList.remove("opened");

      (window as any).hideEmailBuilder();
    }
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
