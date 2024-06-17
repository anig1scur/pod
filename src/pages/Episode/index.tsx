import React, {Fragment} from 'react';
import Logo from '@/components/Logo';

import WaveForm from '@/components/WaveForm';
import FillIn from '@/components/mode/FillIn';
import Music from '@/assets/6mins/0715.mp3';

const episodeData = {
  introduction: [
    'The coronavirus pandemic might have changed our attitude to work and people are more comfortable with working from home than ever before. However, this trend started much earlier with new rules that allowed people some flexibility. In this programme, Neil and Georgina discuss if the 9-to-5 shift in the office will soon be a thing of the past and teach you vocabulary along the way.',
  ],
  this_week_question: [
    'According to data from the Organization for Economic Cooperation and Development (OECD), workers from which country work the longest hours?',
    'a) South Korea b) Germany c) Mexico',
    'Listen to the programme to find out the answer.',
  ],
  vocabulary: [
    {text: 'routine', desc: 'the usual, fixed way of doing things'},
    {text: 'common sense', desc: 'our judgement to make sensible decisions'},
    {text: 'match', desc: 'work equally on both sides'},
    {text: 'inflexible', desc: 'unwilling to change'},
    {text: 'bias', desc: 'unfairness; treating one group of people more favourably than another'},
    {text: 'active', desc: 'involved with (something)'},
  ],
  transcript: [
    {author: 'Georgina', text: 'Hello. This is 6 Minute English from BBC Learning English. I ’m Georgina.'},
    {author: 'Neil', text: 'And I ’m Neil.'},
    {author: 'Georgina', text: 'In this programme we ’re going to be talking about the world of work.'},
    {
      author: 'Neil',
      text: 'Ah yes, travelling to an office five days a week, sitting at a desk all day, and then going home.',
    },
    {
      author: 'Georgina',
      text: 'Neil, it ’s not always like that. Office work doesn ’t have to be such a routine –the usual, fixed way of doing things –it is much more flexible these days.',
    },
    {
      author: 'Neil',
      text: 'That ’s true. During the pandemic, we ’ve all had to have a more flexible approach to work.',
    },
    {
      author: 'Georgina',
      text: 'Yes, we have. And it has, perhaps, changed our attitude to working flexibly. But even before coronavirus, there was an opportunity to work flexibly, and we ’ll be discussing that soon.',
    },
    {
      author: 'Neil',
      text: 'But there ’s one thing that can ’t be changed and that ’s you setting a quiz question for me!',
    },
    {
      author: 'Georgina',
      text: 'Ah yes, I hadn ’t forgotten. So, Neil, I know you work very hard. But according to data from the Organization for Economic Cooperation and Development –the OECD –workers from which country work the longest hours? Is it … a) South Korea b) Germany, or c) Mexico?',
    },
    {author: 'Neil', text: 'Well, as I ’m not on the list, let ’s go for c) Mexico.'},
    {
      author: 'Georgina',
      text: 'OK, Neil, we ’ll find out if that ’s right at the end of the programme. But let ’s talk more about flexible working now. Different countries have different laws about working flexibly –but here in the UK, for last 14 years, employees –workers –have had the right to request flexible working.',
    },
    {
      author: 'Neil',
      text: 'But what does it mean to work flexibly? Sarah Jackson is a workplace consultant and visiting professor at Cranfield University School of Management. She spoke to BBC Radio 4 ’s Woman ’s Hour programme about what it means exactly …',
    },
    {
      author: 'Sarah Jackson, workplace consultant',
      text: "Because of the pandemic, now everybody thinks flexible working means working from home - it doesn't, it's about common sense , what does the job need in terms of when where, how long, and what do you need and what does your family need - and how do the two match ? So, flexibility really means having choice and control over when, where and how long you work, and agreeing that with your manager.",
    },
    {
      author: 'Georgina',
      text: 'So, flexible working is not just working from home –something we ’ve got used to during the pandemic. It is about common sense –using our judgement to make sensible decisions.',
    },
    {
      author: 'Neil',
      text: 'So, requesting to work for two hours a day is not sensible –but being able to work from 12 until 8 instead of 9 to 5 might be. Of course, this depends on the needs of the business. And as Sarah said, you need to match your needs with that of the business. Match here means to work equally on both sides.',
    },
    {
      author: 'Georgina',
      text: 'Getting the working conditions that suit you does require some negotiation with your manager. You need agreement from him or her –and that can be difficult if your manager is inflexible –not willing to change.',
    },
    {
      author: 'Neil',
      text: 'But of course, in the UK at least, an employee has a right to request flexible working, and this must be considered by the employer. This law initially was just for parents with a child younger than 6 years old –or a disabled child less than 18.',
    },
    {
      author: 'Georgina',
      text: 'But since 2014, everyone has the right to request flexible working. And that includes men.',
    },
    {
      author: 'Neil',
      text: 'Which is an important point, as Sarah Jackson explains. Fewer men seem to have their requests for flexible working accepted –let ’s find out why …',
    },
    {
      author: 'Sarah Jackson, workplace consultant',
      text: "Men, when they do ask, are more likely to be turned down, so there's a real bias there in the system and the most important thing that needs to happen here, I think, is for employers to really actively say to their men, 'we know you want to be active fathers' - because there's a whole generation of young men who do want to be active fathers - 'please use the right to request flexible working, work flexibly if you can ’ because until men are enabled to be active fathers, we won't get equality at home and we certainly won't get equality in the workplace either.",
    },
    {
      author: 'Georgina',
      text: 'OK, so men are more likely to have their request turned down –or rejected. And Sarah says there is a bias in the system –unfairness, treating one group of people more favourably than another.',
    },
    {
      author: 'Neil',
      text: 'And this is unfair because it can prevent some men being active fathers –actually being involved with childcare. But having more active fathers can lead to equality –or fairness –at home and in the workplace.',
    },
    {
      author: 'Georgina',
      text: 'It sounds like something that needs to be looked at. But now, Neil, let ’s get the answer to my question: According to official data, in which country do workers work the longest hours?',
    },
    {author: 'Neil', text: 'And I said Mexico.'},
    {
      author: 'Georgina',
      text: 'Which is correct, well done! According to the OECD, the average Mexican spends 2,255 hours at work per year –the equivalent of around 43 hours per week. Germans, on the other hand, clock up the fewest hours.',
    },
    {
      author: 'Neil',
      text: 'Well, my working day is nearly over, so let ’s just recap some of the vocabulary we ’ve discussed. Starting with routine –the usual, fixed way of doing things.',
    },
    {author: 'Georgina', text: 'Common sense is our judgement to make sensible decisions.'},
    {author: 'Neil', text: 'When you need something to match it has to work equally on both sides.'},
    {
      author: 'Georgina',
      text: 'And when someone is inflexible , they are unwilling to change –sometimes we say they won ’t budge!',
    },
    {
      author: 'Neil',
      text: 'Bias is unfairness, treating one group of people more favourably than another. And being active with something means being involved with it.',
    },
    {
      author: 'Georgina',
      text: 'Well, there ’s no flexibility in our 6 minutes so we ’re out of time. We have plenty more 6 Minute English programmes to enjoy on our website at bbclearningenglish.com. And check us out on Facebook, Twitter and Instagram.',
    },
    {
      author: 'Neil',
      text: "Don't forget that we have an app too, which you can download for free from the app stores. We help you learn English on the move! Grammar, vocabulary, and interesting topics –we have them all!",
    },
    {author: 'Georgina', text: 'Bye for now.'},
    {author: 'Neil', text: 'Goodbye.'},
  ],
  authors: ['Georgina', 'Neil', 'Sarah Jackson, workplace consultant'],
};

const Episode = () => {
  return (
    <div className="episode">
      <header>
        <Logo text="POD!" />
      </header>
      <main>
        <section className="meta">
          <WaveForm url={Music} />
        </section>
        <section className="pro">
          <FillIn scripts={episodeData.transcript} />
        </section>
      </main>
    </div>
  );
};

export default Episode;
