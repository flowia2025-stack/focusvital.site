/* Brighter Days · Care Tracker
   Aba "app" da área de membros: barra inferior, Today, Residents, Activities, registro de atividades,
   histórico, relatório mensal e sugestões (inclusive de produtos bloqueados, que abrem a oferta).
   Depende do window.BD exposto pelo app.js. Os dados ficam no STORE (hoje: localStorage do aparelho).
   Para salvar no servidor, o dev só precisa trocar STORE.load/STORE.save por chamadas à API. */
(function () {
  'use strict';

  /* ================= Catálogo ================= */
  var CATS = {
    mem:  { label: 'Memory & Reasoning', short: 'Memory', color: '#2B78C2' },
    mov:  { label: 'Movement & Coordination', short: 'Movement', color: '#2F8F57' },
    fam:  { label: 'Family Connection', short: 'Family', color: '#E0603F' },
    mood: { label: 'Mood & Well-Being', short: 'Mood', color: '#E48A12' },
    wk:   { label: 'Memory Workouts', short: 'Memory Workouts', color: '#7A5AC8', offer: 'memory' },
    bed:  { label: 'Bedside & Chair', short: 'Bedside', color: '#C2457A', offer: 'bedridden' },
    fp:   { label: 'Fall-Proof Exercises', short: 'Fall-Proof', color: '#27407F', offer: 'fall-proof' },
    xmas: { label: 'Christmas Activities', short: 'Christmas', color: '#C0392B', offer: 'christmas' },
    alz:  { label: 'Caregiver Protocol', short: 'Protocol', color: '#1F7A8C', offer: 'alzheimer' }
  };

  /* Núcleo (150): número|título|nível, por categoria (sumário dos volumes). */
  var CORE_RAW = {
    mem: '2|Finish the Saying|2;4|Say the Color!|2;6|Number Gym|2;8|Rhyme Time|2;10|Shape Sudoku|3;12|Sock Hop Word Search|2;14|Golden Age Movie Trivia|2;18|Then & Now|1;22|Kitchen Word Scramble|2;24|Odd One Out|1;26|Name Five!|2;28|Finish the Picture|3;30|Road Trip USA|2;32|Missing Vowels|2;35|Alphabet Garden|2;37|Grocery List Memory|3;39|Opposites Match|1;42|Perfect Pairs|1;45|Put It in Order|2;49|Finish the Lyric|2;53|Crossword: Around the House|3;57|Garden Party Word Search|2;61|Spot the Difference: Picnic Day|2;65|Find the Way Home|2;69|Counting Coins|2;73|What Time Is It?|1;76|Swinging Sixties Trivia|2;80|Word Ladder|3;85|Hidden Animals|2;89|Connect the Dots: Sailboat|1;93|Number Search|2;97|Around the World A to Z|3;100|Picture Memory|2;104|Missing Letters: U.S. States|2;108|Mixed-Up Sentences|2;112|Count the Shapes|1;116|Baseball Legends Trivia|2;121|Christmas Cheer Word Search|2;125|Complete the Pattern|1;128|Recipe Math|3;132|Compound Words|2;136|Sounds Alike|2;140|Who Owns the Cat?|3;144|Fourth of July Word Search|2;148|Classic TV Trivia|2',
    mov: '15|Seated Hand Dance|1;19|Little Pot Garden|1;21|Sponge Painting|1;29|Balloon Volleyball|1;31|Shadow Theater|2;41|Finger Painting|1;43|Clay Sculpting|2;51|Chair Yoga Flow|1;55|Seated March Along|1;59|Ball Pass Circle|1;63|Beanbag Toss|1;66|Ribbon Dance|1;70|Finger Gym|1;74|Wheelchair Bowling|1;78|Seated Tai Chi|2;81|Good Morning Stretch|1;84|Walk & Talk Club|2;88|Paper Plate Frisbee|1;92|Hot Potato|1;95|Seated Simon Says|1;99|Cup Stacking Challenge|2;102|Pool Noodle Hockey|2;106|Kitchen Dance Party|1;109|Balloon Tennis|1;113|Button Sorting|1;117|Lacing Cards|2;120|Bead a Bracelet|2;123|Easy Paper Folding|2;127|Finger Knitting|3;131|Bubble Fun|1;135|Tabletop Mini Golf|2;138|Weave a Placemat|2;142|Seated Drum Circle|1;146|Towel Stretch|1;150|Clothespin Challenge|2',
    fam: '1|The Memory Jar|1;5|A Recipe to Remember|1;11|Life Story Bingo|1;13|Letters from the Heart|2;23|Family Photo Puzzle|2;36|The Memory Phone Call|1;46|Memory Scrapbook|2;47|My Favorite Things|1;48|Thanksgiving Memories|1;52|My Family Tree|2;56|Grandchild Interview|1;60|Recreate an Old Photo|1;64|Baking Grandma\'s Cookies|1;68|The Story of My Name|1;71|My First Car|1;75|Wedding Day Memories|1;79|Christmas Memories|1;83|Fourth of July Picnic|1;87|Valentine Love Notes|1;90|Easter Egg Decorating|1;94|Pumpkin Painting|1;98|Birthday Memory Book|2;103|Letter to Future Generations|2;107|Video Call Show & Tell|1;110|Family Checkers Night|2;114|Grandparent Advice Cards|1;118|Map of My Life|2;122|Hometown Memories|1;126|Teach Me Your Skill|2;130|Family Sing-Along|1;133|Pets We\'ve Loved|1;137|School Days|1;141|Handmade Greeting Cards|2;145|Family Photo Wall|2;149|Thank-You Letters|2',
    mood: '3|The Senses Box|1;7|Name That Tune|1;9|The Gratitude Tree|1;16|Garden Mandala|1;17|What\'s That Sound?|1;20|Build-a-Sundae Social|1;25|Balloon Breathing|1;27|Tastes of Life|1;33|Homemade Aromatherapy|1;34|Color Dominoes|2;38|Dream Board|2;40|Color Race|1;44|Guided Meditation|1;50|Hand Spa Day|1;54|The Joke Jar|1;58|Laughter Yoga|1;62|Afternoon Tea Party|1;67|Backyard Bird Watching|1;72|Sock Puppet Show|2;77|Nature Scavenger Hunt|1;82|Karaoke Classics|1;86|Movie Afternoon|1;91|Warm Foot Soak|1;96|Watercolor Postcards|2;101|Pet Therapy Visit|1;105|Coloring Page: Country Barn|1;111|Coloring Page: By the Sea|1;115|Riddle Time|2;119|Magnetic Fishing Game|1;124|Silly Hat Parade|1;129|Sunshine Break|1;134|Positive Words Cards|1;139|Funny Captions|2;143|Aquarium Calm|1;147|Bubble Wrap Pop|1'
  };
  /* Add-on de memória (50 workouts, nível 1 a 3 do livro). Nível 1 = estágio tardio, 2 = intermediário, 3 = inicial. */
  var WK_RAW = 'Picture Recall|1;What Number Is Next?|2;Match the Shadow|1;Fruit Sudoku|1;Remember the Story|2;Garden Scramble|2;Odd One Out|1;Star Hunt|2;Faces & Names|3;Fruit Math|2;What Comes Next?|1;Kitchen Word Search|2;Whose Pet Is It?|2;Hidden Numbers|3;Number Sudoku|2;Phone Book|3;Word Pairs|2;Connect the Trail|2;Missing Vowels|1;Who Sits Where?|2;Secret Message|2;Memory Card Game|1;Diner Math|2;Copy the Picture|2;Category Challenge|1;Calendar Puzzles|2;Word Builder|1;Famous Places|2;Rhyme Time|1;True or False?|1;Classic Movie Match|1;Jukebox Hits|2;Prices in 1960|3;TV Families|2;What Is It?|1;Shopping Trip|2;What\'s Missing?|2;My Life Story|1;Spot the Difference: 1950s Diner|2;Alphabet Kitchen|2;State Capitals|3;Morning in Order|1;Same or Different?|1;Holiday Quiz|2;Who Says It?|1;What Color Is It?|1;Number Memory|3;Tools & Jobs|1;Complete the Story|2;Memory Lane Quiz|2';
  /* Add-on de acamados (50). */
  var BED_RAW = 'The Memory Box;Guess the Scent;Bedside Balloon Tap;Gentle Hand Massage;Lap Tray Garden;Sort It Out;Bedside Bingo;Folding Together;Armchair Travel;Busy Blanket;What Goes Together?;Stretch & Breathe in Bed;Photo Album Stories;Lap Tray Painting;Music & Memories;Scarf Dance in Bed;Treasure Tray;A Soft Companion;Jumbo Card Games;Window Bird Watch;Soft Ball Pass;Cards with Love;Story Time;Jumbo Puzzle;Touch & Match;Tastes of Home;Family Video Call;Sing-Along Hour;Tabletop Bowling;The Good Day Jar;Movie Matinee in Bed;Nail Spa Day;Bubbles in Bed;Recipe Memories;Sensory Herb Garden;Window Art;Putty Hand Workout;Ribbons & Bows;Rhythm Shakers;Therapy Dog Visit;Color by Number;Letter to a Grandchild;Jumbo Dominoes;Weather Watch;Hair Brushing Time;Postcard Memories;Gentle Band Stretch;Flower Arranging;Guess the Sound;My Joy Board';

  /* Fall-Proof Legs Protocol (35 exercícios). */
  var FP_RAW = 'Seated March;Seated Knee Extension;Sit-to-Stand;Heel Raises;Toe Raises;Side Leg Raise;Standing Leg Curl;Supported Single-Leg Stand;Heel-to-Toe Walk;Clock Taps;Ball Squeeze;Seated Toe Reach;Band Leg Press;Ball Pass Twist;Sideways Steps;Ankle Weight Knee Lift;Step Taps;Reach & Tap Cones;Backward Walk;Partner Ball Toss;Kitchen Counter Mini Squats;Counter Marching;Sofa Leg Lifts;Wall Push-Ups;Wall Calf Stretch;Bedside Ankle Pumps;Counter Hip Extension;Counter Weight Shifts;Water Bottle Arm Raises;Towel Toe Scrunches;Seated Towel Row;Paper Plate Slides;Rolled Towel Step-Overs;Cushion Sit-to-Stand;Kitchen Towel Toss';
  /* 30+ Christmas Activities (atividade N na página N + 3) + plano da festa. */
  var XMAS_RAW = 'Christmas Traditions Through the Years;My Childhood Christmas;The Scents of Christmas;The Christmas Memory Jar;An Unforgettable Gift;Christmas Foods We Loved;Paper Snowflake Ornaments;Handmade Christmas Cards;Simple Paper Garland;Paint an Ornament;Gift Wrapping Together;Christmas Table Centerpiece;Christmas Bingo;Christmas Trivia;Christmas Memory Match;Large-Print Christmas Word Search;Guess the Christmas Object;Christmas Crossword;Christmas Carol Sing-Along;Guess the Carol;Jingle Bell Rhythm;Carol Circle;Classic Christmas Music Listening Session;Jingle Bell Arms & Feet;Pass the Present;Christmas Tree Stretch;Seated Holiday Dance;Letter to the Grandchildren;Write the Family Recipe Together;Color the Christmas Photo Frame;Your 60-Minute Christmas Party';
  /* Protocolo de Alzheimer: capítulos para consulta (página|título|parte). */
  var ALZ_RAW = '6|The 3 Stages at a Glance|Find the stage;7|Stage 1: Early (Mild)|Find the stage;8|Stage 2: Middle (Moderate)|Find the stage;9|Stage 3: Late (Severe)|Find the stage;10|Find Your Senior\'s Stage|Find the stage;11|Resident Profile Sheet|Find the stage;12|Stages Overlap|Find the stage;13|Why Routine Works|Daily routine;14|Daily Routine: Stage 1|Daily routine;15|Daily Routine: Stage 2|Daily routine;16|Daily Routine: Stage 3|Daily routine;17|The Late-Afternoon Plan|Daily routine;18|Restless Nights and Sleep|Daily routine;19|A Calm and Safe Environment|Daily routine;20|New Resident: The First 14 Days|Daily routine;21|Late-Afternoon Agitation|Hard situation;22|Restlessness and Pacing|Hard situation;23|Aggression|Hard situation;24|Refusing to Bathe|Hard situation;25|Refusing Food and Fluids|Hard situation;26|Refusing Medication|Hard situation;27|Personal Care and Changing with Dignity|Hard situation;28|The Same Question, Twenty Times|Hard situation;29|Calling for Someone Who Has Passed Away|Hard situation;30|Not Recognizing Family or Caregivers|Hard situation;31|Accusations and Suspicion|Hard situation;32|Wanting to Leave, Wandering|Hard situation;33|Refusing to Join Activities|Hard situation;34|Apathy and Withdrawal|Hard situation;35|Fear, Hallucinations and Confusion|Hard situation;36|Undressing and Inappropriate Behavior|Hard situation;37|How to Choose the Right Activity|Activities by stage;38|Stage 1 Activities|Activities by stage;39|Stage 2 Activities|Activities by stage;40|Stage 3 Activities|Activities by stage;41|Group Activities with Mixed Stages|Activities by stage;42|Talking with Families|Family & team;43|Daily Summary for the Family|Family & team;44|12 Phrases to Share with Families|Family & team;45|Guiding Family Visits|Family & team;46|Take Care of Yourself|Family & team;47|Pocket Checklist|Closing;48|Red Flags and Resources|Closing';
  var ACTS = {}, ACT_LIST = [];
  function addAct(a) { ACTS[a.key] = a; ACT_LIST.push(a); }
  Object.keys(CORE_RAW).forEach(function (cat) {
    CORE_RAW[cat].split(';').forEach(function (row) {
      var p = row.split('|'), n = +p[0], vol = n <= 50 ? 1 : n <= 100 ? 2 : 3;
      addAct({ key: 'c' + n, n: n, t: p[1], cat: cat, lvl: +p[2], doc: 'vol-' + vol, page: n - (vol - 1) * 50 + 5, label: 'Activity ' + n });
    });
  });
  WK_RAW.split(';').forEach(function (row, i) {
    var p = row.split('|');
    addAct({ key: 'm' + (i + 1), n: i + 1, t: p[0], cat: 'wk', lvl: +p[1], doc: 'memory', page: i + 4, label: 'Workout ' + (i + 1) });
  });
  BED_RAW.split(';').forEach(function (t, i) {
    addAct({ key: 'b' + (i + 1), n: i + 1, t: t, cat: 'bed', lvl: 1, doc: 'bedridden', page: i + 3, label: 'Bedside ' + (i + 1) });
  });
  XMAS_RAW.split(';').forEach(function (t, i) {
    var party = i === 30;
    addAct({ key: 'x' + (i + 1), n: i + 1, t: t, cat: 'xmas', lvl: 1, doc: 'christmas', page: party ? 34 : i + 4, label: party ? 'Party plan' : 'Activity ' + (i + 1) });
  });
  ALZ_RAW.split(';').forEach(function (row, i) {
    var p = row.split('|');
    addAct({ key: 'z' + p[0], n: i + 1, t: p[1], cat: 'alz', lvl: 1, doc: 'alzheimer', page: +p[0], label: p[2] });
  });
  FP_RAW.split(';').forEach(function (t, i) {
    addAct({ key: 'f' + (i + 1), n: i + 1, t: t, cat: 'fp', lvl: 1, doc: 'fall-proof', page: i + 4, label: 'Exercise ' + (i + 1) });
  });
  var CORE = ACT_LIST.filter(function (a) { return a.key[0] === 'c'; }).sort(function (a, b) { return a.n - b.n; });

  /* Atividades que pedem andar: fora da lista para cadeira de rodas e acamados. */
  var NEEDS_WALK = { c84: 1, c106: 1, c77: 1 };

  var INTERESTS = [
    { id: 'music', label: 'Music', re: /tune|sing|karaoke|lyric|drum|dance|jukebox|music|rhythm|shaker/i },
    { id: 'garden', label: 'Gardening & nature', re: /garden|bird|nature|flower|herb|pot |weather|aquarium|mandala|sunshine/i },
    { id: 'cook', label: 'Cooking', re: /recipe|kitchen|cook|baking|cookies|tea party|sundae|tastes|diner|grocery|shopping/i },
    { id: 'sport', label: 'Sports', re: /baseball|bowling|golf|hockey|tennis|volleyball|frisbee|ball|race|beanbag/i },
    { id: 'movies', label: 'Movies & TV', re: /movie|tv |tv$|trivia|matinee|sixties|golden age|families/i },
    { id: 'travel', label: 'Travel & places', re: /road trip|travel|world|map|states|capitals|places|hometown|postcard/i },
    { id: 'pets', label: 'Animals', re: /pet|cat\b|dog|animal|bird|fishing|companion/i },
    { id: 'crafts', label: 'Crafts & art', re: /paint|clay|bead|knit|weave|fold|coloring|color by|greeting card|scrapbook|art\b|ribbon|bracelet|puppet|lacing/i },
    { id: 'family', label: 'Family stories', re: /family|grand|memory jar|memory box|life story|letter|wedding|photo|my name|birthday|school|first car|advice/i },
    { id: 'puzzles', label: 'Puzzles & words', re: /word|puzzle|sudoku|crossword|scramble|riddle|vowel|letters|pattern|domino|search|math/i }
  ];

  var STAGES = [
    { id: 'none', label: 'No memory concerns', hint: 'Sharp mind, wants to stay that way' },
    { id: 'early', label: 'Early stage', hint: 'Mild memory changes' },
    { id: 'middle', label: 'Middle stage', hint: 'Needs some help' },
    { id: 'late', label: 'Later stage', hint: 'Needs a lot of help' },
    { id: 'unsure', label: 'Not sure', hint: 'I will figure it out as we go' }
  ];
  var MOBILITY = [
    { id: 'walks', label: 'Walks on their own' },
    { id: 'help', label: 'Walks with help' },
    { id: 'wheel', label: 'Uses a wheelchair' },
    { id: 'bed', label: 'Mostly in bed' }
  ];
  var MOODS = [
    { v: 1, e: '😟', l: 'Not today', c: '#F28B82' },
    { v: 2, e: '😐', l: 'So-so', c: '#F7B27A' },
    { v: 3, e: '🙂', l: 'Good', c: '#FFC93C' },
    { v: 4, e: '😄', l: 'Great', c: '#8FD3A8' },
    { v: 5, e: '🥰', l: 'Loved it', c: '#2F8F57' }
  ];
  var AVATAR = ['#FFC93C', '#8CCBEA', '#F5A097', '#93D6AE', '#C9B2F2', '#F7BE8A'];

  /* Quanto cada nível combina com cada estágio (0 a 3). */
  var LEVEL_FIT = {
    none: { 1: 1, 2: 2, 3: 3 }, early: { 1: 1, 2: 3, 3: 2 }, middle: { 1: 2, 2: 3, 3: 0 },
    late: { 1: 3, 2: 1, 3: 0 }, unsure: { 1: 2, 2: 2, 3: 1 }
  };

  /* ================= Dados ================= */
  var STORE = {
    key: 'bd_care_v1',
    load: function () {
      try { var s = localStorage.getItem(this.key); if (s) return JSON.parse(s); } catch (e) {}
      return null;
    },
    save: function (d) { try { localStorage.setItem(this.key, JSON.stringify(d)); return true; } catch (e) { return false; } }
  };
  var DB = { v: 1, me: { name: '' }, residents: [], logs: [] };
  function save() { if (!STORE.save(DB)) toast('Could not save on this device. Check your browser storage.'); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function resident(id) { return DB.residents.filter(function (r) { return r.id === id; })[0]; }

  /* ================= Utilidades ================= */
  var BD, $ = function (s, el) { return (el || document).querySelector(s); };
  function esc(s) { return BD.esc(s == null ? '' : s); }
  function ymd(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parseYmd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function niceDate(s) {
    var t = ymd(), d = parseYmd(s);
    if (s === t) return 'Today';
    if (s === addDays(t, -1)) return 'Yesterday';
    var diff = (parseYmd(t) - d) / 864e5;
    if (diff > 0 && diff < 7) return WDAYS[d.getDay()];
    return MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + (d.getFullYear() !== new Date().getFullYear() ? ', ' + d.getFullYear() : '');
  }
  function ago(s) {
    if (!s) return 'No activities yet';
    var n = Math.round((parseYmd(ymd()) - parseYmd(s)) / 864e5);
    return n <= 0 ? 'Last activity today' : n === 1 ? 'Last activity yesterday' : 'Last activity ' + n + ' days ago';
  }
  function plural(n, w) { return n + ' ' + (n === 1 ? w : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : w + 's'); }
  function initials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase(); }
  function avatar(r, size) {
    return '<span class="cr-av' + (size ? ' ' + size : '') + '" style="background:' + (r.color || AVATAR[0]) + '">' + esc(initials(r.name)) + '</span>';
  }
  function firstName(r) { return String(r.name).trim().split(/\s+/)[0]; }
  function names(ids) {
    var ns = ids.map(resident).filter(Boolean).map(firstName);
    if (ns.length <= 2) return ns.join(' & ');
    return ns.slice(0, 2).join(', ') + ' +' + (ns.length - 2);
  }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  function thumb(a) { return BD.v('img/acts/' + a.key + '.webp'); }
  function levelDots(l) { return '<span class="cr-lvl" aria-label="Level ' + l + '">' + [1, 2, 3].map(function (i) { return '<i' + (i <= l ? ' class="on"' : '') + '></i>'; }).join('') + '</span>'; }
  function badge(a) { var c = CATS[a.cat]; return '<span class="cr-num" style="background:' + c.color + '">' + a.n + '</span>'; }
  function hasLvl(a) { return a.cat === 'wk' || a.key[0] === 'c'; }
  function mood(v) { return MOODS[Math.max(0, Math.min(4, Math.round(v) - 1))]; }

  /* Posse de add-on */
  function actOffer(a) { var o = CATS[a.cat].offer; return o ? BD.offer(o) : null; }
  function locked(a) { var o = actOffer(a); return !!(o && !BD.has(o)); }
  function readHref(a) { return '#/read/' + a.doc + '/' + a.page + '/log/' + a.key; }

  /* ================= Estatísticas ================= */
  function logsFor(rid) { return DB.logs.filter(function (l) { return !rid || l.who.indexOf(rid) >= 0; }); }
  function sortedLogs(list) { return list.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.ts - a.ts; }); }
  function doneMap(rid) {
    var m = {};
    logsFor(rid).forEach(function (l) {
      var x = m[l.act] || (m[l.act] = { count: 0, last: '' });
      x.count++; if (l.date > x.last) x.last = l.date;
    });
    return m;
  }
  function streak() {
    var days = {}; DB.logs.forEach(function (l) { days[l.date] = 1; });
    var d = ymd(); if (!days[d]) d = addDays(d, -1);
    var n = 0; while (days[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  function weekCount(rid) { var from = addDays(ymd(), -6); return logsFor(rid).filter(function (l) { return l.date >= from; }).length; }
  function monthCount(rid) { var m = ymd().slice(0, 7); return logsFor(rid).filter(function (l) { return l.date.slice(0, 7) === m; }).length; }
  function triedCore() { var m = doneMap(); return CORE.filter(function (a) { return m[a.key]; }).length; }
  function avgMood(list) { var s = 0, n = 0; list.forEach(function (l) { if (l.mood) { s += l.mood; n++; } }); return n ? s / n : 0; }

  /* ================= Sugestões ================= */
  /* Pontua cada atividade para uma pessoa: nível x estágio, interesses, mobilidade, se já fez e um sorteio do dia. */
  function suggestFor(r, count, seedExtra) {
    var done = doneMap(r && r.id), today = ymd(), seed = today + (r ? r.id : 'all') + (seedExtra || '');
    var stage = (r && r.stage) || 'unsure', mob = r && r.mobility;
    var ints = INTERESTS.filter(function (i) { return r && r.interests && r.interests.indexOf(i.id) >= 0; });
    function score(a) {
      if (a.cat === 'alz') return -99;
      if (a.cat === 'xmas' && !xmasSeason()) return -99;
      if (a.cat === 'fp' && mob !== 'help' && mob !== 'walks') return -99;
      if (a.cat === 'fp') return 1 + hash(seed + a.key) * 2;
      if ((mob === 'wheel' || mob === 'bed') && NEEDS_WALK[a.key]) return -99;
      var s = (a.cat === 'wk' ? { none: { 1: 0, 2: 1, 3: 3 }, early: { 1: 1, 2: 3, 3: 3 }, middle: { 1: 2, 2: 3, 3: 0 }, late: { 1: 3, 2: 0, 3: 0 }, unsure: { 1: 2, 2: 2, 3: 1 } }[stage][a.lvl] : LEVEL_FIT[stage][a.lvl]) * 2;
      var match = ints.filter(function (i) { return i.re.test(a.t); })[0];
      if (match) s += 3;
      if (mob === 'bed') s += a.cat === 'bed' ? 3 : a.cat === 'mov' ? -2 : a.cat === 'fam' || a.cat === 'mood' ? 1 : 0;
      if (mob === 'wheel' && a.cat === 'bed') s += 2;
      var d = done[a.key];
      s += !d ? 3 : (parseYmd(today) - parseYmd(d.last)) / 864e5 > 21 ? 1 : -4;
      s += hash(seed + a.key) * 2.5;
      return s;
    }
    function reason(a) {
      var match = ints.filter(function (i) { return i.re.test(a.t); })[0];
      var nm = r ? firstName(r) : '';
      if (a.cat === 'bed' && (mob === 'bed' || mob === 'wheel')) return 'Made for the bed or wheelchair';
      if (a.cat === 'wk' && (stage === 'middle' || stage === 'late' || stage === 'early')) return 'Matched to ' + (nm ? nm + '’s' : 'their') + ' memory stage';
      if (match && nm) return nm + ' loves ' + match.label.toLowerCase();
      if (!done[a.key]) return r ? 'New for ' + nm : 'Not tried yet';
      return 'A favorite to repeat';
    }
    /* Candidatos: núcleo + add-ons que a pessoa tem. Add-on bloqueado entra no máximo 1 vez, se fizer sentido. */
    var pool = ACT_LIST.filter(function (a) { return !locked(a) && (a.cat !== 'bed' || mob === 'bed' || mob === 'wheel' || !r); });
    var ranked = pool.map(function (a) { return { a: a, s: score(a) }; }).sort(function (x, y) { return y.s - x.s; });
    var out = [], cats = {};
    ranked.forEach(function (x) {
      if (out.length >= count) return;
      if (cats[x.a.cat] >= Math.ceil(count / 3)) return;
      cats[x.a.cat] = (cats[x.a.cat] || 0) + 1;
      out.push({ a: x.a, why: reason(x.a) });
    });
    var up = upsellFor(r);
    if (up && count >= 2) out.splice(Math.min(1, out.length), 0, up);
    return out.slice(0, count);
  }

  function xmasSeason() { var m = new Date().getMonth(); return m === 10 || m === 11; }
  /* O produto bloqueado que mais combina com a pessoa, já com uma atividade de exemplo. */
  function upsellFor(r) {
    if (!r) return null;
    var nm = firstName(r), pick = null;
    function sample(cat, filter) {
      var list = ACT_LIST.filter(function (a) { return a.cat === cat && (!filter || filter(a)); });
      return list[Math.floor(hash(ymd() + r.id + cat) * list.length)];
    }
    var memO = BD.offer('memory'), bedO = BD.offer('bedridden'), fpO = BD.offer('fall-proof'), alzO = BD.offer('alzheimer');
    if ((r.mobility === 'bed' || r.mobility === 'wheel') && bedO && !BD.has(bedO)) {
      pick = { a: sample('bed'), why: 'Made for the bed or wheelchair' };
    } else if ((r.stage === 'middle' || r.stage === 'late') && alzO && !BD.has(alzO)) {
      var hard = ACT_LIST.filter(function (a) { return a.cat === 'alz' && a.label === 'Hard situation'; });
      pick = { a: hard[Math.floor(hash(ymd() + r.id + 'alz') * hard.length)], why: 'What to say when it happens to ' + nm };
    } else if (r.stage && r.stage !== 'none' && r.stage !== 'unsure' && memO && !BD.has(memO)) {
      var want = r.stage === 'late' ? 1 : r.stage === 'middle' ? 2 : 3;
      pick = { a: sample('wk', function (a) { return a.lvl === want; }), why: 'Matched to ' + nm + '’s memory stage' };
    } else if (r.mobility === 'help' && fpO && !BD.has(fpO)) {
      pick = { a: ACTS['f' + (1 + Math.floor(hash(ymd() + r.id) * 10))], why: 'Steadier steps for ' + nm };
    }
    if (pick) pick.locked = true;
    return pick;
  }

  /* Atividade do dia: muda a cada 24 h, prefere o que ninguém fez e o que combina com o grupo. */
  function todayPick() {
    var stages = {}; DB.residents.forEach(function (r) { stages[r.stage || 'unsure'] = (stages[r.stage || 'unsure'] || 0) + 1; });
    var main = Object.keys(stages).sort(function (a, b) { return stages[b] - stages[a]; })[0] || 'unsure';
    var anyBed = DB.residents.some(function (r) { return r.mobility === 'bed' || r.mobility === 'wheel'; });
    var done = doneMap(), t = ymd();
    var best = CORE.map(function (a) {
      if (anyBed && NEEDS_WALK[a.key]) return { a: a, s: -99 };
      var d = done[a.key];
      return { a: a, s: LEVEL_FIT[main][a.lvl] * 2 + (!d ? 3 : -3) + hash('today' + t + a.key) * 4 };
    }).sort(function (x, y) { return y.s - x.s; })[0].a;
    var fits = DB.residents.filter(function (r) { return LEVEL_FIT[r.stage || 'unsure'][best.lvl] >= 2 && !(NEEDS_WALK[best.key] && (r.mobility === 'bed' || r.mobility === 'wheel')); });
    return { a: best, fits: fits };
  }

  /* ================= Barra inferior ================= */
  var TAB_ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V19a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V9.5"/></svg>',
    today: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.8" cy="9.5" r="2.6"/><path d="M15.8 14.2c2.4-.3 4.3 1.2 4.8 4.3"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M3.8 6.5l1.2 1.2 2-2.2M3.8 12l1.2 1.2 2-2.2M3.8 17.5l1.2 1.2 2-2.2"/></svg>'
  };
  var tabbar;
  function buildTabs() {
    tabbar = document.createElement('nav');
    tabbar.className = 'cr-tabs';
    tabbar.setAttribute('aria-label', 'Main');
    tabbar.innerHTML = '<div class="cr-tabs-in">' +
      '<a href="#/" data-tab="home">' + TAB_ICONS.home + '<span>Home</span></a>' +
      '<a href="#/today" data-tab="today">' + TAB_ICONS.today + '<span>Today</span></a>' +
      '<button type="button" class="cr-fab" id="crFab" aria-label="Log an activity">' + TAB_ICONS.plus + '<span>Log</span></button>' +
      '<a href="#/residents" data-tab="residents">' + TAB_ICONS.people + '<span>Residents</span></a>' +
      '<a href="#/activities" data-tab="activities">' + TAB_ICONS.list + '<span>Activities</span></a></div>';
    document.getElementById('appRoot').appendChild(tabbar);
    document.body.classList.add('has-tabs');
    $('#crFab').addEventListener('click', function () { openLog({}); });
  }
  function setTab() {
    if (!tabbar) return;
    var h = location.hash.replace(/^#\/?/, '').split('/')[0];
    var t = h === 'today' || h === 'history' ? 'today' : h === 'residents' || h === 'resident' || h === 'report' ? 'residents' : h === 'activities' ? 'activities' : h === 'unlock' ? null : 'home';
    if (t === null) return;
    [].forEach.call(tabbar.querySelectorAll('[data-tab]'), function (el) {
      var on = el.dataset.tab === t;
      el.classList.toggle('on', on);
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
  }

  /* ================= Janela própria (sobre o leitor) ================= */
  var cm, cmBody, cmPushed = false, cmAfter = null;
  function buildModal() {
    cm = document.createElement('div');
    cm.className = 'cm-wrap'; cm.hidden = true;
    cm.innerHTML = '<div class="cm-bg" data-cm-close></div><div class="cm" role="dialog" aria-modal="true"><div class="cm-body" id="cmBody"></div></div>';
    document.body.appendChild(cm);
    cmBody = $('#cmBody');
    cm.addEventListener('click', function (e) {
      if (e.target.closest('[data-cm-close]')) { if (cmBody.querySelector('.cm-welcome')) welcomeDone(); closeModal(); }
    });
    window.addEventListener('popstate', function () {
      if (cm.hidden) return;
      cmPushed = false;
      hideModal();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !cm.hidden) closeModal(); });
  }
  function openModal(html, cls) {
    cmBody.innerHTML = html;
    cm.querySelector('.cm').className = 'cm' + (cls ? ' ' + cls : '');
    if (cm.hidden) {
      cm.hidden = false;
      document.body.classList.add('lock');
      if (!cmPushed) { history.pushState(Object.assign({}, history.state, { cm: 1 }), ''); cmPushed = true; }
    }
    cmBody.scrollTop = 0;
  }
  function hideModal() {
    cm.hidden = true; cmBody.innerHTML = ''; L = null; R = null;
    var viewerOpen = !document.getElementById('viewer').hidden, sheetOpen = !document.getElementById('sheet').hidden;
    if (!viewerOpen && !sheetOpen) document.body.classList.remove('lock');
    var fn = cmAfter; cmAfter = null;
    if (fn) setTimeout(fn, 0);
  }
  /* Fecha e, depois que o histórico voltar, roda `then` (ex.: navegar para outra tela). */
  function closeModal(then) {
    cmAfter = then || null;
    if (cmPushed) history.back(); else hideModal();
  }
  function go(href) { closeModal(function () { location.hash = href; }); }

  /* ================= Aviso rápido ================= */
  var toastT;
  function toast(msg) {
    var el = $('.cr-toast');
    if (!el) { el = document.createElement('div'); el.className = 'cr-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.innerHTML = msg;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }

  /* ================= Componentes ================= */
  function header(title, back) {
    return '<header class="top"><div class="top-in">' +
      (back ? '<a class="back" href="' + back + '" aria-label="Back">' + BD.ICON.back + '</a>' : '') +
      (title ? '<div class="cr-ttl">' + esc(title) + '</div>' : '<div class="brand">' + BD.ICON.sun + '<span>Brighter Days</span></div>') +
      (back ? '' : '<span class="pill">Members Area</span>') + '</div></header>';
  }
  function actRow(a, extra) {
    var lk = locked(a), d = extra && extra.done;
    return '<button type="button" class="cr-row' + (lk ? ' lk' : '') + '" data-act="' + a.key + '">' + badge(a) +
      '<span class="cr-row-b"><strong>' + esc(a.t) + '</strong><small>' + esc(a.cat === 'alz' ? a.label : CATS[a.cat].short) + (hasLvl(a) ? ' · ' + levelDots(a.lvl) : '') + '</small></span>' +
      (lk ? '<span class="cr-lock">' + BD.ICON.lock + '</span>' : d ? '<span class="cr-done">' + BD.ICON.check + (d.count > 1 ? '<b>×' + d.count + '</b>' : '') + '</span>' : '<span class="cr-chev"></span>') +
      '</button>';
  }
  function sugCard(s) {
    var a = s.a, lk = locked(a), o = actOffer(a);
    return '<button type="button" class="cr-sug' + (lk ? ' lk' : '') + '" data-act="' + a.key + '">' +
      '<span class="cr-sug-img"><img src="' + thumb(a) + '" alt="" width="480" height="288" loading="lazy" decoding="async">' +
      (lk ? '<span class="cr-sug-lk">' + BD.ICON.lock + 'Unlock</span>' : '') + '</span>' +
      '<span class="cr-sug-b"><small style="color:' + CATS[a.cat].color + '">' + esc(lk && o ? 'From ' + o.title : CATS[a.cat].label) + '</small>' +
      '<strong>' + esc(a.t) + '</strong><em>' + esc(s.why) + '</em></span></button>';
  }
  function logItem(l, showWho) {
    var a = ACTS[l.act]; if (!a) return '';
    var m = l.mood ? mood(l.mood) : null;
    return '<button type="button" class="cr-log" data-log="' + l.id + '">' +
      '<span class="cr-log-m" style="background:' + (m ? m.c : '#E6ECF5') + '">' + (m ? m.e : '✓') + '</span>' +
      '<span class="cr-log-b"><strong>' + esc(a.t) + '</strong>' +
      '<small>' + esc(CATS[a.cat].short) + (showWho && l.who.length ? ' · with ' + esc(names(l.who)) : '') + '</small>' +
      (l.note ? '<em>“' + esc(l.note) + '”</em>' : '') + '</span></button>';
  }
  function logsByDay(list, showWho) {
    if (!list.length) return '';
    var html = '', day = '';
    sortedLogs(list).forEach(function (l) {
      if (l.date !== day) { day = l.date; html += '<h4 class="cr-day">' + niceDate(day) + '</h4>'; }
      html += logItem(l, showWho);
    });
    return html;
  }
  function empty(icon, title, text, btn) {
    return '<div class="cr-empty"><div class="cr-empty-ic">' + icon + '</div><h3>' + title + '</h3><p>' + text + '</p>' + (btn || '') + '</div>';
  }

  /* ================= Telas ================= */
  var app;
  function render(parts) {
    app = document.getElementById('app');
    var v = parts[0];
    if (v === 'today') viewToday();
    else if (v === 'residents') viewResidents();
    else if (v === 'resident') viewResident(parts[1]);
    else if (v === 'activities') viewActivities();
    else if (v === 'history') viewHistory(parts[1]);
    else if (v === 'report') viewReport(parts[1], parts[2]);
    setTab();
  }

  function greeting() { var h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }

  function viewToday() {
    var tp = todayPick(), a = tp.a, st = streak(), d = new Date();
    var recent = sortedLogs(DB.logs).slice(0, 4);
    var perRes = DB.residents.slice(0, 6).map(function (r) {
      var s = suggestFor(r, 1, 'today')[0];
      if (!s) return '';
      return '<button type="button" class="cr-pr" data-act="' + s.a.key + '" data-for="' + r.id + '">' + avatar(r) +
        '<span class="cr-pr-b"><small>' + esc(firstName(r)) + ' · ' + esc(s.why) + '</small><strong>' + esc(s.a.t) + '</strong></span>' +
        (locked(s.a) ? '<span class="cr-lock">' + BD.ICON.lock + '</span>' : '<span class="cr-chev"></span>') + '</button>';
    }).join('');
    var up = DB.residents.map(upsellFor).filter(Boolean)[0];
    var lifetime = BD.offer('lifetime');
    var xo = BD.offer('christmas'), xmasSoon = new Date().getMonth() >= 9;
    var promo = xmasSoon && xo && !BD.has(xo) ? promoCard(xo, 'Christmas is coming') : up ? promoCard(actOffer(up.a), up.why) : lifetime && !BD.has(lifetime) ? promoCard(lifetime, 'Never run out of ideas') : '';

    app.innerHTML = header() + '<main class="wrap">' +
      '<section class="cr-hi"><small>' + WDAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + '</small>' +
        '<h1>' + greeting() + (DB.me.name ? ', ' + esc(DB.me.name.split(' ')[0]) : '') + '!</h1></section>' +
      '<section class="cr-stats">' +
        '<div><b>' + st + '</b><span>' + (st === 1 ? 'day' : 'days') + ' in a row</span><i>🔥</i></div>' +
        '<div><b>' + weekCount() + '</b><span>this week</span><i>📅</i></div>' +
        '<div><b>' + triedCore() + '<small>/150</small></b><span>tried</span><i>⭐</i></div></section>' +
      '<section class="sec"><div class="sec-h"><h2>Today&rsquo;s activity</h2><span>A new pick every day, ready to go</span></div>' +
        '<article class="cr-today">' +
          '<button type="button" class="cr-today-img" data-act="' + a.key + '"><img src="' + thumb(a) + '" alt="" width="480" height="288" fetchpriority="high"></button>' +
          '<div class="cr-today-b"><small style="color:' + CATS[a.cat].color + '">' + esc(a.label) + ' · ' + esc(CATS[a.cat].label) + '</small>' +
          '<h3>' + esc(a.t) + '</h3>' +
          (tp.fits.length ? '<p class="cr-fits">' + tp.fits.slice(0, 4).map(function (r) { return avatar(r, 'sm'); }).join('') + '<span>Great for ' + esc(names(tp.fits.map(function (r) { return r.id; }))) + '</span></p>' : '') +
          '<div class="cr-2btn"><a class="btn btn-line" href="' + readHref(a) + '">' + BD.ICON.read + 'Open</a>' +
          '<button type="button" class="btn btn-sun" data-log-act="' + a.key + '">' + BD.ICON.check + 'Mark as done</button></div></div></article></section>' +
      (DB.residents.length ?
        '<section class="sec"><div class="sec-h"><h2>Picked for each person</h2><span>Based on their stage, mobility and interests</span></div><div class="cr-card">' + perRes + '</div></section>' :
        '<section class="sec"><a class="cr-cta" href="#/residents"><span class="cr-cta-ic">' + TAB_ICONS.people + '</span><span><strong>Add the people you care for</strong><small>Get activities picked for each one and track how they respond.</small></span><span class="cr-chev"></span></a></section>') +
      (promo ? '<section class="sec">' + promo + '</section>' : '') +
      '<section class="sec"><div class="sec-h cr-sec-row"><div><h2>Recent activity</h2><span>Your latest records</span></div>' + (DB.logs.length > 4 ? '<a href="#/history" class="cr-link">See all</a>' : '') + '</div>' +
        (recent.length ? '<div class="cr-card">' + recent.map(function (l) { return logItem(l, true); }).join('') + '</div>' :
          empty('📝', 'Nothing logged yet', 'Tap <b>Log</b> after each activity. It takes 10 seconds and builds a record you can share with families.', '<button type="button" class="btn btn-sun" data-log-act="">Log my first activity</button>')) +
      '</section><p class="foot">Brighter Days · Members Area</p></main>';
  }

  function promoCard(o, why) {
    if (!o) return '';
    return '<a class="promo cr-promo" href="#/unlock/' + o.id + '"><div class="prod-img"><img src="' + o.banner + '" alt="" width="960" height="536" loading="lazy" decoding="async"><span class="lock-ic">' + BD.ICON.lock + '</span></div>' +
      '<div class="promo-b"><small>Recommended · ' + esc(why) + '</small><strong>' + esc(o.title) + '</strong><span>See What&rsquo;s Inside</span></div></a>';
  }

  function viewResidents() {
    var list = DB.residents.map(function (r) {
      var ls = logsFor(r.id), last = sortedLogs(ls)[0], am = avgMood(ls.slice(-10));
      var st = STAGES.filter(function (s) { return s.id === r.stage; })[0];
      return '<a class="cr-res" href="#/resident/' + r.id + '">' + avatar(r, 'lg') +
        '<span class="cr-res-b"><strong>' + esc(r.name) + '</strong>' +
        '<small>' + (st && r.stage !== 'unsure' ? esc(st.label) + ' · ' : '') + esc(ago(last && last.date)) + '</small>' +
        '<span class="cr-res-k"><b>' + weekCount(r.id) + '</b> this week' + (am ? ' · usually ' + mood(am).e : '') + '</span></span><span class="cr-chev"></span></a>';
    }).join('');
    app.innerHTML = header() + '<main class="wrap">' +
      '<section class="cr-hi"><small>Your care log</small><h1>Residents</h1><p>Everyone you care for, with their activities, moods and progress in one place.</p></section>' +
      (DB.residents.length ?
        '<section class="sec"><div class="cr-card cr-res-list">' + list + '</div>' +
        '<button type="button" class="btn btn-sun" data-add-res>' + TAB_ICONS.plus + 'Add a person</button></section>' :
        '<section class="sec">' + empty('👵', 'Who do you care for?', 'Add each person once. Brighter Days will suggest activities for their memory stage and mobility, and keep a record of every session and how they responded.', '<button type="button" class="btn btn-sun" data-add-res>' + TAB_ICONS.plus + 'Add my first person</button>') +
        '<ul class="cr-why"><li><b>Picked for them</b> Activities matched to stage, mobility and interests</li><li><b>Track every session</b> What you did, who joined and how it went</li><li><b>Show your work</b> A monthly report ready to share with families</li></ul></section>') +
      '<section class="sec cr-data"><p><button type="button" data-welcome>How does this work?</button></p><p>🔒 Your records are private and saved on this device.</p>' +
        '<div><button type="button" data-export>Download a backup</button><label>Restore a backup<input type="file" accept="application/json" data-import hidden></label></div></section>' +
      '<p class="foot">Brighter Days · Members Area</p></main>';
  }

  function viewResident(id) {
    var r = resident(id);
    if (!r) { location.replace('#/residents'); return; }
    var ls = logsFor(id), month = monthCount(id), am = avgMood(ls);
    var st = STAGES.filter(function (s) { return s.id === r.stage; })[0], mb = MOBILITY.filter(function (m) { return m.id === r.mobility; })[0];
    var ints = INTERESTS.filter(function (i) { return (r.interests || []).indexOf(i.id) >= 0; });
    var last14 = sortedLogs(ls).filter(function (l) { return l.mood; }).slice(0, 14).reverse();
    var cats = {}; ls.forEach(function (l) { var a = ACTS[l.act]; if (a) cats[a.cat] = (cats[a.cat] || 0) + 1; });
    var fav = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; })[0];
    var loved = {}; ls.forEach(function (l) { if (l.mood >= 4) loved[l.act] = (loved[l.act] || 0) + 1; });
    var top = Object.keys(loved).sort(function (a, b) { return loved[b] - loved[a]; }).slice(0, 3);
    var sugs = suggestFor(r, 4);

    app.innerHTML = header('', '#/residents') + '<main class="wrap">' +
      '<section class="cr-prof">' + avatar(r, 'xl') + '<div><h1>' + esc(r.name) + '</h1>' +
        '<p class="cr-chips">' + (st ? '<span>' + esc(st.label) + '</span>' : '') + (mb ? '<span>' + esc(mb.label) + '</span>' : '') + '</p></div>' +
        '<button type="button" class="cr-edit" data-edit-res="' + r.id + '">Edit</button></section>' +
      (ints.length ? '<p class="cr-ints">Loves ' + ints.map(function (i) { return '<span>' + esc(i.label) + '</span>'; }).join('') + '</p>' : '') +
      (r.notes ? '<div class="cr-note"><small>Good to know</small><p>' + esc(r.notes) + '</p></div>' : '') +
      '<section class="cr-stats four"><div><b>' + weekCount(id) + '</b><span>this week</span></div><div><b>' + month + '</b><span>this month</span></div>' +
        '<div><b>' + ls.length + '</b><span>total</span></div><div><b>' + (am ? mood(am).e : '–') + '</b><span>' + (am ? mood(am).l.toLowerCase() : 'mood') + '</span></div></section>' +
      '<button type="button" class="btn btn-sun" data-log-for="' + r.id + '">' + TAB_ICONS.plus + 'Log an activity for ' + esc(firstName(r)) + '</button>' +
      '<section class="sec"><div class="sec-h"><h2>Suggested for ' + esc(firstName(r)) + '</h2><span>Picked for their stage, mobility and interests</span></div>' +
        '<div class="rail cr-sug-rail">' + sugs.map(sugCard).join('') + '</div></section>' +
      (last14.length >= 2 ? '<section class="sec"><div class="sec-h"><h2>How ' + esc(firstName(r)) + ' responded</h2><span>Last ' + last14.length + ' sessions</span></div>' +
        '<div class="cr-card cr-chart"><div class="cr-bars">' + last14.map(function (l) { var m = mood(l.mood); return '<i title="' + esc(niceDate(l.date) + ': ' + m.l) + '" style="height:' + (l.mood * 20) + '%;background:' + m.c + '"></i>'; }).join('') + '</div>' +
        '<div class="cr-chart-f"><span>Older</span><span>Latest</span></div>' +
        (fav || top.length ? '<div class="cr-insight">' + (fav ? '<p>Favorite type: <b style="color:' + CATS[fav].color + '">' + esc(CATS[fav].label) + '</b></p>' : '') +
          (top.length ? '<p>Loved most: ' + top.map(function (k) { return '<b>' + esc(ACTS[k].t) + '</b>'; }).join(', ') + '</p>' : '') + '</div>' : '') +
        '</div></section>' : '') +
      '<section class="sec"><a class="cr-cta gold" href="#/report/' + r.id + '"><span class="cr-cta-ic">📄</span><span><strong>Monthly report</strong><small>A clean summary of ' + esc(firstName(r)) + '&rsquo;s month to print or send to the family.</small></span><span class="cr-chev"></span></a></section>' +
      '<section class="sec"><div class="sec-h"><h2>Activity history</h2><span>' + plural(ls.length, 'activity') + ' logged</span></div>' +
        (ls.length ? '<div class="cr-card">' + logsByDay(ls, false) + '</div>' : empty('🌱', 'No activities yet', 'Log the first one and it shows up here, with the mood and your notes.')) +
      '</section><p class="foot">Brighter Days · Members Area</p></main>';
  }

  /* Produtos da aba Activities, na ordem da vitrine. offer = id da oferta no app.js (sem offer = incluído no plano). */
  var PRODUCTS = [
    { id: 'bd', title: 'Brighter Days', cats: ['mem', 'mov', 'fam', 'mood'], cover: 'img/covers/vol-1.webp', unit: 'activity' },
    { id: 'wk', offer: 'memory', short: 'Memory', cats: ['wk'], cover: 'img/covers/memory.webp', unit: 'brain workout' },
    { id: 'xmas', offer: 'christmas', short: 'Christmas', cats: ['xmas'], cover: 'img/covers/christmas.webp', unit: 'activity' },
    { id: 'alz', offer: 'alzheimer', short: 'Alzheimer Protocol', cats: ['alz'], cover: 'img/covers/alzheimer.webp', unit: 'guide' },
    { id: 'fp', offer: 'fall-proof', short: 'Fall-Proof', cats: ['fp'], cover: 'img/covers/fall-proof.webp', unit: 'exercise' },
    { id: 'bed', offer: 'bedridden', short: 'Bedside', cats: ['bed'], cover: 'img/covers/bedridden.webp', unit: 'activity' }
  ];
  function prodOffer(pr) { return pr.offer ? BD.offer(pr.offer) : null; }
  function prodLocked(pr) { var o = prodOffer(pr); return !!(o && !BD.has(o)); }
  function prodItems(pr) { return ACT_LIST.filter(function (a) { return pr.cats.indexOf(a.cat) >= 0; }).sort(function (a, b) { return pr.id === 'bd' ? a.n - b.n : 0; }); }
  function prodTitle(pr) { var o = prodOffer(pr); return o ? o.title : pr.title; }

  var actFilter = { prod: 'all', cat: 'all', q: '', notDone: false };
  function viewActivities() {
    var done = doneMap();
    var open = PRODUCTS.filter(function (pr) { return !prodLocked(pr); });
    var total = 0, tried = 0;
    open.forEach(function (pr) { prodItems(pr).forEach(function (a) { total++; if (done[a.key]) tried++; }); });
    var pct = total ? tried / total * 100 : 0;
    app.innerHTML = header() + '<main class="wrap">' +
      '<section class="cr-hi"><small>Your library</small><h1>Activities</h1><p>Everything in your products in one list. Tap one to open it and check off what you&rsquo;ve done.</p></section>' +
      '<section class="cr-prog"><div class="cr-ring" style="--p:' + pct.toFixed(1) + '"><b>' + tried + '</b><small>of ' + total + '</small></div>' +
        '<div><strong>' + (tried === 0 ? 'Start your journey' : tried < total ? 'Keep it going!' : 'You did them all! 🎉') + '</strong>' +
        '<p>' + (tried === 0 ? 'Every activity you log gets a check mark here.' : plural(total - tried, 'activity') + ' still waiting in your unlocked products.') + '</p></div></section>' +
      '<div class="cr-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg><input type="search" id="crQ" placeholder="Search by name or number" value="' + esc(actFilter.q) + '" autocomplete="off"></div>' +
      '<div class="cr-chiprow" id="crProds"></div><div class="cr-chiprow sub" id="crCats"></div>' +
      '<label class="cr-toggle"><input type="checkbox" id="crNotDone"' + (actFilter.notDone ? ' checked' : '') + '><span></span>Show only the ones not done yet</label>' +
      '<div id="crActList"></div>' +
      '<p class="foot">Brighter Days · Members Area</p></main>';
    paintChips();
    paintActList();
    var q = $('#crQ');
    q.addEventListener('input', function () { actFilter.q = q.value; paintActList(); });
    $('#crProds').addEventListener('click', function (e) { var b = e.target.closest('[data-prod]'); if (!b) return; setProd(b.dataset.prod); });
    $('#crCats').addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (!b) return; actFilter.cat = b.dataset.cat; paintChips(); paintActList(); });
    $('#crActList').addEventListener('click', function (e) { var b = e.target.closest('[data-prod]'); if (!b) return; e.stopPropagation(); setProd(b.dataset.prod); window.scrollTo({ top: $('#crProds').getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); });
    $('#crNotDone').addEventListener('change', function () { actFilter.notDone = this.checked; paintActList(); });
  }
  function setProd(id) { actFilter.prod = id; actFilter.cat = 'all'; paintChips(); paintActList(); }
  function paintChips() {
    $('#crProds').innerHTML = [['all', 'All products', false]].concat(PRODUCTS.map(function (pr) { return [pr.id, pr.short || pr.title, prodLocked(pr)]; })).map(function (c) {
      return '<button type="button" data-prod="' + c[0] + '"' + (actFilter.prod === c[0] ? ' class="on"' : '') + '>' + (c[2] ? BD.ICON.lock : '') + esc(c[1]) + '</button>';
    }).join('');
    var cats = $('#crCats');
    if (actFilter.prod === 'bd') {
      cats.hidden = false;
      cats.innerHTML = [['all', 'All 150']].concat(['mem', 'mov', 'fam', 'mood'].map(function (c) { return [c, CATS[c].short]; })).map(function (c) {
        return '<button type="button" data-cat="' + c[0] + '"' + (actFilter.cat === c[0] ? ' class="on"' : '') + '>' + esc(c[1]) + '</button>';
      }).join('');
    } else cats.hidden = true;
  }
  function matchQ(a, q) {
    if (!q) return true;
    q = q.trim().toLowerCase();
    if (/^#?\d+$/.test(q)) return String(a.n) === q.replace('#', '');
    return a.t.toLowerCase().indexOf(q) >= 0 || CATS[a.cat].label.toLowerCase().indexOf(q) >= 0;
  }
  function paintActList() {
    var f = actFilter, done = doneMap(), out = '';
    var prods = f.prod === 'all' ? PRODUCTS : PRODUCTS.filter(function (pr) { return pr.id === f.prod; });
    prods.forEach(function (pr) {
      var all = prodItems(pr), lk = prodLocked(pr), o = prodOffer(pr);
      var list = all.filter(function (a) { return (f.cat === 'all' || a.cat === f.cat) && matchQ(a, f.q) && (!f.notDone || !done[a.key]); });
      if (!list.length && (f.q || f.notDone)) return;
      var n = all.filter(function (a) { return done[a.key]; }).length;
      out += '<div class="cr-ph' + (lk ? ' lk' : '') + '"><img src="' + BD.v(pr.cover) + '" alt="" width="300" height="424" loading="lazy">' +
        '<div class="cr-ph-b"><small>' + (lk ? BD.ICON.lock + 'Locked · ' + plural(all.length, pr.unit) : pr.offer ? BD.ICON.check + 'Unlocked' : BD.ICON.check + 'Included in your plan') + '</small>' +
        '<strong>' + esc(prodTitle(pr)) + '</strong>' +
        (lk ? '<a class="cr-grp-btn" href="#/unlock/' + o.id + '">' + BD.ICON.lock + 'Unlock for ' + esc(o.price) + '</a>' :
          '<span class="cr-ph-bar"><i style="width:' + (n / all.length * 100).toFixed(1) + '%"></i></span><em>' + n + ' of ' + plural(all.length, pr.unit) + ' done</em>') +
        '</div></div>';
      var preview = f.prod === 'all' && !f.q && !f.notDone, cut = lk ? 3 : 5;
      var rows = preview ? list.slice(0, cut) : list;
      out += '<div class="cr-card">' + rows.map(function (a) { return actRow(a, { done: done[a.key] }); }).join('') +
        (preview && list.length > cut ? '<button type="button" class="cr-more' + (lk ? '' : ' open') + '" data-prod="' + pr.id + '">See all ' + plural(list.length, pr.unit) + '</button>' : '') +
        (!lk && f.prod === 'all' && !f.q && !f.notDone && list.length > 5 ? '' : '') + '</div>';
    });
    var lt = BD.offer('lifetime');
    if (f.prod === 'all' && !f.q && lt && !BD.has(lt)) out += '<div style="margin-top:22px">' + promoCard(lt, 'New activities every month') + '</div>';
    $('#crActList').innerHTML = out || empty('🔎', 'Nothing found', 'Try another word or number.');
  }

  function viewHistory(rid) {
    var list = logsFor(rid);
    app.innerHTML = header('', '#/today') + '<main class="wrap">' +
      '<section class="cr-hi"><small>Everything you logged</small><h1>History</h1></section>' +
      (DB.residents.length ? '<div class="cr-chiprow"><a href="#/history"' + (!rid ? ' class="on"' : '') + '>Everyone</a>' +
        DB.residents.map(function (r) { return '<a href="#/history/' + r.id + '"' + (rid === r.id ? ' class="on"' : '') + '>' + esc(firstName(r)) + '</a>'; }).join('') + '</div>' : '') +
      (list.length ? '<div class="cr-card">' + logsByDay(list, true) + '</div>' : empty('📝', 'Nothing here yet', 'Activities you log will show up here.')) +
      '<p class="foot">Brighter Days · Members Area</p></main>';
  }

  /* Relatório mensal (imprimir ou salvar em PDF). */
  function viewReport(id, ym) {
    var r = resident(id);
    if (!r) { location.replace('#/residents'); return; }
    ym = ym || ymd().slice(0, 7);
    var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1;
    var prev = ymd(new Date(y, m - 1, 1)).slice(0, 7), next = ymd(new Date(y, m + 1, 1)).slice(0, 7), isNow = ym === ymd().slice(0, 7);
    var ls = sortedLogs(logsFor(id).filter(function (l) { return l.date.slice(0, 7) === ym; })).reverse();
    var am = avgMood(ls), days = {}, cats = {};
    ls.forEach(function (l) { days[l.date] = 1; var a = ACTS[l.act]; if (a) cats[a.cat] = (cats[a.cat] || 0) + 1; });
    var catKeys = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
    var maxC = catKeys.length ? cats[catKeys[0]] : 1;
    var loved = ls.filter(function (l) { return l.mood >= 4; }).map(function (l) { return ACTS[l.act] && ACTS[l.act].t; }).filter(function (t, i, arr) { return t && arr.indexOf(t) === i; }).slice(0, 4);
    var notes = ls.filter(function (l) { return l.note; }).slice(-4);
    var st = STAGES.filter(function (s) { return s.id === r.stage; })[0];
    var nm = firstName(r);

    app.innerHTML = header('Monthly report', '#/resident/' + id) + '<main class="wrap cr-rep-wrap">' +
      '<div class="cr-rep-nav no-print"><a href="#/report/' + id + '/' + prev + '">‹ ' + MONTHS[(m + 11) % 12].slice(0, 3) + '</a><strong>' + MONTHS[m] + ' ' + y + '</strong>' +
        (isNow ? '<span></span>' : '<a href="#/report/' + id + '/' + next + '">' + MONTHS[(m + 1) % 12].slice(0, 3) + ' ›</a>') + '</div>' +
      '<article class="cr-rep" id="crRep">' +
        '<div class="cr-rep-h"><div class="brand">' + BD.ICON.sun + '<span>Brighter Days</span></div><span>Activity Report</span></div>' +
        '<h1>' + esc(r.name) + '</h1><p class="cr-rep-sub">' + MONTHS[m] + ' ' + y + (st && r.stage !== 'unsure' ? ' · ' + esc(st.label) : '') + '</p>' +
        (ls.length ?
        '<div class="cr-rep-k"><div><b>' + ls.length + '</b><span>activities</span></div><div><b>' + Object.keys(days).length + '</b><span>active days</span></div><div><b>' + (am ? mood(am).e : '–') + '</b><span>' + (am ? 'usually ' + mood(am).l.toLowerCase() : 'mood') + '</span></div></div>' +
        '<h2>What we worked on</h2><div class="cr-rep-bars">' + catKeys.map(function (c) {
          return '<div><span>' + esc(CATS[c].label) + '</span><i><em style="width:' + (cats[c] / maxC * 100) + '%;background:' + CATS[c].color + '"></em></i><b>' + cats[c] + '</b></div>';
        }).join('') + '</div>' +
        (loved.length ? '<h2>' + esc(nm) + '&rsquo;s favorites this month</h2><p class="cr-rep-loved">' + loved.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</p>' : '') +
        (notes.length ? '<h2>Moments worth sharing</h2>' + notes.map(function (l) { return '<blockquote>“' + esc(l.note) + '”<cite>' + niceDate(l.date) + ' · ' + esc(ACTS[l.act] ? ACTS[l.act].t : '') + '</cite></blockquote>'; }).join('') : '') +
        '<h2>Session log</h2><table class="cr-rep-t"><thead><tr><th>Date</th><th>Activity</th><th>Response</th></tr></thead><tbody>' +
          ls.map(function (l) { var a = ACTS[l.act], md = l.mood ? mood(l.mood) : null; var dd = parseYmd(l.date); return '<tr><td>' + MONTHS[dd.getMonth()].slice(0, 3) + ' ' + dd.getDate() + '</td><td>' + esc(a ? a.t : '') + '</td><td>' + (md ? md.e + ' ' + md.l : '–') + '</td></tr>'; }).join('') +
        '</tbody></table>' :
        '<div class="cr-rep-empty">No activities logged in ' + MONTHS[m] + ' yet.</div>') +
        '<div class="cr-rep-f"><span>Prepared by <b id="crRepBy">' + esc(DB.me.name || '________________') + '</b></span><span>Generated ' + MONTHS[new Date().getMonth()].slice(0, 3) + ' ' + new Date().getDate() + ', ' + new Date().getFullYear() + '</span></div>' +
      '</article>' +
      '<div class="no-print cr-rep-actions"><label class="cr-field"><span>Your name on the report</span><input type="text" id="crMe" value="' + esc(DB.me.name) + '" placeholder="e.g. Sarah Johnson" maxlength="60"></label>' +
        '<button type="button" class="btn btn-sun" data-print>' + BD.ICON.read + 'Print or save as PDF</button>' +
        '<p class="cr-tip">Tip: families and facility directors love seeing this. It shows the care behind every day.</p></div>' +
      '</main>';
    var me = $('#crMe');
    me.addEventListener('input', function () { DB.me.name = me.value.trim(); $('#crRepBy').textContent = DB.me.name || '________________'; });
    me.addEventListener('change', save);
  }

  /* ================= Janelas: detalhe da atividade ================= */
  function openAct(key, forId) {
    var a = ACTS[key]; if (!a) return;
    L = null; R = null;
    var lk = locked(a), o = actOffer(a), dm = doneMap()[key];
    var lastLog = sortedLogs(DB.logs.filter(function (l) { return l.act === key; }))[0];
    openModal('<button class="cm-x" data-cm-close aria-label="Close">' + BD.ICON.x + '</button>' +
      '<div class="cm-hero' + (lk ? ' lk' : '') + '"><img src="' + thumb(a) + '" alt="" width="480" height="288">' + (lk ? '<span class="cm-hero-lk">' + BD.ICON.lock + '</span>' : '') + '</div>' +
      '<div class="cm-pad"><small class="cm-kick" style="color:' + CATS[a.cat].color + '">' + esc(a.label) + ' · ' + esc(CATS[a.cat].label) + '</small>' +
      '<h2>' + esc(a.t) + '</h2>' +
      (hasLvl(a) ? '<p class="cm-lvl">' + levelDots(a.lvl) + ['', 'Easy', 'Medium', 'Challenging'][a.lvl] + '</p>' : '') +
      (lk ? '<div class="cm-lockbox"><strong>Part of ' + esc(o.title) + '</strong><p>' + esc(o.card) + '</p>' +
          '<button type="button" class="btn btn-gold" data-unlock="' + o.id + '">' + BD.ICON.lock + 'Unlock for ' + esc(o.price) + '</button></div>' :
        '<p class="cm-done">' + (dm ? BD.ICON.check + 'Done ' + plural(dm.count, 'time') + ' · last ' + niceDate(dm.last).toLowerCase() + (lastLog && lastLog.who.length ? ' with ' + esc(names(lastLog.who)) : '') : 'Not tried yet') + '</p>' +
        '<div class="cr-2btn"><button type="button" class="btn btn-line" data-go="' + readHref(a) + '">' + BD.ICON.read + 'Open</button>' +
        '<button type="button" class="btn btn-sun" data-log-act="' + a.key + '"' + (forId ? ' data-for="' + forId + '"' : '') + '>' + BD.ICON.check + (a.cat === 'alz' ? 'Mark as used' : 'Mark as done') + '</button></div>') +
      '</div>');
  }

  /* ================= Janela: registrar atividade ================= */
  var L = null; /* rascunho do registro */
  function openLog(opts) {
    R = null;
    L = { act: opts.act || '', who: opts.who ? opts.who.slice() : DB.residents.length === 1 ? [DB.residents[0].id] : [], mood: 0, note: '', date: ymd(), q: '', adding: false };
    paintLog();
  }
  function paintLog() {
    var a = ACTS[L.act];
    var html = '<button class="cm-x" data-cm-close aria-label="Close">' + BD.ICON.x + '</button><div class="cm-pad cm-log">' +
      '<h2>Log an activity</h2><p class="cm-sub">Takes 10 seconds. Builds a record you can share.</p>';
    /* 1. Atividade */
    html += '<h4 class="cm-step"><i>1</i>Which activity?</h4>';
    if (a) {
      html += '<div class="cm-picked">' + badge(a) + '<span><strong>' + esc(a.t) + '</strong><small>' + esc(a.label + ' · ' + CATS[a.cat].short) + '</small></span><button type="button" data-l-change>Change</button></div>';
    } else {
      html += '<div class="cr-search sm"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg><input type="search" id="lQ" placeholder="Type a name or number, e.g. 37" value="' + esc(L.q) + '" autocomplete="off" enterkeyhint="search"></div>' +
        '<div id="lList" class="cm-list"></div>';
    }
    /* 2. Quem participou */
    html += '<h4 class="cm-step"><i>2</i>Who joined?' + (DB.residents.length > 1 ? '<button type="button" class="cm-all" data-l-all>' + (L.who.length === DB.residents.length ? 'Clear' : 'Select everyone') + '</button>' : '') + '</h4>' +
      '<div class="cm-who">' + DB.residents.map(function (r) {
        var on = L.who.indexOf(r.id) >= 0;
        return '<button type="button" data-l-who="' + r.id + '" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '">' + avatar(r, 'sm') + esc(firstName(r)) + (on ? BD.ICON.check : '') + '</button>';
      }).join('') +
      (L.adding ? '<form class="cm-add" data-l-addform><input type="text" id="lNew" placeholder="Name or nickname" maxlength="40" required><button type="submit">Add</button></form>' :
        '<button type="button" class="cm-plus" data-l-add>' + TAB_ICONS.plus + 'Add person</button>') + '</div>';
    /* 3. Como foi */
    html += '<h4 class="cm-step"><i>3</i>How did it go?</h4><div class="cm-moods">' + MOODS.map(function (m) {
      return '<button type="button" data-l-mood="' + m.v + '" class="' + (L.mood === m.v ? 'on' : '') + '" style="--mc:' + m.c + '"><span>' + m.e + '</span>' + m.l + '</button>';
    }).join('') + '</div>';
    /* 4. Nota e data */
    html += '<textarea id="lNote" rows="2" maxlength="280" placeholder="Anything worth remembering? (optional) e.g. She sang every word of the chorus">' + esc(L.note) + '</textarea>' +
      '<div class="cm-date">' + [['Today', ymd()], ['Yesterday', addDays(ymd(), -1)]].map(function (d) {
        return '<button type="button" data-l-date="' + d[1] + '" class="' + (L.date === d[1] ? 'on' : '') + '">' + d[0] + '</button>';
      }).join('') + '<label class="' + (L.date !== ymd() && L.date !== addDays(ymd(), -1) ? 'on' : '') + '">' + (L.date !== ymd() && L.date !== addDays(ymd(), -1) ? niceDate(L.date) : 'Other day') + '<input type="date" id="lDate" max="' + ymd() + '" value="' + L.date + '"></label></div>' +
      '</div><div class="cm-foot"><button type="button" class="btn btn-sun" data-l-save' + (a ? '' : ' disabled') + '>' + BD.ICON.check + 'Save</button></div>';
    var wasOpen = !cm.hidden, st = cmBody.scrollTop;
    openModal(html, 'cm-tall');
    if (wasOpen) cmBody.scrollTop = st;
    if (!a) {
      paintPicker();
      var q = $('#lQ');
      q.addEventListener('input', function () { L.q = q.value; paintPicker(); });
      if (!wasOpen && window.matchMedia('(min-width: 700px)').matches) q.focus();
    }
    var nt = $('#lNote'); nt.addEventListener('input', function () { L.note = nt.value; });
    var dt = $('#lDate'); dt.addEventListener('change', function () { if (dt.value && dt.value <= ymd()) { L.date = dt.value; paintLog(); } });
    var nw = $('#lNew'); if (nw) nw.focus();
  }
  function paintPicker() {
    var box = $('#lList'); if (!box) return;
    var q = L.q.trim(), html = '';
    if (q) {
      var hits = ACT_LIST.filter(function (a) { return matchQ(a, q); }).sort(function (a, b) { return (locked(a) - locked(b)) || (a.key[0] === 'c' ? -1 : 1); }).slice(0, 12);
      html = hits.length ? hits.map(function (a) { return actRow(a); }).join('') : '<p class="cm-none">No activity found. Try the number on the page.</p>';
    } else {
      var who = L.who.length === 1 ? resident(L.who[0]) : null;
      var recentKeys = []; sortedLogs(DB.logs).forEach(function (l) { if (recentKeys.indexOf(l.act) < 0 && recentKeys.length < 3) recentKeys.push(l.act); });
      var tp = todayPick().a;
      var sug = (who ? suggestFor(who, 4) : [{ a: tp }].concat(suggestFor(null, 3).filter(function (s) { return s.a.key !== tp.key; }))).slice(0, 4);
      html = '<small class="cm-lbl">' + (who ? 'Suggested for ' + esc(firstName(who)) : 'Suggested today') + '</small>' + sug.map(function (s) { return actRow(s.a); }).join('') +
        (recentKeys.length ? '<small class="cm-lbl">Done recently</small>' + recentKeys.map(function (k) { return actRow(ACTS[k]); }).join('') : '');
    }
    box.innerHTML = html;
  }
  function saveLog() {
    if (!L || !ACTS[L.act]) return;
    var entry = { id: uid(), act: L.act, who: L.who.slice(), mood: L.mood || 0, note: L.note.trim(), date: L.date, ts: Date.now() };
    DB.logs.push(entry);
    save();
    var a = ACTS[L.act], wk = weekCount(), st = streak();
    var msg = '🎉 <b>Saved!</b> ' + (entry.who.length > 1 ? 'Logged for ' + entry.who.length + ' people. ' : '') +
      (st > 1 ? st + ' days in a row!' : 'That’s ' + plural(wk, 'activity') + ' this week.');
    var milestone = entry.who.map(function (id) { var n = logsFor(id).length; return n === 10 || n === 25 || n === 50 || n === 100 ? firstName(resident(id)) + ' just reached ' + n + ' activities! 🏆' : ''; }).filter(Boolean)[0];
    L = null;
    closeModal(function () { toast(milestone || msg); refresh(); });
    void a;
  }

  /* ================= Janela: cadastro de pessoa ================= */
  var R = null;
  function openResForm(id) {
    var r = id ? resident(id) : null;
    L = null;
    R = r ? JSON.parse(JSON.stringify(r)) : { id: '', name: '', stage: '', mobility: '', interests: [], notes: '' };
    R.confirmDel = false;
    paintResForm();
  }
  function paintResForm() {
    var html = '<button class="cm-x" data-cm-close aria-label="Close">' + BD.ICON.x + '</button><form class="cm-pad cm-form" data-r-form>' +
      '<h2>' + (R.id ? 'Edit ' + esc(firstName(R)) : 'Add a person') + '</h2><p class="cm-sub">This helps us pick the right activities for them.</p>' +
      '<label class="cr-field"><span>Name or nickname</span><input type="text" id="rName" value="' + esc(R.name) + '" placeholder="e.g. Mary, Mr. Lopez, Mom" maxlength="40" required></label>' +
      '<fieldset><legend>Memory</legend><div class="cm-opts">' + STAGES.map(function (s) {
        return '<button type="button" data-r-stage="' + s.id + '" class="' + (R.stage === s.id ? 'on' : '') + '"><strong>' + esc(s.label) + '</strong><small>' + esc(s.hint) + '</small></button>';
      }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Mobility</legend><div class="cm-opts two">' + MOBILITY.map(function (m) {
        return '<button type="button" data-r-mob="' + m.id + '" class="' + (R.mobility === m.id ? 'on' : '') + '"><strong>' + esc(m.label) + '</strong></button>';
      }).join('') + '</div></fieldset>' +
      '<fieldset><legend>What do they love? <em>(pick any)</em></legend><div class="cm-tags">' + INTERESTS.map(function (i) {
        var on = R.interests.indexOf(i.id) >= 0;
        return '<button type="button" data-r-int="' + i.id + '" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '">' + esc(i.label) + '</button>';
      }).join('') + '</div></fieldset>' +
      '<label class="cr-field"><span>Good to know <em>(optional)</em></span><textarea id="rNotes" rows="3" maxlength="400" placeholder="What calms them, favorite songs, things to avoid…">' + esc(R.notes) + '</textarea></label>' +
      (R.id ? '<button type="button" class="cm-del" data-r-del>' + (R.confirmDel ? 'Tap again to delete ' + esc(firstName(R)) + ' and their history' : 'Remove this person') + '</button>' : '') +
      '<div class="cm-foot"><button type="submit" class="btn btn-sun">' + BD.ICON.check + (R.id ? 'Save changes' : 'Add person') + '</button></div></form>';
    var wasOpen = !cm.hidden, st = cmBody.scrollTop;
    openModal(html, 'cm-tall');
    if (wasOpen) cmBody.scrollTop = st;
    var n = $('#rName'); n.addEventListener('input', function () { R.name = n.value; });
    var nt = $('#rNotes'); nt.addEventListener('input', function () { R.notes = nt.value; });
    if (!wasOpen && !R.id && window.matchMedia('(min-width: 700px)').matches) n.focus();
  }
  function saveRes() {
    var name = (R.name || '').trim();
    if (!name) { $('#rName').focus(); return; }
    var isNew = !R.id;
    var data = { id: R.id || uid(), name: name, stage: R.stage || 'unsure', mobility: R.mobility || '', interests: R.interests, notes: (R.notes || '').trim() };
    if (isNew) { data.color = AVATAR[DB.residents.length % AVATAR.length]; data.created = Date.now(); DB.residents.push(data); }
    else { var r = resident(R.id); Object.keys(data).forEach(function (k) { r[k] = data[k]; }); }
    save();
    R = null;
    closeModal(function () {
      toast(isNew ? '👋 <b>' + esc(firstName(data)) + '</b> was added. Here are activities picked for them.' : 'Changes saved.');
      if (isNew) location.hash = '#/resident/' + data.id; else refresh();
    });
  }
  function deleteRes() {
    var id = R.id;
    DB.residents = DB.residents.filter(function (r) { return r.id !== id; });
    DB.logs.forEach(function (l) { l.who = l.who.filter(function (w) { return w !== id; }); });
    save(); R = null;
    closeModal(function () { toast('Removed.'); location.hash = '#/residents'; });
  }

  /* ================= Janela: registro já salvo ================= */
  function openLogEntry(id, confirmDel) {
    var l = DB.logs.filter(function (x) { return x.id === id; })[0]; if (!l) return;
    L = null; R = null;
    var a = ACTS[l.act], m = l.mood ? mood(l.mood) : null;
    openModal('<button class="cm-x" data-cm-close aria-label="Close">' + BD.ICON.x + '</button><div class="cm-pad">' +
      '<small class="cm-kick" style="color:' + CATS[a.cat].color + '">' + niceDate(l.date) + ' · ' + esc(CATS[a.cat].label) + '</small>' +
      '<h2>' + esc(a.t) + '</h2>' +
      (m ? '<p class="cm-moodline" style="--mc:' + m.c + '"><span>' + m.e + '</span>' + m.l + '</p>' : '') +
      (l.who.length ? '<p class="cm-withline">' + l.who.map(resident).filter(Boolean).map(function (r) { return avatar(r, 'sm'); }).join('') + '<span>with ' + esc(names(l.who)) + '</span></p>' : '') +
      (l.note ? '<blockquote class="cm-q">“' + esc(l.note) + '”</blockquote>' : '') +
      '<div class="cr-2btn"><button type="button" class="btn btn-line" data-act-open="' + a.key + '">See activity</button>' +
      '<button type="button" class="btn btn-sun" data-log-act="' + a.key + '" data-who="' + l.who.join(',') + '">Do it again</button></div>' +
      '<button type="button" class="cm-del" data-del-log="' + l.id + '" data-confirm="' + (confirmDel ? 1 : 0) + '">' + (confirmDel ? 'Tap again to delete this entry' : 'Delete this entry') + '</button></div>');
  }

  /* ================= Eventos (delegação única) ================= */
  function onClick(e) {
    var t = e.target, el;
    if ((el = t.closest('[data-log-act]'))) {
      var forId = el.dataset.for, who = el.dataset.who;
      var opts = { act: el.dataset.logAct, who: who ? who.split(',').filter(resident) : forId ? [forId] : null };
      if (!cm.hidden) { openLog(opts); return; }
      openLog(opts); return;
    }
    if ((el = t.closest('[data-log-for]'))) { openLog({ who: [el.dataset.logFor] }); return; }
    if (t.closest('[data-welcome-start]')) { welcomeDone(); openResForm(); return; }
    if (t.closest('[data-welcome-done]')) { welcomeDone(); return; }
    if (t.closest('[data-welcome]')) { openWelcome(); return; }
    if ((el = t.closest('[data-add-res]'))) { openResForm(); return; }
    if ((el = t.closest('[data-edit-res]'))) { openResForm(el.dataset.editRes); return; }
    if ((el = t.closest('[data-unlock]'))) { go('#/unlock/' + el.dataset.unlock); return; }
    if ((el = t.closest('[data-go]'))) { go(el.dataset.go); return; }
    if ((el = t.closest('[data-act-open]'))) { openAct(el.dataset.actOpen); return; }
    if ((el = t.closest('[data-print]'))) { save(); window.print(); return; }
    if ((el = t.closest('[data-export]'))) { exportData(); return; }

    /* Dentro do registro */
    if (L && cm.contains(t)) {
      if ((el = t.closest('[data-act]'))) {
        var a = ACTS[el.dataset.act];
        if (locked(a)) { go('#/unlock/' + actOffer(a).id); return; }
        L.act = a.key; L.q = ''; paintLog(); return;
      }
      if (t.closest('[data-l-change]')) { L.act = ''; paintLog(); return; }
      if ((el = t.closest('[data-l-who]'))) { var w = el.dataset.lWho, i = L.who.indexOf(w); if (i >= 0) L.who.splice(i, 1); else L.who.push(w); paintLog(); if (!L.act) paintPicker(); return; }
      if (t.closest('[data-l-all]')) { L.who = L.who.length === DB.residents.length ? [] : DB.residents.map(function (r) { return r.id; }); paintLog(); return; }
      if (t.closest('[data-l-add]')) { L.adding = true; paintLog(); return; }
      if ((el = t.closest('[data-l-mood]'))) { L.mood = L.mood === +el.dataset.lMood ? 0 : +el.dataset.lMood; paintLog(); return; }
      if ((el = t.closest('[data-l-date]'))) { L.date = el.dataset.lDate; paintLog(); return; }
      if (t.closest('[data-l-save]')) { saveLog(); return; }
      return;
    }
    /* Dentro do cadastro */
    if (R && cm.contains(t)) {
      if ((el = t.closest('[data-r-stage]'))) { R.stage = el.dataset.rStage; paintResForm(); return; }
      if ((el = t.closest('[data-r-mob]'))) { R.mobility = R.mobility === el.dataset.rMob ? '' : el.dataset.rMob; paintResForm(); return; }
      if ((el = t.closest('[data-r-int]'))) { var k = el.dataset.rInt, j = R.interests.indexOf(k); if (j >= 0) R.interests.splice(j, 1); else R.interests.push(k); paintResForm(); return; }
      if (t.closest('[data-r-del]')) { if (R.confirmDel) deleteRes(); else { R.confirmDel = true; paintResForm(); } return; }
      return;
    }
    if ((el = t.closest('[data-del-log]'))) {
      if (el.dataset.confirm === '1') {
        DB.logs = DB.logs.filter(function (l) { return l.id !== el.dataset.delLog; }); save();
        closeModal(function () { toast('Entry deleted.'); refresh(); });
      } else openLogEntry(el.dataset.delLog, true);
      return;
    }
    if ((el = t.closest('[data-log]'))) { openLogEntry(el.dataset.log); return; }
    if ((el = t.closest('[data-act]'))) {
      var ak = ACTS[el.dataset.act];
      if (locked(ak) && !el.closest('.cm')) { location.hash = '#/unlock/' + actOffer(ak).id; return; }
      openAct(el.dataset.act, el.dataset.for); return;
    }
  }
  function onSubmit(e) {
    var f = e.target;
    if (f.matches('[data-r-form]')) { e.preventDefault(); saveRes(); }
    if (f.matches('[data-l-addform]')) {
      e.preventDefault();
      var name = $('#lNew').value.trim(); if (!name) return;
      var r = { id: uid(), name: name, stage: 'unsure', mobility: '', interests: [], notes: '', color: AVATAR[DB.residents.length % AVATAR.length], created: Date.now() };
      DB.residents.push(r); save();
      L.who.push(r.id); L.adding = false; paintLog();
    }
  }
  function onChange(e) {
    if (e.target.matches('[data-import]')) {
      var file = e.target.files[0]; if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var d = JSON.parse(rd.result);
          if (!d || !Array.isArray(d.residents) || !Array.isArray(d.logs)) throw 0;
          DB = { v: 1, me: d.me || { name: '' }, residents: d.residents, logs: d.logs }; save();
          toast('Backup restored: ' + plural(DB.residents.length, 'person') + ', ' + plural(DB.logs.length, 'activity') + '.'); refresh();
        } catch (er) { toast('That file is not a Brighter Days backup.'); }
      };
      rd.readAsText(file);
    }
  }
  function exportData() {
    var blob = new Blob([JSON.stringify(DB, null, 1)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'brighter-days-backup-' + ymd() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /* Re-desenha a tela atual depois de salvar algo (sem perder a rolagem). */
  function refresh() { if (BD && BD.rerender) BD.rerender(); }

  /* ================= Boas-vindas (primeiro acesso) ================= */
  function openWelcome() {
    L = null; R = null;
    openModal('<button class="cm-x" data-cm-close data-welcome-done aria-label="Close">' + BD.ICON.x + '</button>' +
      '<div class="cm-pad cm-welcome"><div class="cm-w-sun">' + BD.ICON.sun + '</div>' +
      '<h2>Welcome to your care planner</h2>' +
      '<p class="cm-sub">Brighter Days now helps you plan each day and keep track of every person you care for. Here is how it works:</p>' +
      '<ol class="cm-w-steps">' +
        '<li><span>👵</span><div><strong>Add the people you care for</strong><p>Their memory stage, mobility and what they love. It takes about a minute.</p></div></li>' +
        '<li><span>☀️</span><div><strong>Open today&rsquo;s activity</strong><p>A ready-to-use activity every day, plus a pick made for each person.</p></div></li>' +
        '<li><span>✅</span><div><strong>Log it in 10 seconds</strong><p>Tap the yellow <b>+</b> after each activity. You build a history and a monthly report to share with families.</p></div></li>' +
      '</ol>' +
      '<button type="button" class="btn btn-sun" data-welcome-start>' + TAB_ICONS.plus + 'Add the first person</button>' +
      '<button type="button" class="cm-later" data-cm-close data-welcome-done>I&rsquo;ll do it later</button></div>');
  }
  function welcomeDone() { if (!DB.me.onboarded) { DB.me.onboarded = 1; save(); } }

  /* ================= Card na tela inicial ================= */
  function homeCard() {
    var tp = todayPick(), a = tp.a, st = streak();
    return '<section class="sec"><a class="cr-home" href="#/today">' +
      '<span class="cr-home-img"><img src="' + thumb(a) + '" alt="" width="480" height="288" decoding="async"></span>' +
      '<span class="cr-home-b"><small>☀️ Your plan for today</small><strong>' + esc(a.t) + '</strong>' +
      '<em>' + (DB.logs.length ? (st > 1 ? '🔥 ' + st + ' days in a row · ' : '') + plural(weekCount(), 'activity') + ' this week' : 'Tap to see today&rsquo;s pick and start tracking') + '</em></span>' +
      '<span class="cr-chev"></span></a></section>';
  }

  /* ================= Início ================= */
  window.Care = {
    ROUTES: { today: 1, residents: 1, resident: 1, activities: 1, history: 1, report: 1 },
    init: function (detail) {
      BD = window.BD;
      if (detail && detail.userKey) STORE.key = 'bd_care_v1:' + detail.userKey;
      var saved = STORE.load();
      if (!saved && detail && detail.userKey) { try { var old = localStorage.getItem('bd_care_v1'); if (old) saved = JSON.parse(old); } catch (e) {} }
      if (saved && saved.residents) DB = { v: 1, me: saved.me || { name: '' }, residents: saved.residents, logs: saved.logs || [] };
      buildTabs(); buildModal();
      document.addEventListener('click', onClick);
      document.addEventListener('submit', onSubmit);
      document.addEventListener('change', onChange);
      window.addEventListener('hashchange', setTab);
      setTab();
      if (!DB.me.onboarded && !DB.residents.length && !DB.logs.length) setTimeout(function () { if (cm.hidden) openWelcome(); }, 700);
    },
    render: render,
    homeCard: homeCard,
    openLog: function (key) { openLog({ act: key }); },
    setTab: setTab,
    ACTS: ACTS
  };
})();
