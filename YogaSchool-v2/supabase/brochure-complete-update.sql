-- =====================================================================
-- COMPLETE BROCHURE UPDATE: run this ONE script once in Supabase > SQL Editor.
-- Part 1: class descriptions, Level 4 hidden, membership benefits, General Yoga class.
-- Part 2: timetable (24 classes) exactly as in the brochure.
-- Runs as one transaction: if anything fails, nothing is changed.
-- =====================================================================
begin;

-- ===== PART 1 =====
-- =====================================================================
-- Class descriptions: exact wording from the printed brochure.
-- Run once in Supabase > SQL Editor. Only the description (and summary) of existing
-- classes is changed, plus one General Yoga row that is missing. Timings, prices, images
-- and sort order of existing rows are not touched.
-- The live site reads these rows (refreshes within 60 s), so the old text stays until this runs.
-- =====================================================================

-- The Level 1 row was saved under the slug 'beginners' and holds the "Progression" paragraph.
update public.classes set
  summary = 'The perfect way to start yoga, this entry level class is suitable for absolute beginners and anyone wanting a slower practice with time to explore the postures and foundations of yoga in detail.',
  description = 'The perfect way to start yoga, this entry level class is suitable for absolute beginners and anyone wanting a slower practice with time to explore the postures and foundations of yoga in detail.'
where slug in ('beginners', 'l1');

update public.classes set
  summary = 'A quicker-paced practice incorporating Vinyasa to build strength, create heat and improve focus. Stronger postures are introduced, with modifications available.',
  description = 'A quicker-paced practice incorporating Vinyasa to build strength, create heat and improve focus. Stronger postures are introduced, with modifications available.'
where slug = 'l2';

update public.classes set
  summary = 'A more challenging practice with increasingly demanding postures. Recommended for students comfortable with Level 2 and ready to progress.',
  description = 'A more challenging practice with increasingly demanding postures. Recommended for students comfortable with Level 2 and ready to progress.'
where slug = 'l3';

update public.classes set
  summary = 'ALL LEVEL CLASSES Suitable for all levels, including beginners. Easier postures are offered first, with more challenging options for experienced students. COMBINED LEVEL CLASSES Predominantly taught at the lower level, with higher-level postures offered as options for experienced students and those wishing to progress.',
  description = 'ALL LEVEL CLASSES Suitable for all levels, including beginners. Easier postures are offered first, with more challenging options for experienced students.

COMBINED LEVEL CLASSES Predominantly taught at the lower level, with higher-level postures offered as options for experienced students and those wishing to progress.'
where slug = 'all';

update public.classes set
  summary = 'Targeting deep connective tissues, fascia, ligaments, joints and bones. Slow and meditative, allowing time and space to turn inwards.',
  description = 'Targeting deep connective tissues, fascia, ligaments, joints and bones. Slow and meditative, allowing time and space to turn inwards.'
where slug = 'yin';

update public.classes set
  summary = 'For seniors and those with disabilities, or recovering from illness, injury or surgery.',
  description = 'For seniors and those with disabilities, or recovering from illness, injury or surgery.'
where slug = 'chair';

update public.classes set
  summary = 'STRENGTH Become a stronger, fitter and more agile version of yourself. Our strength classes teach you how to control your body using a mixture of calisthenics strength skills, weighted exercises, ground movement and fun group challenges. These classes will take you through a mix of upper-body, lower-body and core strength exercises to help build your base of strength. MOBILITY Be like bamboo: be able to bend, but not break. Our mobility classes aim to create a supple yet resilient body through an approach that covers flexibility, joint mobility and stability, and (p)rehab. These classes will prepare the body for the rigours of daily movement and are a perfect supplement to your strength training, or as a stretching practice on their own.',
  description = 'STRENGTH Become a stronger, fitter and more agile version of yourself. Our strength classes teach you how to control your body using a mixture of calisthenics strength skills, weighted exercises, ground movement and fun group challenges. These classes will take you through a mix of upper-body, lower-body and core strength exercises to help build your base of strength.

MOBILITY Be like bamboo: be able to bend, but not break. Our mobility classes aim to create a supple yet resilient body through an approach that covers flexibility, joint mobility and stability, and (p)rehab. These classes will prepare the body for the rigours of daily movement and are a perfect supplement to your strength training, or as a stretching practice on their own.'
where slug = 'shoshin';

-- Level 4 is not in the brochure (Levels 1-3 only): hidden, not deleted, so it can be switched back on in /admin > Classes.
update public.classes set published = false where slug = 'l4';

