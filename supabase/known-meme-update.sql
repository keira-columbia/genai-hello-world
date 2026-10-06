update public.moments set
  title = 'The study plan versus the study break',
  context = 'Trying to make responsible choices during midterms.',
  image_description = 'The blank Drake Hotline Bling meme template with one disapproving reaction and one approving reaction.',
  description_prompt = 'Describe the blank Drake Hotline Bling template factually for a campus humor caption prompt.',
  description_model = 'starter-template-description'
where id = '10000000-0000-4000-8000-000000000101';

update public.moments set
  title = 'Every dorm decision at midnight',
  context = 'Two bad choices and one very stressed student.',
  image_description = 'The blank Two Buttons meme template showing a nervous person deciding between two red buttons.',
  description_prompt = 'Describe the blank Two Buttons template factually for a campus humor caption prompt.',
  description_model = 'starter-template-description'
where id = '10000000-0000-4000-8000-000000000102';

update public.moments set
  title = 'Defending the dining hall again',
  context = 'Complaining about dinner while going back for seconds.',
  image_description = 'The blank Woman Yelling At A Cat meme template with an upset woman pointing and a confused cat at a table.',
  description_prompt = 'Describe the blank Woman Yelling At A Cat template factually for a campus humor caption prompt.',
  description_model = 'starter-template-description'
where id = '10000000-0000-4000-8000-000000000103';

update public.moments set
  title = 'A completely reasonable classroom opinion',
  context = 'Presenting a questionable academic strategy with confidence.',
  image_description = 'The blank Change My Mind meme template showing a person seated behind a table with an empty sign.',
  description_prompt = 'Describe the blank Change My Mind template factually for a campus humor caption prompt.',
  description_model = 'starter-template-description'
where id = '10000000-0000-4000-8000-000000000104';

update public.moments set
  title = 'The subway changes every plan',
  context = 'Getting distracted from the route that would actually get everyone home.',
  image_description = 'The blank Distracted Boyfriend meme template showing a man looking back while his surprised partner watches.',
  description_prompt = 'Describe the blank Distracted Boyfriend template factually for a campus humor caption prompt.',
  description_model = 'starter-template-description'
where id = '10000000-0000-4000-8000-000000000105';

update public.moments set
  title = 'Planning one simple NYC weekend',
  context = 'Each new idea makes the itinerary less realistic.',
  image_description = 'The blank Expanding Brain meme template with four increasingly glowing stages of a brain.',
  description_prompt = 'Describe the blank Expanding Brain template factually for a campus humor caption prompt.',
  description_model = 'starter-template-description'
where id = '10000000-0000-4000-8000-000000000106';

update public.captions as c set
  caption_text = v.caption_text,
  generation_prompt = 'Write short, specific Columbia student-life captions that fit this recognizable blank meme template.',
  generation_model = 'starter-caption-generation'
from (values
('20000000-0000-4000-8000-000000000101'::uuid, 'Reading the assigned chapter / color-coding a study schedule for the chapter'),
('20000000-0000-4000-8000-000000000102'::uuid, 'Eight hours of sleep / one more tiny review session at 2 a.m.'),
('20000000-0000-4000-8000-000000000103'::uuid, 'Starting the paper / choosing the perfect library seat first'),
('20000000-0000-4000-8000-000000000104'::uuid, 'Office hours / asking the group chat and hoping for the best'),
('20000000-0000-4000-8000-000000000105'::uuid, 'Do the laundry now / buy one more shirt and postpone the problem'),
('20000000-0000-4000-8000-000000000106'::uuid, 'Quiet hours / the playlist that absolutely needs speakers'),
('20000000-0000-4000-8000-000000000107'::uuid, 'Clean the room before inspection / turn off the lights and call it ambiance'),
('20000000-0000-4000-8000-000000000108'::uuid, 'Use the last clean towel / admit it has become part of the decor'),
('20000000-0000-4000-8000-000000000109'::uuid, 'Me: This dining hall has nothing. Also me: returns with three plates.'),
('20000000-0000-4000-8000-000000000110'::uuid, 'The dining hall defending the mystery pasta like it is a family recipe.'),
('20000000-0000-4000-8000-000000000111'::uuid, 'Me explaining that fries count as a balanced meal during midterms.'),
('20000000-0000-4000-8000-000000000112'::uuid, 'When your friend judges the meal after asking to use your swipe.'),
('20000000-0000-4000-8000-000000000113'::uuid, 'An 8:40 a.m. class is basically an afternoon activity. Change my mind.'),
('20000000-0000-4000-8000-000000000114'::uuid, 'If the professor says “quick question,” class should end immediately.'),
('20000000-0000-4000-8000-000000000115'::uuid, 'Participation counts when I nod thoughtfully. Change my mind.'),
('20000000-0000-4000-8000-000000000116'::uuid, 'The back row is a learning environment. Change my mind.'),
('20000000-0000-4000-8000-000000000117'::uuid, 'The local train that gets us home / the express train with mysterious confidence'),
('20000000-0000-4000-8000-000000000118'::uuid, 'Our actual stop / following the friend who said “trust me”'),
('20000000-0000-4000-8000-000000000119'::uuid, 'Going back to campus / one more downtown stop before the last train'),
('20000000-0000-4000-8000-000000000120'::uuid, 'Google Maps / the transfer that saves exactly two minutes'),
('20000000-0000-4000-8000-000000000121'::uuid, 'Visit one museum'),
('20000000-0000-4000-8000-000000000122'::uuid, 'Visit one museum and get bagels'),
('20000000-0000-4000-8000-000000000123'::uuid, 'Museum, bagels, downtown, and still finish the reading'),
('20000000-0000-4000-8000-000000000124'::uuid, 'Do all of Manhattan before the Sunday night assignment closes')
) as v(id, caption_text)
where c.id = v.id;
