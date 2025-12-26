'use client';

import React from 'react';
import styles from './Audio.module.css';
import { textBlock } from '../../../../lib/notion/renderers';

interface AudioProps {
  id: string;
  caption?: Array<any>;
  audio?: {
    url: string;
    expiry_time?: string;
  };
}

export const Audio: React.FC<AudioProps> = ({ id, caption = [], audio }) => {
  if (!audio?.url) {
    return null;
  }

  // Generate accessibility label from caption
  const audioCaption = caption?.[0]?.plain_text || '音频内容';
  const ariaLabel = `音频播放器: ${audioCaption}`;

  return (
    <figure className={styles.audio} role="figure" aria-label={ariaLabel}>
      <audio
        src={audio.url}
        controls
        className={styles.audioPlayer}
        aria-label={audioCaption}
      />
      {caption && caption.length > 0 && (
        <figcaption className={styles.audioCaption}>
          {textBlock(caption, true, `${id}-caption`)}
        </figcaption>
      )}
    </figure>
  );
};
