import { IntentCategory, FreshnessData } from './types';

export interface DemoVideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
}

export interface DemoClassification {
  comment_index: number;
  category: string;
  intent_score: number;
  location: string | null;
  key_phrase: string;
}

export interface DemoComment {
  text: string;
  authorName: string;
  likeCount: number;
  publishedAt: string;
}

export interface DemoAnalysisData {
  classifications: DemoClassification[];
  categoryCounts: Record<IntentCategory, number>;
  rawScore: number;
  densityScore: number;
  averageIntentScore: number;
  geoMentions: { location: string; count: number }[];
  freshness: FreshnessData;
  comments: DemoComment[];
  debugInfo: {
    relevanceCount: number;
    timeCount: number;
    uniqueCount: number;
    analysisTimeMs: number;
    totalCharacters: number;
  };
}

// Real channel data from @usamasyed
export const DEMO_CHANNEL = {
  channelId: 'UC7f2bEUhR5_Q334q8tOky1Q',
  title: 'Dr. Usama Syed',
  description: 'Board-certified dermatologist sharing evidence-based skincare advice.',
  subscriberCount: 226000,
  videoCount: 112,
  thumbnail: 'https://yt3.ggpht.com/CTX4F7pi7oZtS4Z3L49m9mWFMf1_TKSnraWO1mg_H-6WmfXSI9aFeUjgZSRJBUcAhaUkYzYGNA=s240-c-k-c0x00ffffff-no-rj',
  uploadsPlaylistId: 'UU7f2bEUhR5_Q334q8tOky1Q',
};

