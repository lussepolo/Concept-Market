
import { Project, Division, Family } from '../types';

const RAW_DATA = [
  // High School Projects (9-10)
  { grade: "10A", title: "How can women travel safely alone?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "Mini-documentary about challenges and solutions of women travelling by themselves.", team: ["Joaquim X.", "Mariana P.", "Nina M.", "Valerie C."] },
  { grade: "10A", title: "How might we encourage our school community to make healthier and more sustainable food choices?", mentor: "Regina Barbosa", area: "Health & Well-being / Nutrition", theme: "Sustainability & Environment", type: "Product", mdp: "Demonstrating the benefits of eating fish in fun, simple and engaging ways.", team: ["Cecília C."] },
  { grade: "10A", title: "How might we create a kinetic floor tile that generates electricity?", mentor: "Marcio Fernandes", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A tile that generates energy from foot traffic.", team: ["Marco C.", "Miguel V.", "Vinícius A."] },
  { grade: "10A", title: "How might we create a Roblox game that teaches recycling?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "The initial phases of a Roblox game focuses on sustainability.", team: ["Augusto T.", "Dante B.", "Giorgio B.", "Guilherme M.", "Heitor R."] },
  { grade: "10B", title: "How can we design a sustainable basketball hoop system?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "A basketball game that integrates sustainability concepts.", team: ["Antonia S.", "Kyara K.", "Maya C.", "Valentina V."] },
  { grade: "10B", title: "How might we promote e-sports culture at Concept?", mentor: "Marcio Fernandes", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "An e-sports program/event at school.", team: ["Lucas R.", "Pedro L.", "Vitor F."] },
  { grade: "10B", title: "How might we create an online hub on overconsumption, psychology, and beauty?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A printed magazine focused on overconsumption.", team: ["Eeva P.", "Sofia V.", "Anna B."] },
  { grade: "10B", title: "How can we make cosmetics using natural ingredients?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A collection of perfumes with hypoallergenic/natural ingredients.", team: ["Ana Luisa C.", "Gabriela B.", "Helena M.", "Leticia C.", "Maísa C."] },
  { grade: "10C", title: "How can we design a sports workshop that builds skills and opportunities?", mentor: "Karin Gunn", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Workshop to deal with frustration in sports.", team: ["Artur C.", "Breno F.", "Fernando F.", "Gustavo I."] },
  { grade: "10C", title: "How might we design a space that helps overwhelmed learners at Concept relax?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A calm down corner to support adolescents self-regulation.", team: ["Lorenzo B.", "Michel E.", "Theodoro L."] },
  { grade: "10C", title: "How can we design long-lasting fashion products?", mentor: "Regina Barbosa", area: "Sustainability / Arts & Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A wedding dress study (moulage).", team: ["Felipe S.", "Lorenzo C.", "Pedro L.", "Rafael C."] },
  { grade: "10C", title: "How might we better inform people about how sports and exercise help with stress?", mentor: "Marcio Fernandes", area: "Health & Well-being / Psychology", theme: "Social Impact & Community Engagement", type: "Service", mdp: "The pilot of a Podcast Show about sports and physical education.", team: ["Catarina S.", "Eduardo D.", "Elisa G.", "Helena F.", "Teo V.", "Gabriel B."] },
  
  // 9th Grade
  { grade: "9A", title: "How can handcrafting support sustainable fashion and teen mental well-being?", mentor: "Karin Gunn", area: "Health & Well-being / Psychology", theme: "Sustainability & Environment", type: "Product", mdp: "A sustainable piece of cloth that reflects on sustainable fashion.", team: ["Chloe C.", "Helena C.", "Laura S.", "Laura T.", "Olivia P.", "Tomás B."] },
  { grade: "9A", title: "How might we help animals in shelters awaiting adoption?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A dog cookie with different tags for dogs waiting to be adopted.", team: ["Camila F.", "Maria Eduarda M.", "Valentina G.", "Benjamin R.", "Bernardo B.", "Frederico I.", "Theo P."] },
  { grade: "9A", title: "How might we generate renewable energy in cities using high water flow?", mentor: "Marcio Fernandes", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A plug'n play turbine that can be connected to different pipes.", team: ["Aylla S.", "Joaquim M.", "Luisa D.", "Rafael B.", "Valentina H.", "Manuela M.", "Sofia D.", "Sofia R."] },
  { grade: "9A", title: "How can we use hydrogen as alternative fuel?", mentor: "Regina Barbosa", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A hydrogen motor in a remote control car.", team: ["Alice Q.", "Catharina L.", "Luiz B.", "Olivia S.", "Teresa F.", "Francisco V.", "Frederico C.", "Max W.", "Pedro S."] },
  { grade: "9A", title: "How might we create a gamified app to teach Physics?", mentor: "Marcio Fernandes", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A Duolingo that teaches Physics.", team: ["Bernardo N.", "Davi D.", "Felipe S."] },
  { grade: "9A", title: "How can we promote the practice of exercises in school campus?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "Structured reports and promotion campaigns.", team: ["Guilherme B.", "João C.", "Miguel O."] },
  { grade: "9A", title: "How might we help animals in shelters awaiting adoption?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A dog cookie with different tags for dogs waiting to be adopted.", team: ["Manuela G.", "Melissa A.", "Nicole F.", "Stella H."] },
  
  { grade: "9B", title: "How can we design interactive experiences to encourage healthy eating?", mentor: "Karin Gunn", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A board/digital game to help people read and understand food labels.", team: ["Ana Beatriz V.", "Antonio C.", "Guilherme S.", "Theodora G.", "Antonio F.", "Helena N.", "Lorena G.", "Setela S."] },
  { grade: "9B", title: "How can we prototype sports shoes for multiple sports demands?", mentor: "Regina Barbosa", area: "Health & Well-being / Sports Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A prototype of the sport shoes with multiple outsoles (AI).", team: ["Filipa N.", "Júlia Z.", "Luana A.", "Sarah G.", "Eduardo R.", "Felipe D.", "Lorenzo T.", "Luis Felipe S.", "Nicholas K.", "Tales B."] },
  { grade: "9B", title: "How might we create affordable vegan biscuits/bars for protein intake?", mentor: "Marcio Fernandes", area: "Health & Well-being / Nutrition", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A vegan protein bar.", team: ["Arthur T.", "Pedro V.", "Raul T."] },
  { grade: "9B", title: "How can we use sports to celebrate teamwork and friendship at Concept?", mentor: "Tainah Michida", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Mini tournament with different modalities to happen in the last week of school.", team: ["Elena V.", "Isabela C.", "Lorenzo I.", "Pedro M.", "Vitor P."] },
  
  { grade: "9C", title: "How can we integrate AI with human tutors to support LS students in math?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Service", mdp: "A math tutor using a mix of AI and real people.", team: ["Gabriela M.", "Heloisa C.", "Maria Eduarda R.", "Marina B.", "Betania C.", "Enzo M.", "João B.", "Leonardo B.", "Pietro F."] },
  { grade: "9C", title: "How can we understand the brazilian territory and biomes through Rally dos Sertões?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Rally through the Brazilian Biomes experience.", team: ["Louise C.", "Chloe R.", "João L.", "Alexandre D.", "Maria Davi M.", "Frederico Z.", "João F.", "Luca L.", "Nicholas W."] },
  { grade: "9C", title: "How can we support well-being of elderly with Alzheimer's?", mentor: "Karin Gunn", area: "Health & Well-being / Psychology", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "Card game to support conversation and reflection for elderly with Alzheimer's.", team: ["Bianca A.", "Isabella L.", "Rafaela A."] },
  { grade: "9C", title: "How might we address fidgeting needs for neurodivergent students?", mentor: "Marcio Fernandes", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "An education kit with pencil case with pencils and fidgeting toys.", team: ["Antonio G.", "Cecilia L.", "Leonardo M.", "Maria Cecilia V.", "Rafael P."] },
  { grade: "9C", title: "How can we design a sustainable collection of accessories using textile residue?", mentor: "Regina Barbosa", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A collection of charms to personalize your purse and a toolkit to create your own charm.", team: ["Isadora L.", "Luisa F.", "Luisa N."] },
  { grade: "9C", title: "How might we develop sustainable food packaging options?", mentor: "Tainah Michida", area: "Health & Well-being / Nutrition", theme: "Sustainability & Environment", type: "Product", mdp: "A box with a brigadeiro that turns into a decorative christmas tree.", team: ["André B.", "Andre L.", "Natália M.", "Manuela Y."] },
  
  // Middle School Projects (6-8)
  // 8th Grade
  { grade: "8A", title: "How can a fashion event raise awareness for a social cause?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Service", mdp: "An experience that connects fashion and social topics.", team: ["Bruno P.", "Frederico B.", "Leonardo B.", "Lucca P."] },
  { grade: "8A", title: "Volleyball 4 Girls / How can we help girls play more sports?", mentor: "Maira Gouveia", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "A collection of jersey and team uniforms for events.", team: ["Catharina L."] },
  { grade: "8A", title: "How might we create and market thermos bottles that heat and chill?", mentor: "Marcio Fernandes", area: "Sustainability / Arts & Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A thermos bottle that heats and chills.", team: ["Enzo R.", "Lugi A.", "Martin A.", "Paulo S.", "Camilo A.", "Antonio N.", "Augusto B.", "Davi P.", "Guilherme G."] },
  { grade: "8A", title: "How can a sustainable fashion event support eco-friendly community growth?", mentor: "Regina Barbosa", area: "Technology / Education", theme: "Sustainability & Environment", type: "Service", mdp: "A platform to organize and promote eco-fashion events.", team: ["Ana Beatriz S.", "Lorena F.", "Manuela B.", "Gabriela A.", "Antonia V.", "Antonio D.", "Bernardo C.", "Elle G.", "Julia A.", "Bruno L.", "Henrique B.", "Leo I.", "Stela S."] },
  { grade: "8A", title: "How can we develop student leaders who inspire and train others to lead?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A website with the workshop options, instructor profiles and sign up form.", team: ["Alexandre M.", "Enzo M.", "Nicola G."] },
  
  { grade: "8B", title: "How can we improve focus, organization, and time management for learners?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Executive skill training, website, workshop, or mentorship program.", team: ["Beatriz G.", "Beatriz S.", "Emmanuelle C.", "Marcos C."] },
  { grade: "8B", title: "How does daily reading for pleasure impact teens' well-being?", mentor: "Maira Gouveia", area: "Health & Well-being / Psychology", theme: "Health, Well-being & Nutrition", type: "Service", mdp: "A family book club called mysterious box.", team: ["Ana Luisa S.", "Elsa G.", "Francisco N.", "Guilhermina Q."] },
  { grade: "8B", title: "How might we design an ointment for jellyfish stings?", mentor: "Marcio Fernandes", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "An ointment for jellyfish stings.", team: ["Maria M.", "Antonio N.", "Bernardo Z.", "Pedro M."] },
  { grade: "8B", title: "How can we create visibility for young fashion designers?", mentor: "Regina Barbosa", area: "Sustainability / Arts & Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A Magazine to promote New Fashion Designers.", team: ["Peter B.", "Gabriela S.", "Rafaela R."] },
  
  { grade: "8C", title: "How can we design a business that connects students with service learning?", mentor: "Karin Gunn", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "An app to connect NGO with volunteers.", team: ["João Pedro V.", "Luca P."] },
  { grade: "8C", title: "How can we build a magazine that helps us to better integrate the school?", mentor: "Maira Gouveia", area: "Communication / Media Literacy", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A lifestyle teen magazine with interviews, articles and tips.", team: ["Carolina F.", "Olivia L.", "Rafaella B.", "Rafaella Z."] },
  { grade: "8C", title: "How might we develop essential skills for young people joining the job market?", mentor: "Marcio Fernandes", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "A learning platform focused on getting their first job.", team: ["Guilherme M.", "Theo D."] },
  { grade: "8C", title: "How might we build a business that teaches first aid and life-saving skills?", mentor: "Marcio Fernandes", area: "Technology / Education", theme: "Health, Well-being & Nutrition", type: "Service", mdp: "A 2-year first-aid and heimlich maneuver certification for learners.", team: ["Ana Teresa Z.", "Arthur S.", "Enrico C.", "Pedro D."] },
  { grade: "8C", title: "How can kids develop smart money habits with allowances?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A board game focused on allowance management.", team: ["Cícero S.", "Eduardo G.", "Gustavo D.", "Matteo E."] },
  { grade: "8C", title: "How can we promote circularity in fashion using technology?", mentor: "Regina Barbosa", area: "Sustainability / Arts & Design", theme: "Sustainability & Environment", type: "Product", mdp: "An app to promote fashion circularity helping people combine outfits.", team: ["Thomas M."] },
  
  // 7th Grade
  { grade: "7A", title: "How might we raise awareness of how individual dreams shape our future?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "An animation based on learner's drawings and AI tools.", team: ["Ana N.", "Beatriz A.", "Manuela D.", "Rocco R."] },
  { grade: "7A", title: "How might we help raise awareness about relationships and emotions?", mentor: "Maira Gouveia", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Service", mdp: "Activities on self awareness, mental and physical health.", team: ["Gabriela M.", "Heloisa C.", "Maria Eduarda R.", "Marina B."] },
  { grade: "7A", title: "How might we design a protein bar that is both nutritious and delicious?", mentor: "Marcio Fernandes", area: "Health & Well-being / Nutrition", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A protein bar, with a better taste.", team: ["Bruno P.", "Frederico B.", "Leonardo B.", "Lucca P."] },
  { grade: "7A", title: "How can we pay homage to a favorite movie series through humor?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "The pilot of a TV Show of a parody of Star Wars (5 min).", team: ["Antonia V.", "Antonio D.", "Bernardo C.", "Elle G.", "Julia A."] },
  { grade: "7A", title: "How can we use humor in the kitchen to bring joy to others?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A pilot of a Webseries focused on cooking and having fun.", team: ["Louise C.", "Chloe R.", "João L.", "Alexandre D.", "Maria Davi M."] },
  
  { grade: "7B", title: "How does music spark creativity and strengthen community?", mentor: "Karin Gunn", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A playlist of musics based on learner's poetry.", team: ["Bianca A.", "Isabella L.", "Rafaela A."] },
  { grade: "7B", title: "How can we use wasted cups from the school to create clothes and accessories?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A collection of accessories made by paper cups.", team: ["Bernardo G.", "Felipe B.", "Leonardo M.", "Lucas H.", "Fernanda S.", "Giovanna S.", "João Guilherme F.", "Sophia C."] },
  { grade: "7B", title: "How might we design a healthier version of a hamburger?", mentor: "Marcio Fernandes", area: "Health & Well-being / Nutrition", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A healthier hamburger.", team: ["Collin S.", "Felipe V.", "Felippo G.", "João F."] },
  { grade: "7B", title: "How can car engines be changed to use clean energy (solar/agricultural fuels)?", mentor: "Regina Barbosa", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A interactive manual explaining how to convert a vehicle with a regular motor to an electric motor.", team: ["Gustavo K.", "João Luca A.", "Lucas C.", "Luisa B.", "Marina S."] },
  { grade: "7B", title: "How can we encourage younger students to create a respectful sports environment?", mentor: "Tainah Michida", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A theatrical performance to inspire belonging and equity.", team: ["Everaldo T.", "João S."] },
  
  { grade: "7C", title: "How can we co-create a school learning garden with younger learners?", mentor: "Karin Gunn", area: "Sustainability / Environmental Science", theme: "Sustainability & Environment", type: "Product", mdp: "A learning garden (co-created w/ PK3).", team: ["Ana Beatriz V.", "Antonio C.", "Guilherme S.", "Theodora G."] },
  { grade: "7C", title: "How can color and creativity help younger students build healthy eating habits?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A creative kit or guide to encourage healthy eating habits through art.", team: ["Antonio F.", "Helena N.", "Lorena G.", "Setela S."] },
  { grade: "7C", title: "How might we create a board game to promote health eating habits?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A board game that stimulates healthy eating habits and recipe sharing.", team: ["Filipa N.", "Júlia Z.", "Luana A.", "Sarah G."] },
  { grade: "7C", title: "How can reading support children's emotional development?", mentor: "Regina Barbosa", area: "Communication / Media Literacy", theme: "Arts, Culture & Expression", type: "Product", mdp: "An interactive book shelf to promote a book exchange.", team: ["Arthur T.", "Pedro V.", "Raul T."] },
  
  // 6th Grade
  { grade: "6A", title: "How can we design personalized kindness patches to show gratitude to our educators?", mentor: "Karin Gunn", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Kindness through clothe personalization (embroidery).", team: ["Catarina S.", "Eduardo D.", "Elisa G.", "Helena F.", "Teo V.", "Gabriel B."] },
  { grade: "6A", title: "How can we share information about athletic activities and events at Concept?", mentor: "Maira Gouveia", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Product", mdp: "1st edition of the School Sports Newsletter. 12 pages, 400 copies.", team: ["Chloe C.", "Helena C.", "Laura S.", "Laura T.", "Olivia P.", "Tomás B."] },
  { grade: "6A", title: "How might we help animal shelters in Brazil with editable materials?", mentor: "Marcio Fernandes", area: "Sustainability / Engineering", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A Canva digital toolkit that can be customized by animal shelters to engage adoption.", team: ["Camila F.", "Maria Eduarda M.", "Valentina G."] },
  { grade: "6A", title: "How can football culture be shaped to promote peace and mutual respect?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A website with content promoting peace in soccer fields.", team: ["Benjamin R.", "Bernardo B.", "Frederico I.", "Theo P."] },
  { grade: "6A", title: "How might we bring comfort, connection, and joy to people in nursing homes?", mentor: "Tainah Michida", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A box of senior care toys.", team: ["Aylla S.", "Joaquim M.", "Luisa D.", "Rafael B."] },
  
  { grade: "6B", title: "How can we raise awareness about the importance of beach conservation?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "A pop-up book with activities focused on raising awareness about beach conservation.", team: ["Alice Q.", "Catharina L.", "Luiz B.", "Olivia S.", "Teresa F."] },
  { grade: "6B", title: "How can we design an animal adoption campaign in collaboration with Instituto Ampara?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "An animal caring calendar (possible animal adoption fair).", team: ["Francisco V.", "Frederico C.", "Max W.", "Pedro S."] },
  { grade: "6B", title: "How can we use AI to create campaigns that support animal causes?", mentor: "Maira Gouveia", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "Guessing card game to identify real dogs vs AI generated images.", team: ["Bernardo N.", "Davi D.", "Felipe S."] },
  { grade: "6B", title: "In what ways can embroidery be used to repurpose clothes into sustainable fashion?", mentor: "Regina Barbosa", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "A collection of embroidered cellphone cases.", team: ["Guilherme B.", "João C.", "Miguel O."] },
  
  { grade: "6C", title: "How might we create mindful experiences for MS learners to reset?", mentor: "Karin Gunn", area: "Health & Well-being / Psychology", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A Concept Friends book (Bobbie-Goods-inspired).", team: ["Manuela G.", "Melissa A.", "Nicole F.", "Stella H."] },
  { grade: "6C", title: "How can we encourage younger generations to engage with community members?", mentor: "Maira Gouveia", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Service", mdp: "PenPal service for elderly people and a club.", team: ["Collin S.", "Felipe V.", "Felippo G.", "João F."] },
  { grade: "6C", title: "How can fruit-based ingredients be used to make natural hair care products?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A collection of fruit-based shampoos.", team: ["Gustavo K.", "João Luca A.", "Lucas C.", "Luisa B."] },
  { grade: "6C", title: "How might we convert battery-powered toys to work on solar energy?", mentor: "Marcio Fernandes", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A solar-energy toy car.", team: ["Marina S.", "Everaldo T.", "João S."] },
  { grade: "6C", title: "How can we design an event at school, combining sports and arts?", mentor: "Regina Barbosa", area: "Health & Well-being / Sports Education", theme: "Arts, Culture & Expression", type: "Service", mdp: "A workshop to bring together skate and art/design and customize the shape of a skate.", team: ["Ana Beatriz V.", "Antonio C.", "Guilherme S."] },
];

// Get a themed image seed based on project content
// Different seed ranges produce different image styles on Lorem Picsum
const getThemedSeed = (title: string, theme: string, index: number): number => {
  const lowerTitle = title.toLowerCase();
  const lowerTheme = theme.toLowerCase();
  
  // Assign different seed ranges based on project theme/topic
  if (lowerTitle.includes('energy') || lowerTitle.includes('solar') || lowerTitle.includes('recycl') || lowerTitle.includes('sustainab')) {
    return 100 + index; // Nature-like images
  }
  if (lowerTitle.includes('game') || lowerTitle.includes('roblox') || lowerTitle.includes('app') || lowerTitle.includes('ai') || lowerTitle.includes('digital')) {
    return 200 + index; // Tech images
  }
  if (lowerTitle.includes('food') || lowerTitle.includes('eating') || lowerTitle.includes('protein') || lowerTitle.includes('nutrition') || lowerTitle.includes('hamburger')) {
    return 300 + index; // Food images
  }
  if (lowerTitle.includes('fashion') || lowerTitle.includes('clothes') || lowerTitle.includes('design') || lowerTitle.includes('cosmetic')) {
    return 400 + index; // Fashion/design images
  }
  if (lowerTitle.includes('sport') || lowerTitle.includes('basketball') || lowerTitle.includes('volleyball') || lowerTitle.includes('exercise') || lowerTitle.includes('fitness')) {
    return 500 + index; // Sports images
  }
  if (lowerTitle.includes('animal') || lowerTitle.includes('pet') || lowerTitle.includes('dog') || lowerTitle.includes('shelter')) {
    return 600 + index; // Animal images
  }
  if (lowerTitle.includes('community') || lowerTitle.includes('elderly') || lowerTitle.includes('nursing') || lowerTitle.includes('volunteer')) {
    return 700 + index; // Community images
  }
  if (lowerTitle.includes('music') || lowerTitle.includes('art') || lowerTitle.includes('movie') || lowerTitle.includes('reading') || lowerTitle.includes('book')) {
    return 800 + index; // Arts images
  }
  if (lowerTitle.includes('health') || lowerTitle.includes('medical') || lowerTitle.includes('mental') || lowerTitle.includes('stress')) {
    return 900 + index; // Health images
  }
  
  // Fallback based on theme category
  if (lowerTheme.includes('sustainability')) return 150 + index;
  if (lowerTheme.includes('technology')) return 250 + index;
  if (lowerTheme.includes('health')) return 350 + index;
  if (lowerTheme.includes('social')) return 450 + index;
  if (lowerTheme.includes('arts')) return 550 + index;
  
  return 1000 + index; // Default
};

// Generates the set of projects from the dataset
export const seedProjects = (): Project[] => {
  return RAW_DATA.map((item, index) => {
    // Infer division from Grade (6-8 MS, 9-10 HS)
    const gradeNum = parseInt(item.grade.replace(/\D/g, ''));
    const division = gradeNum >= 9 ? Division.HIGH_SCHOOL : Division.MIDDLE_SCHOOL;
    
    // Generate themed image using Lorem Picsum (more reliable)
    // Different seed ranges give varied but consistent images per theme
    const baseSeed = getThemedSeed(item.title, item.theme, index);
    const imageUrl = `https://picsum.photos/seed/${baseSeed}/800/600`;

    return {
      id: `proj_${index + 1}`,
      title: item.title,
      division: division,
      grade: item.grade,
      mentor: item.mentor,
      primaryArea: item.area,
      theme: item.theme,
      outputType: item.type,
      mdp: item.mdp,
      team: item.team,
      imageUrl: imageUrl,
      totalHoursInvested: 0,
      investorCount: 0
    };
  });
};

export const seedFamilies = (): Family[] => {
  return [
    { id: 'fam_demo', accessCode: 'CMC2025', studentName: 'Guest Investor', allocations: [] }
  ];
};
