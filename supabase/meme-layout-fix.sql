update public.captions as c set caption_text = v.caption_text
from (values
('20000000-0000-4000-8000-000000000101'::uuid, E'Top panel: Reading the assigned chapter\nBottom panel: Color-coding a study schedule for the chapter'),
('20000000-0000-4000-8000-000000000102'::uuid, E'Top panel: Eight hours of sleep\nBottom panel: One more tiny review session at 2 a.m.'),
('20000000-0000-4000-8000-000000000103'::uuid, E'Top panel: Starting the paper\nBottom panel: Choosing the perfect library seat first'),
('20000000-0000-4000-8000-000000000104'::uuid, E'Top panel: Office hours\nBottom panel: Asking the group chat and hoping for the best'),
('20000000-0000-4000-8000-000000000105'::uuid, E'Button 1: Do the laundry now\nButton 2: Buy one more shirt and postpone the problem'),
('20000000-0000-4000-8000-000000000106'::uuid, E'Button 1: Respect quiet hours\nButton 2: Play the song that absolutely needs speakers'),
('20000000-0000-4000-8000-000000000107'::uuid, E'Button 1: Clean before room inspection\nButton 2: Turn off the lights and call it ambiance'),
('20000000-0000-4000-8000-000000000108'::uuid, E'Button 1: Use the last clean towel\nButton 2: Admit it has become part of the decor'),
('20000000-0000-4000-8000-000000000109'::uuid, E'Woman: “This dining hall has nothing.”\nCat: The three full plates she brought back'),
('20000000-0000-4000-8000-000000000110'::uuid, E'Woman: “That pasta is a family recipe.”\nCat: Pasta introduced to sauce six seconds ago'),
('20000000-0000-4000-8000-000000000111'::uuid, E'Woman: “Fries count as a balanced meal during midterms.”\nCat: The untouched salad'),
('20000000-0000-4000-8000-000000000112'::uuid, E'Woman: “You cannot judge my dinner.”\nCat: The friend who used her guest swipe'),
('20000000-0000-4000-8000-000000000117'::uuid, E'Boyfriend: Our actual stop\nGirlfriend: The local train home\nOther person: An express train with mysterious confidence'),
('20000000-0000-4000-8000-000000000118'::uuid, E'Boyfriend: Me\nGirlfriend: Google Maps\nOther person: The friend who said “trust me”'),
('20000000-0000-4000-8000-000000000119'::uuid, E'Boyfriend: Our group\nGirlfriend: Going back to campus\nOther person: One more downtown stop before the last train'),
('20000000-0000-4000-8000-000000000120'::uuid, E'Boyfriend: A reasonable commute\nGirlfriend: The direct route\nOther person: A transfer that saves exactly two minutes'),
('20000000-0000-4000-8000-000000000121'::uuid, E'Panel 1: Visit one museum\nPanel 2: Visit one museum and get bagels\nPanel 3: Museum, bagels, downtown, then finish the reading\nPanel 4: Do all of Manhattan before the Sunday deadline'),
('20000000-0000-4000-8000-000000000122'::uuid, E'Panel 1: Take the subway\nPanel 2: Take the subway without missing the stop\nPanel 3: Make one transfer without opening Maps\nPanel 4: Tell everyone I basically understand New York now'),
('20000000-0000-4000-8000-000000000123'::uuid, E'Panel 1: Start the assignment Sunday morning\nPanel 2: Start it Sunday afternoon\nPanel 3: Start it after the downtown trip\nPanel 4: Submit at 11:59 and call it time management'),
('20000000-0000-4000-8000-000000000124'::uuid, E'Panel 1: Bring an umbrella\nPanel 2: Check the weather app\nPanel 3: Trust the one-hour forecast\nPanel 4: Dress for all four seasons and carry bagels')
) as v(id, caption_text)
where c.id = v.id;
