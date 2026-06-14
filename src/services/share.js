import { trackEvent } from './analytics';

export const shareContent = async ({ title, text, url, contentType }) => {
  const shareUrl = url ?? window.location.href;

  if (navigator.share) {
    await navigator.share({ title, text, url: shareUrl });
    trackEvent('share', {
      method: 'web_share',
      content_type: contentType,
      item_id: shareUrl,
    });
    return 'shared';
  }

  await navigator.clipboard.writeText(shareUrl);
  trackEvent('share', {
    method: 'clipboard',
    content_type: contentType,
    item_id: shareUrl,
  });
  return 'copied';
};

