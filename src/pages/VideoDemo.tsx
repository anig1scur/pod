import { Link } from 'react-router-dom';
import { Player } from '@remotion/player';

import Header from '@/components/Header';
import { PodcastVideo } from '@/remotion/PodcastVideo';
import {
  REMOTION_DEMO_DURATION_IN_FRAMES,
  REMOTION_DEMO_FPS,
  podcastVideoDemoCues,
  podcastVideoDemoData,
} from '@/remotion/podcastDemoData';

const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const VideoDemo = () => {
  const inputProps = {
    accentColor: podcastVideoDemoData.accentColor,
    podcastTitle: podcastVideoDemoData.podcastTitle,
    episodeTitle: podcastVideoDemoData.episodeTitle,
    cues: podcastVideoDemoCues,
    highlightWords: [],
    audioSrc: withBase('assets/remotion-demo/ancestral-altar-clip.mp3'),
    imageSrc: withBase('assets/remotion-demo/ancestral-altar.jpg'),
  };

  return (
    <div className="flex flex-col pb-16">
      <Header />
      <main className="mt-10 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-3 max-w-4xl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]">
                Remotion demo
              </div>
              <h1>播客文本 + 翻译 + 图片 合成视频</h1>
              <p className="text-xl leading-9 text-zinc-700 max-w-4xl">
                这个页面直接用 `@remotion/player` 在浏览器里预览一段播客视频组合。
                现在已经把英文片段、中文翻译、封面图和本地音频样本挂到了同一个时间轴上。
              </p>
            </div>
            <Link
              to="/"
              className="rounded-full border-[3px] border-black px-5 py-3 text-lg font-semibold transition hover:-translate-y-0.5"
            >
              Back home
            </Link>
          </div>

          <div className="grid gap-4 rounded-[28px] border-[3px] border-black bg-[#fff8ef] p-6 text-lg leading-8 text-zinc-800 md:grid-cols-3">
            <div>
              <div className="font-bold text-black">纯前端能做的</div>
              <p>浏览器内时间轴预览、字幕同步、翻译叠层、封面动画、用户可交互拖动和切片。</p>
            </div>
            <div>
              <div className="font-bold text-black">还不够的地方</div>
              <p>你现在的数据只有片段级时间戳，不是单词级。想做精准词对音频，需要 Whisper / forced alignment 之类的词级时间数据。</p>
            </div>
            <div>
              <div className="font-bold text-black">导出视频现实情况</div>
              <p>浏览器里预览完全没问题，但稳定导出 MP4 仍然更适合放在 Node/服务端。浏览器端导出可以做，不过限制更多，也更吃机器。</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] border-[3px] border-black bg-black shadow-[0_25px_80px_rgba(0,0,0,0.16)]">
          <Player
            component={ PodcastVideo }
            inputProps={ inputProps }
            durationInFrames={ REMOTION_DEMO_DURATION_IN_FRAMES }
            fps={ REMOTION_DEMO_FPS }
            compositionWidth={ 1280 }
            compositionHeight={ 720 }
            controls
            style={ {
              width: '100%',
              aspectRatio: '16 / 9',
            } }
          />
        </section>
      </main>
    </div>
  );
};

export default VideoDemo;