// Real top videos - target video first, then sorted by views (from live API)
export const DEMO_VIDEOS: DemoVideoData[] = [
  {
    videoId: 'l5YQOwGbDAk',
    title: 'Why Your Lips Are ALWAYS Dry (Dermatologist)',
    thumbnail: 'https://i.ytimg.com/vi/l5YQOwGbDAk/hqdefault.jpg',
    viewCount: 141343,
    likeCount: 4093,
    commentCount: 444,
    publishedAt: '2024-03-12T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'k3aIeABbNvY',
    title: 'Why I QUIT Skincare Videos (Dermatologist)',
    thumbnail: 'https://i.ytimg.com/vi/k3aIeABbNvY/hqdefault.jpg',
    viewCount: 3160728,
    likeCount: 126305,
    commentCount: 6533,
    publishedAt: '2022-07-21T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'Xxb6EIKpS3s',
    title: 'Why You NEED To Use A Retinoid For Your Skin (Dermatologist)',
    thumbnail: 'https://i.ytimg.com/vi/Xxb6EIKpS3s/hqdefault.jpg',
    viewCount: 2014639,
    likeCount: 44707,
    commentCount: 2860,
    publishedAt: '2021-07-27T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'fyN3H1ZekTY',
    title: "You're Using Benzoyl Peroxide WRONG",
    thumbnail: 'https://i.ytimg.com/vi/fyN3H1ZekTY/hqdefault.jpg',
    viewCount: 884444,
    likeCount: 9539,
    commentCount: 211,
    publishedAt: '2023-08-23T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'y5d_iIgH3Pc',
    title: '99% Overlook These Effective Acne Treatments',
    thumbnail: 'https://i.ytimg.com/vi/y5d_iIgH3Pc/hqdefault.jpg',
    viewCount: 667583,
    likeCount: 20692,
    commentCount: 1104,
    publishedAt: '2023-07-05T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'f_sMpdifzVc',
    title: 'How To Treat Eczema (Dermatologist Explains)',
    thumbnail: 'https://i.ytimg.com/vi/f_sMpdifzVc/hqdefault.jpg',
    viewCount: 579578,
    likeCount: 10420,
    commentCount: 887,
    publishedAt: '2022-04-14T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'lw_3SevearE',
    title: 'How To Treat Acne Scarring (2025)',
    thumbnail: 'https://i.ytimg.com/vi/lw_3SevearE/hqdefault.jpg',
    viewCount: 436858,
    likeCount: 13180,
    commentCount: 847,
    publishedAt: '2023-01-09T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
  {
    videoId: 'iDgHqa_MI0Q',
    title: 'Struggling with Rosacea? Here Are the Best Treatments',
    thumbnail: 'https://i.ytimg.com/vi/iDgHqa_MI0Q/hqdefault.jpg',
    viewCount: 353478,
    likeCount: 10739,
    commentCount: 881,
    publishedAt: '2023-08-23T00:00:00Z',
    channelTitle: 'Dr. Usama Syed',
  },
];

// The target video for analysis (first in the list)
export const DEMO_TARGET_VIDEO = DEMO_VIDEOS[0];

// Pre-baked comments
const DEMO_COMMENTS: DemoComment[] = [
  { text: 'Hi how can I contact you for a question?', authorName: '@sal-fay11', likeCount: 2, publishedAt: '2025-02-07T10:30:00Z' },
  { text: 'So excited for the app! \u{1F497}', authorName: '@Chipstertw', likeCount: 0, publishedAt: '2025-02-03T14:20:00Z' },
  { text: 'Sir my girl baby 3years old. Upper centre lip light swelling and lower lip dry crack help me doctor. Dr priscriped ointment one month use not improve', authorName: '@ashadevi9493', likeCount: 0, publishedAt: '2025-01-28T08:15:00Z' },
  { text: "Help they gave me isotretinoin, it's been over 8 months since I stopped and my lips have never gone back to normal. the mucosal lining posterior to the vermillion border is completely destroyed, when it comes into contact with water, it dissolves and turns into a white, pasty, disgusting material.", authorName: '@siyamthandambatha3065', likeCount: 1, publishedAt: '2025-01-25T16:45:00Z' },
  { text: 'As someone with eczema, i suffer from so much things, more than just this, I even suffered from eye infections and eye drynesses from the age of 11 to 15, and it was the worst thing ever.', authorName: '@anonymoususer', likeCount: 1, publishedAt: '2025-01-22T12:00:00Z' },
  { text: "I'm from New York, is there any way to book an appointment with you?", authorName: '@nycpatient', likeCount: 3, publishedAt: '2025-02-01T09:30:00Z' },
  { text: "This is the most helpful video I've found on this topic. Thank you Dr. Syed!", authorName: '@gratefulviewer', likeCount: 12, publishedAt: '2025-01-20T15:00:00Z' },
  { text: 'Great video, very informative!', authorName: '@casualviewer', likeCount: 5, publishedAt: '2025-01-18T11:00:00Z' },
  { text: "Can you help me? My lips have been peeling for 3 months straight and nothing works. I've tried aquaphor, vaseline, lanolin... everything. The corners of my mouth are cracked and painful.", authorName: '@desperatelips22', likeCount: 4, publishedAt: '2025-01-30T07:20:00Z' },
  { text: 'I went to 3 different dermatologists and they all just told me to use chapstick. Chapstick! For angular cheilitis! The healthcare system is a joke sometimes.', authorName: '@frustratedpatient', likeCount: 8, publishedAt: '2025-01-27T13:00:00Z' },
  { text: 'Doctor I have been suffering from this for years. I live in Philly, do you do virtual consultations?', authorName: '@phillyskin', likeCount: 1, publishedAt: '2025-01-26T10:00:00Z' },
  { text: 'My doctor just kept prescribing steroid creams that made it worse. Finally found your channel and things are improving.', authorName: '@healingjourney', likeCount: 6, publishedAt: '2025-01-24T16:30:00Z' },
  { text: "Thank you so much for this! I've been dealing with dry lips for years and finally understand why.", authorName: '@thankyoudoc', likeCount: 3, publishedAt: '2025-01-23T09:00:00Z' },
  { text: "Interesting video! Didn't know about the connection to vitamin deficiency.", authorName: '@learner2025', likeCount: 2, publishedAt: '2025-01-22T14:00:00Z' },
  { text: "Does this apply to people with Sjogren's syndrome too? My rheumatologist isn't very helpful with skin issues.", authorName: '@autoimmune_q', likeCount: 3, publishedAt: '2025-01-21T11:30:00Z' },
  { text: 'Just subscribed! Your explanations are so clear compared to other doctors on YouTube.', authorName: '@newsubscriber', likeCount: 1, publishedAt: '2025-01-20T08:00:00Z' },
  { text: 'Watching from the U.S. Wish more doctors explained things like you do.', authorName: '@usviewer', likeCount: 0, publishedAt: '2025-01-19T17:00:00Z' },
  { text: "Is there a connection between lip dryness and gut health? I've heard conflicting things.", authorName: '@guthealth_curious', likeCount: 4, publishedAt: '2025-01-19T10:00:00Z' },
  { text: "My daughter has the same issue. We've tried everything. Please help!", authorName: '@worriedmom', likeCount: 2, publishedAt: '2025-01-18T13:45:00Z' },
  { text: "I have chronic eczema and lip licker's dermatitis and it's ruining my confidence. Every winter it gets unbearable. What products do you actually recommend?", authorName: '@winterlips', likeCount: 5, publishedAt: '2025-01-17T16:00:00Z' },
  { text: 'First!', authorName: '@first_commenter', likeCount: 0, publishedAt: '2025-01-15T01:00:00Z' },
  { text: 'Love your content, always learn something new.', authorName: '@loyalfan', likeCount: 2, publishedAt: '2025-01-16T12:00:00Z' },
  { text: 'Can you do a video about perioral dermatitis next?', authorName: '@topicrequest', likeCount: 7, publishedAt: '2025-01-17T09:00:00Z' },
  { text: "My lips started peeling after I started accutane 2 months ago. Is this permanent?? I'm so scared.", authorName: '@accutane_worry', likeCount: 3, publishedAt: '2025-01-29T11:00:00Z' },
  { text: 'Shared this with my family group chat. Super helpful!', authorName: '@sharedfamily', likeCount: 1, publishedAt: '2025-01-16T08:00:00Z' },
  { text: "I'm a dental hygienist and see patients with angular cheilitis all the time. Great explanation of the causes.", authorName: '@dentalhygienist', likeCount: 9, publishedAt: '2025-01-18T14:00:00Z' },
  { text: 'What about people who are on immunosuppressants? My lips have been destroyed since starting mycophenolate.', authorName: '@immunopatient', likeCount: 2, publishedAt: '2025-01-25T09:00:00Z' },
  { text: 'Nice video doc!', authorName: '@quickcomment', likeCount: 0, publishedAt: '2025-01-15T04:00:00Z' },
  { text: "I've been using your recommended routine and my lips are finally healing after 6 months of suffering. You saved me.", authorName: '@healed_finally', likeCount: 14, publishedAt: '2025-02-05T10:00:00Z' },
  { text: "Is it true that licking your lips makes it worse? I can't stop the habit.", authorName: '@badhabit', likeCount: 3, publishedAt: '2025-01-21T15:00:00Z' },
  { text: "Algorithm brought me here and I'm not disappointed.", authorName: '@algo_viewer', likeCount: 1, publishedAt: '2025-01-17T20:00:00Z' },
  { text: "Better than any article I've read online about this.", authorName: '@articlereader', likeCount: 2, publishedAt: '2025-01-18T07:00:00Z' },
  { text: 'Needed this today.', authorName: '@needed_this', likeCount: 0, publishedAt: '2025-01-15T12:00:00Z' },
  { text: "My GP told me it was \"just dry skin\" and to drink more water. After watching your videos I realized it's actually eczematous cheilitis. Got proper treatment and it cleared up in 2 weeks.", authorName: '@misdiagnosed', likeCount: 11, publishedAt: '2025-01-28T15:00:00Z' },
  { text: 'Do you accept insurance for telehealth visits?', authorName: '@insurance_q', likeCount: 1, publishedAt: '2025-01-31T08:00:00Z' },
  { text: 'The quality of your content is amazing. Keep it up!', authorName: '@qualityfan', likeCount: 4, publishedAt: '2025-01-19T13:00:00Z' },
  { text: "Watching this at 3am because my lips are so painful I can't sleep.", authorName: '@3am_viewer', likeCount: 6, publishedAt: '2025-01-24T03:00:00Z' },
  { text: "I'm a New Yorker and I swear the winter here destroys my skin. Any tips for cold weather lip care?", authorName: '@nywinter', likeCount: 2, publishedAt: '2025-01-23T18:00:00Z' },
  { text: 'Very informative as always doctor.', authorName: '@regular_viewer', likeCount: 1, publishedAt: '2025-01-16T15:00:00Z' },
  { text: 'Can chronic lip dryness be a sign of something more serious? Should I get blood work done?', authorName: '@worried_viewer', likeCount: 5, publishedAt: '2025-01-20T11:00:00Z' },
  { text: 'Thank you doctor for always giving real medical info and not just selling products.', authorName: '@honest_viewer', likeCount: 8, publishedAt: '2025-01-22T09:00:00Z' },
  { text: 'Subscribing immediately. This is gold.', authorName: '@instant_sub', likeCount: 1, publishedAt: '2025-01-15T06:00:00Z' },
  { text: 'I wonder if altitude affects lip dryness. I moved to Denver and my lips have been horrible since.', authorName: '@denver_move', likeCount: 0, publishedAt: '2025-01-17T14:00:00Z' },
  { text: 'Could you talk about lip filler complications in a future video?', authorName: '@filler_question', likeCount: 3, publishedAt: '2025-01-19T08:00:00Z' },
  { text: 'The thumbnail got me. Glad I clicked though, super educational.', authorName: '@thumbnail_click', likeCount: 0, publishedAt: '2025-01-15T09:00:00Z' },
  { text: 'Been following your channel for a year now. Every video delivers.', authorName: '@yearlong_fan', likeCount: 3, publishedAt: '2025-01-20T17:00:00Z' },
  { text: "I'm a medical student and your videos help me understand derm so much better than my textbooks.", authorName: '@medstudent', likeCount: 7, publishedAt: '2025-01-21T08:00:00Z' },
  { text: 'Please help I have cracked bleeding lips every single day and nothing helps.', authorName: '@bleeding_lips', likeCount: 2, publishedAt: '2025-01-26T12:00:00Z' },
  { text: 'Can lip dryness be caused by toothpaste? I switched brands and it got worse.', authorName: '@toothpaste_theory', likeCount: 4, publishedAt: '2025-01-23T10:00:00Z' },
  { text: 'Just booked a consultation through FutureClinic. Looking forward to it!', authorName: '@booked_patient', likeCount: 0, publishedAt: '2025-02-02T11:00:00Z' },
  { text: "My eczema makes my lips SO dry in the winter. It's a nightmare.", authorName: '@eczema_winter', likeCount: 3, publishedAt: '2025-01-24T09:00:00Z' },
  { text: 'What about using honey as a lip mask? Is that actually effective or just a myth?', authorName: '@honey_mask', likeCount: 1, publishedAt: '2025-01-22T16:00:00Z' },
  { text: 'Going through chemo right now and the lip dryness is unbearable. Any recommendations for cancer patients specifically?', authorName: '@chemo_patient', likeCount: 10, publishedAt: '2025-01-27T08:00:00Z' },
  { text: 'Solid advice. Already shared with friends.', authorName: '@sharer', likeCount: 0, publishedAt: '2025-01-16T18:00:00Z' },
  { text: 'You have such a calming voice doc. Makes these topics less scary.', authorName: '@calming_voice', likeCount: 2, publishedAt: '2025-01-18T10:00:00Z' },
  { text: 'Wish my dermatologist explained things this clearly.', authorName: '@wish_clear', likeCount: 5, publishedAt: '2025-01-19T15:00:00Z' },
  { text: "Does sleeping with a humidifier actually help? I've been running one for a month.", authorName: '@humidifier_user', likeCount: 2, publishedAt: '2025-01-21T12:00:00Z' },
  { text: 'My dermatologist literally told me to "just stop licking your lips" as if that\'s helpful advice. No actual medical treatment offered.', authorName: '@unhelpful_derm', likeCount: 7, publishedAt: '2025-01-25T14:00:00Z' },
  { text: 'Binge watching all your videos today. So educational!', authorName: '@binge_watcher', likeCount: 1, publishedAt: '2025-01-17T11:00:00Z' },
  { text: 'Thank you for making dermatology accessible to everyone.', authorName: '@accessible_derm', likeCount: 3, publishedAt: '2025-01-18T16:00:00Z' },
  { text: "I've had chronic angular cheilitis for 5 years. Multiple doctors, multiple treatments, nothing works long-term. I'm at my wit's end.", authorName: '@chronic_angular', likeCount: 4, publishedAt: '2025-01-29T07:00:00Z' },
  { text: 'Do you have any tips for athletes? My lips crack every time I train outdoors.', authorName: '@athlete_lips', likeCount: 1, publishedAt: '2025-01-20T14:00:00Z' },
  { text: 'This should be required watching for every person.', authorName: '@required_watching', likeCount: 0, publishedAt: '2025-01-15T15:00:00Z' },
  { text: 'I had no idea lip balm could actually make things worse. Mind blown.', authorName: '@mind_blown', likeCount: 6, publishedAt: '2025-01-19T11:00:00Z' },
  { text: "Been dealing with this since childhood. Your video gave me hope that it's treatable.", authorName: '@childhood_issue', likeCount: 2, publishedAt: '2025-01-23T15:00:00Z' },
  { text: 'W doctor', authorName: '@w_comment', likeCount: 0, publishedAt: '2025-01-15T03:00:00Z' },
  { text: "My lips are my biggest insecurity. They're always peeling and flaking no matter what I do. Is there a permanent solution?", authorName: '@insecure_lips', likeCount: 3, publishedAt: '2025-01-26T15:00:00Z' },
  { text: 'Can you review CeraVe healing ointment vs Aquaphor for lips specifically?', authorName: '@product_review', likeCount: 4, publishedAt: '2025-01-22T07:00:00Z' },
  { text: 'Great content as always Dr. Syed. Your channel has genuinely improved my skin health.', authorName: '@improved_skin', likeCount: 5, publishedAt: '2025-01-21T17:00:00Z' },
  { text: "I spent $200 at Sephora on lip products and NONE of them worked. Wish I found your channel sooner.", authorName: '@sephora_waste', likeCount: 8, publishedAt: '2025-01-24T12:00:00Z' },
  { text: 'Can pregnancy cause chronic lip dryness? I never had this issue before.', authorName: '@pregnant_lips', likeCount: 1, publishedAt: '2025-01-25T11:00:00Z' },
  { text: 'The way you break down complex topics is incredible. More doctors should be like this.', authorName: '@breakdown_fan', likeCount: 4, publishedAt: '2025-01-20T08:00:00Z' },
  { text: 'Notification squad! Never miss a video.', authorName: '@notification_squad', likeCount: 0, publishedAt: '2025-01-15T00:30:00Z' },
  { text: "What role does diet play in lip health? I went vegan and my lips got much worse.", authorName: '@vegan_lips', likeCount: 3, publishedAt: '2025-01-23T13:00:00Z' },
  { text: 'Is there a link between lip dryness and hypothyroidism? I have both.', authorName: '@thyroid_question', likeCount: 6, publishedAt: '2025-01-24T07:00:00Z' },
  { text: 'Brilliant video. Shared to all my social media.', authorName: '@social_sharer', likeCount: 1, publishedAt: '2025-01-17T13:00:00Z' },
  { text: "Tried your suggestions and I'm already seeing improvement after just 1 week! Thank you!", authorName: '@one_week_results', likeCount: 9, publishedAt: '2025-01-30T12:00:00Z' },
  { text: 'I\'m a nurse practitioner and I frequently recommend your channel to my patients.', authorName: '@np_recommends', likeCount: 11, publishedAt: '2025-01-19T09:00:00Z' },
  { text: 'Would love to see a video on lip discoloration too.', authorName: '@lip_color', likeCount: 2, publishedAt: '2025-01-18T12:00:00Z' },
  { text: 'Wow I never knew about the saliva enzyme damage thing. That explains so much.', authorName: '@enzyme_wow', likeCount: 3, publishedAt: '2025-01-21T10:00:00Z' },
  { text: 'Dr. Syed you are a blessing. My skin has never been better since following your advice.', authorName: '@blessing_fan', likeCount: 4, publishedAt: '2025-01-22T12:00:00Z' },
  { text: 'Ok but what about lip tattoos? Can they cause chronic dryness?', authorName: '@tattoo_q', likeCount: 0, publishedAt: '2025-01-16T07:00:00Z' },
  { text: 'This popped up in my recommended and I genuinely learned something. Rare for YouTube.', authorName: '@rare_learn', likeCount: 2, publishedAt: '2025-01-17T16:00:00Z' },
  { text: 'How do you differentiate between simple chapped lips and something that needs medical attention?', authorName: '@when_to_worry', likeCount: 7, publishedAt: '2025-01-20T13:00:00Z' },
  { text: 'Can retinol use on the face cause lip dryness as a side effect? I just started tretinoin.', authorName: '@tretinoin_user', likeCount: 5, publishedAt: '2025-01-25T16:00:00Z' },
  { text: 'Saving this video to reference whenever someone asks me about lip care.', authorName: '@reference_save', likeCount: 1, publishedAt: '2025-01-18T09:00:00Z' },
  { text: 'You deserve way more subscribers for the quality you put out.', authorName: '@deserve_more', likeCount: 3, publishedAt: '2025-01-19T14:00:00Z' },
  { text: 'Does anyone else feel like their lips are worse in the morning? I wake up with them literally stuck together.', authorName: '@morning_lips', likeCount: 4, publishedAt: '2025-01-23T06:00:00Z' },
];

// Classifications matching each comment
const DEMO_CLASSIFICATIONS: DemoClassification[] = [
  { comment_index: 0, category: 'BOOKING_INTENT', intent_score: 9, location: null, key_phrase: 'how can I contact you' },
  { comment_index: 1, category: 'BOOKING_INTENT', intent_score: 9, location: null, key_phrase: 'So excited for the app' },
  { comment_index: 2, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: 'help me doctor' },
  { comment_index: 3, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: 'lips have never gone back to normal' },
  { comment_index: 4, category: 'MEDICAL_HELP_SEEKING', intent_score: 7, location: null, key_phrase: 'suffer from so much things' },
  { comment_index: 5, category: 'GEOGRAPHIC_MENTION', intent_score: 6, location: 'New York', key_phrase: "I'm from New York" },
  { comment_index: 6, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'most helpful video' },
  { comment_index: 7, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'very informative' },
  { comment_index: 8, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: 'nothing works' },
  { comment_index: 9, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 8, location: null, key_phrase: 'told me to use chapstick for angular cheilitis' },
  { comment_index: 10, category: 'GEOGRAPHIC_MENTION', intent_score: 7, location: 'Philly', key_phrase: 'I live in Philly' },
  { comment_index: 11, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 7, location: null, key_phrase: 'prescribing steroid creams that made it worse' },
  { comment_index: 12, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'finally understand why' },
  { comment_index: 13, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'connection to vitamin deficiency' },
  { comment_index: 14, category: 'MEDICAL_HELP_SEEKING', intent_score: 7, location: null, key_phrase: "Sjogren's syndrome" },
  { comment_index: 15, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Just subscribed' },
  { comment_index: 16, category: 'GEOGRAPHIC_MENTION', intent_score: 3, location: 'U.S.', key_phrase: 'Watching from the U.S.' },
  { comment_index: 17, category: 'MEDICAL_HELP_SEEKING', intent_score: 5, location: null, key_phrase: 'connection between lip dryness and gut health' },
  { comment_index: 18, category: 'MEDICAL_HELP_SEEKING', intent_score: 7, location: null, key_phrase: "We've tried everything. Please help" },
  { comment_index: 19, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: "chronic eczema and lip licker's dermatitis" },
  { comment_index: 20, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'First' },
  { comment_index: 21, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'always learn something new' },
  { comment_index: 22, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'perioral dermatitis' },
  { comment_index: 23, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: "Is this permanent? I'm so scared" },
  { comment_index: 24, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Shared this with my family' },
  { comment_index: 25, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'dental hygienist' },
  { comment_index: 26, category: 'MEDICAL_HELP_SEEKING', intent_score: 7, location: null, key_phrase: 'lips have been destroyed since starting mycophenolate' },
  { comment_index: 27, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'Nice video' },
  { comment_index: 28, category: 'GRATITUDE_ENGAGEMENT', intent_score: 4, location: null, key_phrase: 'You saved me' },
  { comment_index: 29, category: 'MEDICAL_HELP_SEEKING', intent_score: 5, location: null, key_phrase: 'licking your lips makes it worse' },
  { comment_index: 30, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'Algorithm brought me here' },
  { comment_index: 31, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Better than any article' },
  { comment_index: 32, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'Needed this today' },
  { comment_index: 33, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 8, location: null, key_phrase: 'GP told me it was just dry skin' },
  { comment_index: 34, category: 'BOOKING_INTENT', intent_score: 6, location: null, key_phrase: 'accept insurance for telehealth' },
  { comment_index: 35, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'quality of your content' },
  { comment_index: 36, category: 'MEDICAL_HELP_SEEKING', intent_score: 7, location: null, key_phrase: "lips are so painful I can't sleep" },
  { comment_index: 37, category: 'GEOGRAPHIC_MENTION', intent_score: 4, location: 'New York', key_phrase: "I'm a New Yorker" },
  { comment_index: 38, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Very informative as always' },
  { comment_index: 39, category: 'MEDICAL_HELP_SEEKING', intent_score: 6, location: null, key_phrase: 'sign of something more serious' },
  { comment_index: 40, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'giving real medical info' },
  { comment_index: 41, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Subscribing immediately' },
  { comment_index: 42, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'altitude affects lip dryness' },
  { comment_index: 43, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'lip filler complications' },
  { comment_index: 44, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'thumbnail got me' },
  { comment_index: 45, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'Every video delivers' },
  { comment_index: 46, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'understand derm so much better' },
  { comment_index: 47, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: 'cracked bleeding lips every single day' },
  { comment_index: 48, category: 'MEDICAL_HELP_SEEKING', intent_score: 5, location: null, key_phrase: 'toothpaste cause lip dryness' },
  { comment_index: 49, category: 'BOOKING_INTENT', intent_score: 9, location: null, key_phrase: 'Just booked a consultation through FutureClinic' },
  { comment_index: 50, category: 'MEDICAL_HELP_SEEKING', intent_score: 6, location: null, key_phrase: 'eczema makes my lips SO dry' },
  { comment_index: 51, category: 'GENERAL', intent_score: 3, location: null, key_phrase: 'honey as a lip mask' },
  { comment_index: 52, category: 'MEDICAL_HELP_SEEKING', intent_score: 9, location: null, key_phrase: 'going through chemo' },
  { comment_index: 53, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Shared to all my social media' },
  { comment_index: 54, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'calming voice' },
  { comment_index: 55, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 6, location: null, key_phrase: 'Wish my dermatologist explained things' },
  { comment_index: 56, category: 'GENERAL', intent_score: 3, location: null, key_phrase: 'sleeping with a humidifier' },
  { comment_index: 57, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 8, location: null, key_phrase: 'told me to just stop licking your lips' },
  { comment_index: 58, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Binge watching all your videos' },
  { comment_index: 59, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'making dermatology accessible' },
  { comment_index: 60, category: 'MEDICAL_HELP_SEEKING', intent_score: 8, location: null, key_phrase: 'chronic angular cheilitis for 5 years' },
  { comment_index: 61, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'tips for athletes' },
  { comment_index: 62, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'required watching' },
  { comment_index: 63, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'lip balm could actually make things worse' },
  { comment_index: 64, category: 'MEDICAL_HELP_SEEKING', intent_score: 5, location: null, key_phrase: 'dealing with this since childhood' },
  { comment_index: 65, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'W doctor' },
  { comment_index: 66, category: 'MEDICAL_HELP_SEEKING', intent_score: 7, location: null, key_phrase: 'biggest insecurity, always peeling' },
  { comment_index: 67, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'CeraVe vs Aquaphor' },
  { comment_index: 68, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'channel has genuinely improved my skin' },
  { comment_index: 69, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 6, location: null, key_phrase: 'spent $200 and NONE of them worked' },
  { comment_index: 70, category: 'MEDICAL_HELP_SEEKING', intent_score: 5, location: null, key_phrase: 'pregnancy cause chronic lip dryness' },
  { comment_index: 71, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'break down complex topics' },
  { comment_index: 72, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'Notification squad' },
  { comment_index: 73, category: 'GENERAL', intent_score: 3, location: null, key_phrase: 'diet play in lip health' },
  { comment_index: 74, category: 'MEDICAL_HELP_SEEKING', intent_score: 6, location: null, key_phrase: 'link between lip dryness and hypothyroidism' },
  { comment_index: 75, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Brilliant video' },
  { comment_index: 76, category: 'GRATITUDE_ENGAGEMENT', intent_score: 4, location: null, key_phrase: 'already seeing improvement after just 1 week' },
  { comment_index: 77, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'recommend your channel to my patients' },
  { comment_index: 78, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'lip discoloration' },
  { comment_index: 79, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'saliva enzyme damage' },
  { comment_index: 80, category: 'GRATITUDE_ENGAGEMENT', intent_score: 3, location: null, key_phrase: 'you are a blessing' },
  { comment_index: 81, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'lip tattoos' },
  { comment_index: 82, category: 'GENERAL', intent_score: 1, location: null, key_phrase: 'popped up in my recommended' },
  { comment_index: 83, category: 'MEDICAL_HELP_SEEKING', intent_score: 6, location: null, key_phrase: 'differentiate between simple chapped lips and medical attention' },
  { comment_index: 84, category: 'MEDICAL_HELP_SEEKING', intent_score: 6, location: null, key_phrase: 'just started tretinoin' },
  { comment_index: 85, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'Saving this video' },
  { comment_index: 86, category: 'GRATITUDE_ENGAGEMENT', intent_score: 2, location: null, key_phrase: 'deserve way more subscribers' },
  { comment_index: 87, category: 'GENERAL', intent_score: 2, location: null, key_phrase: 'worse in the morning' },
  { comment_index: 88, category: 'FRUSTRATION_WITH_SYSTEM', intent_score: 7, location: null, key_phrase: 'NONE of them worked' },
];

export const DEMO_ANALYSIS: DemoAnalysisData = {
  classifications: DEMO_CLASSIFICATIONS,
  categoryCounts: {
    BOOKING_INTENT: 4,
    MEDICAL_HELP_SEEKING: 21,
    FRUSTRATION_WITH_SYSTEM: 7,
    GEOGRAPHIC_MENTION: 3,
    GRATITUDE_ENGAGEMENT: 25,
    GENERAL: 29,
  },
  rawScore: 142,
  densityScore: 1.005,
  averageIntentScore: 3.8,
  geoMentions: [
    { location: 'New York', count: 2 },
    { location: 'U.S.', count: 1 },
    { location: 'Philly', count: 1 },
  ],
  freshness: {
    lastCommentDate: '2026-02-07T10:30:00Z',
    commentsLast7Days: 0,
    commentsLast30Days: 6,
    badge: 'warm',
  },
  comments: DEMO_COMMENTS,
  debugInfo: {
    relevanceCount: 50,
    timeCount: 50,
    uniqueCount: 89,
    analysisTimeMs: 4200,
    totalCharacters: 18750,
  },
};

export const DEMO_PINNED_COMMENT = "I've noticed many of you in the comments describing persistent struggles with eczematous cheilitis, angular cheilitis, and long-term dryness following isotretinoin treatment. These conditions often require a more nuanced, clinical approach than standard lip balms can provide, especially when symptoms involve chronic peeling or inflammation. To better support those of you seeking specific medical guidance, I am now offering personal consultations through FutureClinic where I can formally review your case and history. Link below if you'd like to connect.";
