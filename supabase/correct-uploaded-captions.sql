update public.captions as c set caption_text = v.caption_text
from (values
('05794cb5-3d43-448a-a29e-712cdca40044'::uuid, 'When Columbia Housing says “cozy” and you finally see the room.'),
('de1bdd9e-fdad-49f1-8ae3-0844ab8d707f'::uuid, 'Me realizing my Columbia dorm bed, desk, and closet are all within arm’s reach.'),
('1c780892-3217-4771-9acf-67a0b856a96f'::uuid, 'First-year move-in at Columbia: two suitcases, one room, no visible floor.'),
('269ee0df-ab5c-4ac6-a739-34cae2fbeb16'::uuid, 'That first look around the Columbia dorm before making the hallway part of the storage plan.'),
('55122d43-439b-4e10-b7eb-1cc252d5a030'::uuid, 'Opening the Columbia Housing door and immediately revising the interior-design plan.'),
('4fdd7ef5-15ff-4028-b08f-04d8fca2838f'::uuid, 'Me checking whether “compact” was hidden somewhere in the Columbia Housing description.'),
('20a0fe98-1efe-46a2-85fd-16f204866806'::uuid, 'First day in a Columbia dorm: the bed is also the chair, couch, and emotional-support furniture.'),
('505592df-6633-4579-8cbb-742f8e103c77'::uuid, 'When the Columbia campus tour showed the lawns but skipped the first look inside the dorm room.')
) as v(id, caption_text)
where c.id = v.id;