-- Membership benefits: brochure wording (10% off retail shop / 1 free guest pass per month / $10 kids class passes).
update public.prices set features = array['Knoff Yoga, Yin Yoga & Chair Yoga', 'Monthly Sunday Sessions', '10% off retail shop', '1 free guest pass per month', '$10 kids class passes']
where category = 'membership' and name = 'Yoga Only';
update public.prices set features = array['Unlimited yoga & Shoshin classes', 'Monthly Sunday Sessions', '10% off retail shop', '1 free guest pass per month', '$10 kids class passes']
where category = 'membership' and name = 'Everything';
update public.prices set features = array['All Shoshin strength & mobility classes', '10% off retail shop', '1 free guest pass per month', '$10 kids class passes']
where category = 'membership' and name = 'Shoshin Only';

-- General Yoga has no row in the database yet (it is on the built-in list only). Added between All Levels and Yin.
insert into public.classes (slug, name, level, duration, summary, description, tag, image_url, sort, published)
select 'general', 'General Yoga', 'All levels & beginners', '60–75 min',
  'GENERAL YOGA - ALL LEVELS A balanced practice suitable for all levels, with options to adapt postures and movement to suit your experience. GENERAL YOGA - BEGINNERS An introduction to yoga, exploring foundational postures, movement and breath in a supportive and accessible practice.',
  'GENERAL YOGA - ALL LEVELS A balanced practice suitable for all levels, with options to adapt postures and movement to suit your experience.

GENERAL YOGA - BEGINNERS An introduction to yoga, exploring foundational postures, movement and breath in a supportive and accessible practice.',
  null, '/images/gallery/DSC00131.jpg', 45, true
where not exists (select 1 from public.classes where slug = 'general');


-- ===== PART 2 =====
-- =====================================================================
-- Timetable: class names and times exactly as in the printed brochure
-- (18 yoga classes + 6 Shoshin classes = the "24 to choose from").
-- Run AFTER brochure-class-descriptions.sql (it creates the General Yoga class used below).
-- Run once in Supabase > SQL Editor. Teacher names are not in the brochure, so a teacher is
-- carried over only where an existing row has the same day and start time; otherwise it is left blank
-- (fill in /admin > Timetable). The Saturday "Workshops - Contact for details" line has no time, so it
-- is not a timetable row.
-- =====================================================================

create temp table old_tt as select day_of_week, start_time, teacher, book_url from public.timetable;

delete from public.timetable;

insert into public.timetable (day_of_week, start_time, end_time, class_name, class_slug, published)
select v.d, v.s::time, v.e::time, v.n, v.slug, true
from (values
  -- Yoga timetable
  (1, '06:00', '07:00', 'KF All Levels', 'all'),
  (1, '10:00', '11:15', 'KF Level 2 - Beginner', 'l2'),
  (1, '16:30', '17:30', 'KF Levels 2 and 3', 'all'),
  (2, '10:00', '11:15', 'KF Level 1 - Introduction to Yoga', (select slug from public.classes where slug in ('l1','beginners') order by slug limit 1)),
  (2, '13:00', '14:00', 'KF Chair Yoga', 'chair'),
  (2, '17:45', '18:45', 'KF All Levels', 'all'),
  (3, '10:00', '11:15', 'General Yoga - All Levels', 'general'),
  (3, '16:30', '17:30', 'General Yoga - Beginner', 'general'),
  (3, '17:45', '18:45', 'Yin Yoga', 'yin'),
  (4, '06:00', '07:00', 'KF All Levels', 'all'),
  (4, '10:00', '11:15', 'KF Level 2 - Beginner', 'l2'),
  (5, '10:00', '11:15', 'KF All Levels', 'all'),
  (5, '17:45', '18:45', 'Yin Yoga', 'yin'),
  (6, '08:30', '09:30', 'KF All Levels', 'all'),
  (6, '10:00', '11:15', 'KF Level 2 - Beginner', 'l2'),
  (7, '08:30', '10:00', 'KF Level 3', 'l3'),
  (7, '14:00', '15:15', 'KF Level 1 - Introduction to Yoga', (select slug from public.classes where slug in ('l1','beginners') order by slug limit 1)),
  (7, '16:00', '17:00', 'Yin Yoga', 'yin'),
  -- Shoshin classes
  (1, '17:45', '18:45', 'Strength', 'shoshin'),
  (1, '18:45', '19:45', 'Mobility', 'shoshin'),
  (2, '16:30', '17:30', 'Strength', 'shoshin'),
  (4, '17:15', '18:15', 'Strength', 'shoshin'),
  (4, '18:15', '19:15', 'Mobility', 'shoshin'),
  (5, '16:30', '17:30', 'Strength', 'shoshin')
) as v(d, s, e, n, slug);

-- keep teachers / booking links where the same day and start time existed before
update public.timetable t set
  teacher = o.teacher,
  book_url = o.book_url
from old_tt o
where o.day_of_week = t.day_of_week and o.start_time = t.start_time;

commit;

