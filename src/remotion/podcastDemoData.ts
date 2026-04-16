export type PodcastVideoProps = {
  audioSrc: string;
  imageSrc: string;
  accentColor: string;
  episodeTitle: string;
  podcastTitle: string;
  cues: import('./cues').Cue[];
  highlightWords?: string[];
};

import { deriveCues, type BilingualFragment } from './cues';

export const podcastVideoDemoData = {
  accentColor: '#f97316',
  podcastTitle: 'NPR Life Kit',
  episodeTitle: 'How to deepen your connection with your ancestors',
  fragments: [
    {
      begin: 0,
      end: 57.68,
      en: "This is NPR's LIFE KIT. I'm Marielle Segarra. There's this kind of parable that gets repeated sometimes. It's about a ham. It goes something like this. Mom's making a ham for a holiday dinner, and she cuts off the end of it and throws it away, which she always does. And her kid is like, Mom, why do you do this? You know, you're wasting good ham. And the mom says, I don't know. It's what my mom used to do. Now Grandma is not around anymore. So the kid goes to Grandpa and says, Grandpa, why did Grandma always cut off the end of the ham? And Grandpa's like, oh, our oven was too small for the whole thing.",
      zh: '这里是 NPR 的 LIFE KIT，我是 Marielle Segarra。人们有时会反复讲一个关于火腿的小寓言。妈妈做节日晚餐时，总会把火腿末端切掉扔掉，孩子问她为什么这样做。妈妈说她也不知道，因为外婆以前就是这样。后来孩子去问外公，答案其实很简单: 当年家里的烤箱太小，放不下整块火腿。',
    },
    {
      begin: 57.68,
      end: 86.2,
      en: "The point, my friends, is that we learn a lot of things from our parents who learn them from their parents and so on. Behaviors and practices and ways of seeing the world that may or may not be serving us anymore. Camara Meri Rajabari told me a version of this story. She's a licensed marriage and family therapist in Oakland, Calif., and she goes by the ancestral psychotherapist because she helps her clients understand how their ancestors' lives affect their lives today.",
      zh: '重点在于，我们会从父母那里继承很多东西，而父母又是从他们的父母那里学来的。那些行为、习惯和看世界的方式，如今未必还适合我们。这个故事的版本来自 Camara Meri Rajabari。她是奥克兰的婚姻与家庭治疗师，也被称作“祖先心理治疗师”，因为她帮助来访者理解祖先的人生如何影响今天的自己。',
    },
    {
      begin: 86.2,
      end: 96.96,
      en: "To try to understand what has been passed down that's been a real gift for us and those things that have been passed down that maybe we are finally ready to release.",
      zh: '我们要试着分辨，哪些传承下来的东西是真正的礼物，哪些则可能已经到了该由我们这一代放下的时候。',
    },
    {
      begin: 96.96,
      end: 101.04,
      en: 'Camara says learning about your ancestors can be joyful and surprising.',
      zh: 'Camara 说，了解祖先这件事，本身就可能是喜悦而且充满惊喜的。',
    },
    {
      begin: 101.04,
      end: 106.72,
      en: "Maybe there was a long line of herbalists you didn't know about or a long line of musicians.",
      zh: '也许你并不知道，自己的家族里曾经有很长一串草药师，或者一长串音乐家。',
    },
    {
      begin: 106.72,
      end: 117.04,
      en: 'And that getting to know the people who came before you can help you understand yourself. She told me about a philosophy called Sankofa, which comes from Akan culture in Ghana.',
      zh: '认识那些在你之前的人，会帮助你更理解自己。她还提到一个叫 Sankofa 的理念，它来自加纳的阿肯文化。',
    },
  ] as BilingualFragment[],
};

export const podcastVideoDemoCues = deriveCues(podcastVideoDemoData.fragments);

export const REMOTION_DEMO_FPS = 30;

export const REMOTION_DEMO_DURATION_IN_FRAMES = Math.ceil(
  podcastVideoDemoData.fragments[podcastVideoDemoData.fragments.length - 1].end * REMOTION_DEMO_FPS
);
