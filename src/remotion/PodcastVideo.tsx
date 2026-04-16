import { AbsoluteFill, Audio, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import type { PodcastVideoProps } from './podcastDemoData';
import { findActiveCueIndex } from './cues';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const normalizeWord = (word: string) => {
  return word
    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '')
    .replace(/'s$/i, '')
    .toLowerCase();
};

const isHighlightedVocabWord = (word: string, highlightWordSet: Set<string>) => {
  const normalized = normalizeWord(word);

  if (!normalized) {
    return false;
  }

  if (highlightWordSet.has(normalized)) {
    return true;
  }

  if (normalized.endsWith('s') && highlightWordSet.has(normalized.slice(0, -1))) {
    return true;
  }

  if (normalized.endsWith('ed') && highlightWordSet.has(normalized.slice(0, -2))) {
    return true;
  }

  if (normalized.endsWith('ing') && highlightWordSet.has(normalized.slice(0, -3))) {
    return true;
  }

  return false;
};

const renderEnglishWords = (
  text: string,
  progress: number | null,
  accentColor: string,
  highlightWordSet: Set<string>
) => {
  const words = text.split(/\s+/).filter(Boolean);
  const highlightedCount = progress === null ? 0 : Math.max(0, Math.floor(progress * words.length));

  return words.map((word, index) => {
    const isActive = progress === null ? false : index < highlightedCount;
    const isVocab = isHighlightedVocabWord(word, highlightWordSet);

    let color = '#f8fafc';
    let opacity = 0.92;
    let textShadow = 'none';
    let background = 'transparent';
    let borderRadius = 0;
    let padding = '0';

    if (isVocab) {
      color = '#fde68a';
      background = 'rgba(253, 230, 138, 0.14)';
      borderRadius = 10;
      padding = '0 4px';
    }

    if (isActive) {
      color = accentColor;
      opacity = 1;
      textShadow = `0 0 18px ${accentColor}55`;
    }

    if (isActive && isVocab) {
      color = '#fff7d6';
      background = `${accentColor}66`;
      textShadow = `0 0 20px ${accentColor}88`;
    }

    return (
      <span
        key={ `${word}-${index}` }
        style={{
          color,
          opacity,
          textShadow,
          background,
          borderRadius,
          padding,
          transition: 'color 120ms linear',
        }}
      >
        { word }{ ' ' }
      </span>
    );
  });
};

export const PodcastVideo = ({
  audioSrc,
  imageSrc,
  accentColor,
  episodeTitle,
  podcastTitle,
  cues,
  highlightWords = [],
}: PodcastVideoProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTime = frame / fps;
  const currentIndex = Math.max(0, findActiveCueIndex(cues, currentTime));
  const currentCue = cues[currentIndex] ?? cues[cues.length - 1];
  const previousCue = currentIndex > 0 ? cues[currentIndex - 1] : null;
  const nextCue = currentIndex < cues.length - 1 ? cues[currentIndex + 1] : null;
  const railStart = Math.max(0, currentIndex - 2);
  const railEnd = Math.min(cues.length, currentIndex + 4);
  const visibleCues = cues.slice(railStart, railEnd);
  const highlightWordSet = new Set(highlightWords.map((word) => word.toLowerCase()));
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 200,
      stiffness: 120,
      mass: 0.8,
    },
  });

  const fragmentProgress = interpolate(
    currentTime,
    [currentCue.begin, currentCue.end],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: '"Avenir Next", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif',
      }}
    >
      <Audio src={ audioSrc } />
      <AbsoluteFill>
        <Img
          src={ imageSrc }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${interpolate(frame, [0, durationInFrames], [1, 1.12])})`,
            filter: 'blur(18px) saturate(0.95) brightness(0.55)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(120deg, rgba(2,6,23,0.94) 0%, rgba(2,6,23,0.7) 45%, rgba(15,23,42,0.86) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          padding: '54px 58px 44px',
          gap: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: entrance,
            transform: `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 999,
              backgroundColor: 'rgba(15, 23, 42, 0.56)',
              border: `1px solid ${accentColor}`,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: 0.2,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor}`,
              }}
            />
            Remotion Podcast Video Demo
          </div>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              backgroundColor: 'rgba(15, 23, 42, 0.56)',
              border: '1px solid rgba(255,255,255,0.16)',
              fontSize: 20,
            }}
          >
            { formatTime(currentTime) }
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.92fr',
            gap: 30,
            flex: 1,
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 36,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '30px 32px 28px',
              boxShadow: '0 20px 60px rgba(2, 6, 23, 0.35)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 21, textTransform: 'uppercase', letterSpacing: 1.5, color: '#cbd5e1' }}>
                  { podcastTitle }
                </div>
                <div style={{ fontSize: 44, lineHeight: 1.06, fontWeight: 700, maxWidth: '92%' }}>
                  { episodeTitle }
                </div>
              </div>

              <div
                style={{
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  height: 260,
                }}
              >
                <Img
                  src={ imageSrc }
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${interpolate(frame, [0, durationInFrames], [1.02, 1.08])})`,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 24,
                paddingTop: 20,
                paddingBottom: 20,
                transform: 'translateY(-28px)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 19, letterSpacing: 1.6, textTransform: 'uppercase', color: '#94a3b8' }}>
                  Active English Cue
                </div>
                <div
                  style={{
                    fontSize: 31,
                    lineHeight: 1.36,
                    fontWeight: 600,
                    color: '#f8fafc',
                    textAlign: 'center',
                  }}
                >
                  { renderEnglishWords(currentCue.en, fragmentProgress, accentColor, highlightWordSet) }
                </div>
              </div>

            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <div
                style={{
                  borderRadius: 22,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '14px 16px',
                  minHeight: 106,
                }}
              >
                <div style={{ fontSize: 15, letterSpacing: 1.4, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>
                  Previous
                </div>
                <div style={{ fontSize: 20, lineHeight: 1.45, color: '#cbd5e1' }}>
                  { previousCue ? previousCue.en : '...' }
                </div>
              </div>
              <div
                style={{
                  borderRadius: 22,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '14px 16px',
                  minHeight: 106,
                }}
              >
                <div style={{ fontSize: 15, letterSpacing: 1.4, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>
                  Next
                </div>
                <div style={{ fontSize: 20, lineHeight: 1.45, color: '#cbd5e1' }}>
                  { nextCue ? nextCue.en : '...' }
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              borderRadius: 36,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '28px 26px',
              boxShadow: '0 20px 60px rgba(2, 6, 23, 0.35)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700 }}>Cue Timeline</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 2,
              }}
            >
              { visibleCues.map((cue, visibleIndex) => {
                const index = railStart + visibleIndex;
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;

                return (
                  <div
                    key={ `${cue.begin}-${cue.end}` }
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      padding: '16px 18px',
                      borderRadius: 22,
                      backgroundColor: isActive ? 'rgba(249, 115, 22, 0.18)' : 'rgba(255,255,255,0.04)',
                      border: isActive ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
                      opacity: isPast || isActive ? 1 : 0.72,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 18,
                        color: '#cbd5e1',
                      }}
                    >
                      <span>{ `Cue ${index + 1}` }</span>
                      <span>{ `${formatTime(cue.begin)} - ${formatTime(cue.end)}` }</span>
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        lineHeight: 1.4,
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      { cue.en }
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        lineHeight: 1.4,
                        color: '#fde68a',
                        opacity: isActive ? 1 : 0.76,
                      }}
                    >
                      { cue.zh }
                    </div>
                  </div>
                );
              }) }
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              height: 8,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
                height: '100%',
                borderRadius: 999,
                background: `linear-gradient(90deg, ${accentColor} 0%, #fb7185 100%)`,
              }}
            />
          </div>
          <div
            style={{
              height: 4,
              width: `${fragmentProgress * 100}%`,
              borderRadius: 999,
              backgroundColor: '#fde68a',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
