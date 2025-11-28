
import { Project, Division, Family } from '../types';

const RAW_DATA = [
  // Grade 10A
  { grade: "10A", title: "How might we build a digital platform for women traveling alone?", team: ["Joaquim X.", "Mariana P.", "Nina M.", "Valerie C."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "Mini-documentary about challenges and solutions of women travelling by themselves." },
  { grade: "10A", title: "How might we encourage healthier and more sustainable food choices?", team: ["Cecília C."], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Nutrition", type: "Service", mdp: "Communicating the benefits of eating fish in fun, clear, and engaging ways." },
  { grade: "10A", title: "How might we create a kinetic floor tile that generates electricity?", team: ["Marco C.", "Miguel V.", "Vinicius A."], theme: "Technology, Engineering & AI", area: "Science / Engineering", type: "Product", mdp: "A tile that generates energy." },
  { grade: "10A", title: "How might we create a Roblox game that teaches recycling?", team: ["Augusto T.", "Dante B.", "Giorgio B.", "Guilherme M.", "Heitor D.", "Leo T."], theme: "Sustainability & Environment", area: "Technology / Education", type: "Product", mdp: "The initial phase of a Roblox game focusing on sustainability." },
  
  // Grade 10B
  { grade: "10B", title: "How might we design a sustainable basketball hoop system?", team: [], theme: "Social Impact & Community Engagement", area: "Technology / Education", type: "Product", mdp: "EcoHoop double hoop game structure." },
  { grade: "10B", title: "How might we design a fragrance line for people with sensitivities?", team: ["Antonia S.", "Kyara K.", "Maya C.", "Valentina V."], theme: "Health, Well-being & Nutrition", area: "Technology / Design", type: "Product", mdp: "A collection of perfume with hypoallergic/natural ingredients." },
  { grade: "10B", title: "How might we promote e-sports culture at Concept?", team: ["Lucas R.", "Pedro L.", "Vitor F."], theme: "Social Impact & Community Engagement", area: "Health & Well-being / Sports Education", type: "Service", mdp: "An e-sports program/event at school." },
  { grade: "10B", title: "How might we create a hub on overconsumption, psychology, and beauty?", team: ["Eeva P.", "Sofia V.", "Anna B."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "A printed magazine focused on overconsumption." },
  
  // Grade 10C
  { grade: "10C", title: "How might we create a wedding dress that feels timeless and romantic?", team: ["Ana Luisa C.", "Gabriela B.", "Helena M.", "Letícia C.", "Melissa C."], theme: "Arts, Culture & Expression", area: "Sustainability / Arts & Design", type: "Product", mdp: "A wedding dress study (moulage)." },
  { grade: "10C", title: "How can a sports workshop build skills and emotional agility?", team: [], theme: "Social Impact & Community Engagement", area: "Health & Well-being / Sports Education", type: "Service", mdp: "Sports-based 3-day workshops that build emotional agility and social well-being." },
  { grade: "10C", title: "How might we better inform people about how sports help with stress?", team: ["Artur C.", "Breno F.", "Fernando F.", "Gustavo I."], theme: "Social Impact & Community Engagement", area: "Health & Well-being / Psychology", type: "Product", mdp: "A 4-episode Podcast Show about sports and physical education." },
  { grade: "10C", title: "How might we design a space for overwhelmed learners to relax?", team: ["Lorenzo B.", "Michel E.", "Theodoro L."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "A calm down corner to support adolescents' self-regulation." },
  
  // Grade 6A
  { grade: "6A", title: "How might we spread a message of peace in stadiums?", team: ["Felipe S.", "Lorenzo C.", "Pedro L.", "Rafael C."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "A website with content promoting peace in soccer fields, including a video with Kaka." },
  { grade: "6A", title: "How might we show gratitude to educators with personalized embroidery?", team: ["Catarina S.", "Eduardo D.", "Elisa G.", "Helena F.", "Tereza C."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Service", mdp: "Personalized embroidered clothing and cards for G6 educators." },
  { grade: "6A", title: "How might we make sports in Concept more visible?", team: ["Victor S.", "Nicholas M.", "Matheus A.", "Filippo V.", "Gabriel B."], theme: "Social Impact & Community Engagement", area: "Social Sciences / Community Service", type: "Product", mdp: "1st edition of the School Sports Newsletter. 12 pages, 400 copies." },
  { grade: "6A", title: "How might we help animal shelters with editable materials?", team: ["Chloe C.", "Helena C.", "Laura S.", "Laura T.", "Olivia P.", "Tomás B."], theme: "Social Impact & Community Engagement", area: "Sustainability / Engineering", type: "Product", mdp: "A Canva digital toolkit for animal shelters to engage adoption." },
  { grade: "6A", title: "How might we bring comfort and joy to people in nursing homes?", team: ["Camilla F.", "Maria Eduarda M.", "Valentina G."], theme: "Social Impact & Community Engagement", area: "Social Sciences / Community Service", type: "Product", mdp: "A box of senior care toys." },
  
  // Grade 6B
  { grade: "6B", title: "How might we generate renewable energy using high water flow?", team: ["Benjamin P.", "Bernardo B.", "Frederico Z.", "Theo F."], theme: "Sustainability & Environment", area: "Science / Engineering", type: "Product", mdp: "A plug'n play turbine that can be connected to different pipes." },
  { grade: "6B", title: "How can we raise awareness about beach conservation?", team: ["Aylla S.", "Joaquim M.", "Luisa D.", "Rafael B.", "Valentina S."], theme: "Sustainability & Environment", area: "Technology / Education", type: "Product", mdp: "A children's book with activities focused on beach conservation." },
  { grade: "6B", title: "How might we create a cohesive embroidered fashion collection?", team: ["Hortenncia C.", "Manoela M.", "Sofia D.", "Sofia F.", "Teresa C."], theme: "Sustainability & Environment", area: "Technology / Education", type: "Product", mdp: "A collection of embroidered cellphone cases." },
  { grade: "6B", title: "How might we design a pet-care calendar with Instituto Ampara?", team: ["Alice Q.", "Catharina L.", "Luiz B.", "Olivia S.", "Teresa P."], theme: "Social Impact & Community Engagement", area: "Technology / Education", type: "Product", mdp: "Furever Pet Caring Calendar & an Ampara Animal Adoption Fair." },
  { grade: "6B", title: "How might we help people identify AI-generated images?", team: ["Francisco V.", "Frederico C.", "Max W.", "Pedro S."], theme: "Technology, Engineering & AI", area: "Technology / Education", type: "Product", mdp: "Guessing card game to identify real dogs vs AI generated images." },
  
  // Grade 6C
  { grade: "6C", title: "How might we design an inclusive skate and art event?", team: ["Ana Beatriz V.", "Antonio C.", "Guilherme S.", "Theodoro C."], theme: "Arts, Culture & Expression", area: "Health & Well-being / Sports Education", type: "Service", mdp: "A workshop combining skate and art to customize skateboard shapes." },
  { grade: "6C", title: "How might we design a mindful coloring book for learners?", team: ["Ana N.", "Beatriz A.", "Manuela D.", "Rocco R."], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Psychology", type: "Product", mdp: "Concept Friends coloring book (Bobbie-Goods-inspired)." },
  { grade: "6C", title: "How might we support elders to feel more included?", team: ["Antonio F.", "Helena N.", "Lorena G.", "Setella S."], theme: "Social Impact & Community Engagement", area: "Social Sciences / Community Service", type: "Service", mdp: "PenPal service for elderly people and a club." },
  { grade: "6C", title: "How can we create an eco-friendly shampoo with natural oils?", team: ["Filipa N.", "Júlia Z.", "Luana A.", "Sarah G."], theme: "Sustainability & Environment", area: "Technology / Education", type: "Product", mdp: "A collection of sustainable and eco-friendly shampoos." },
  { grade: "6C", title: "How might we convert battery-powered toys to solar energy?", team: ["Eduardo P.", "Felipe D.", "Lorenzo T.", "Luis Felipe S.", "Nicholas K.", "Tales B."], theme: "Sustainability & Environment", area: "Science / Engineering", type: "Product", mdp: "A remote control toy car powered by solar power." },
  
  // Grade 7A
  { grade: "7A", title: "How might we create short-form video parodies of favorite movies?", team: ["Arthur T.", "Pedro V.", "Raul T."], theme: "Arts, Culture & Expression", area: "Technology / Design", type: "Product", mdp: "The pilot of a TV Show parody of Star Wars (5 min)." },
  { grade: "7A", title: "How might we raise awareness of dreams shaping our future?", team: [], theme: "Technology, Engineering & AI", area: "Technology / Education", type: "Product", mdp: "An animation based on learner's drawings and AI tools exploring Kids Can Dream." },
  { grade: "7A", title: "How might we help our community understand emotions better?", team: ["Gabriela M.", "Heloisa C.", "Maria Eduarda P.", "Maria T."], theme: "Health, Well-being & Nutrition", area: "Technology / Education", type: "Service", mdp: "4 activities on self awareness, mental and physical health." },
  { grade: "7A", title: "How might we design a nutritious and delicious protein bar?", team: ["Bernardo G.", "Betania C.", "Enzo M.", "João B.", "Leonardo R.", "Pietra C."], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Nutrition", type: "Product", mdp: "A protein bar with better taste." },
  { grade: "7A", title: "How can we use humor in the kitchen to bring joy?", team: ["Louise C.", "Chloe R.", "João L.", "Alexandre D.", "Marina E."], theme: "Arts, Culture & Expression", area: "Technology / Design", type: "Product", mdp: "A YouTube channel with two episodes." },
  
  // Grade 7B
  { grade: "7B", title: "How might we convert a VW Fusca to electric?", team: ["Davi M.", "Frederico Z.", "João F.", "Luca L.", "Nicholas W."], theme: "Sustainability & Environment", area: "Science / Engineering", type: "Product", mdp: "An interactive manual explaining how to convert a vehicle to electric." },
  { grade: "7B", title: "How does music spark creativity and strengthen community?", team: [], theme: "Arts, Culture & Expression", area: "Social Sciences / Community Service", type: "Product", mdp: "A playlist of music based on learner's poetry, music and art." },
  { grade: "7B", title: "How might we transform discarded materials into sustainable fashion?", team: ["Bianca A.", "Isabella L.", "Rafaela A."], theme: "Sustainability & Environment", area: "Technology / Design", type: "Product", mdp: "A collection of accessories made from paper cups." },
  { grade: "7B", title: "How might we design a healthier version of a hamburger?", team: ["Bruno P.", "Frederico B.", "Leonardo B.", "Lucca P."], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Nutrition", type: "Product", mdp: "A healthier hamburger." },
  { grade: "7B", title: "How can we encourage younger students to be respectful and inclusive?", team: ["Ana Beatriz S.", "Lorena F.", "Manuela B.", "Gabrielle P."], theme: "Social Impact & Community Engagement", area: "Health & Well-being / Sports Education", type: "Product", mdp: "A trailer of a children's play on inclusion and respect." },
  
  // Grade 7C
  { grade: "7C", title: "How can color and creativity help younger students eat healthy?", team: ["Antonia V.", "Antonio D.", "Bernardo C.", "Elle G.", "Joana P.", "Julia P."], theme: "Health, Well-being & Nutrition", area: "Technology / Design", type: "Product", mdp: "A website with a toolkit for 'healthy eating challenge'." },
  { grade: "7C", title: "How might we create a joyful book-sharing experience?", team: ["Ana F.", "Bruno L.", "Henrique B.", "Leo T.", "Stella S."], theme: "Arts, Culture & Expression", area: "Communication / Media Literacy", type: "Product", mdp: "An interactive book shelf to promote book exchange." },
  { grade: "7C", title: "How might we co-create a school Learning Garden?", team: [], theme: "Sustainability & Environment", area: "Sustainability / Environmental Science", type: "Product", mdp: "A learning garden to grow and take care of plants (co-created w/K3)." },
  { grade: "7C", title: "How might we make nutrition fun through playful learning?", team: ["Bernardo G.", "Felipe B.", "Leonardo M.", "Lucas M.", "Pedro B."], theme: "Health, Well-being & Nutrition", area: "Technology / Design", type: "Product", mdp: "A board game about healthy eating habits and recipe sharing." },
  
  // Grade 8A
  { grade: "8A", title: "How can a sustainable fashion event support eco-friendly growth?", team: ["Fernanda S.", "Giovanna B.", "João Guilherme F.", "Sophia C."], theme: "Sustainability & Environment", area: "Technology / Education", type: "Service", mdp: "A platform to organize eco-fashion events (partnership with Oportunidade do Bem)." },
  { grade: "8A", title: "How can a fashion event raise awareness for a social cause?", team: [], theme: "Technology, Engineering & AI", area: "Technology / Education", type: "Service", mdp: "An experience that connects fashion and social topics." },
  { grade: "8A", title: "How can we help girls play more sports?", team: ["Catharina L."], theme: "Social Impact & Community Engagement", area: "Health & Well-being / Sports Education", type: "Service", mdp: "Volleyball 4 Girls program." },
  { grade: "8A", title: "How might we create thermos bottles that heat and chill?", team: ["Enzo R.", "Luigi A.", "Martin A.", "Paulo S.", "Camilo S."], theme: "Arts, Culture & Expression", area: "Sustainability / Arts & Design", type: "Product", mdp: "A thermos bottle that heats and chills liquids." },
  { grade: "8A", title: "How can we develop student leaders who inspire others?", team: ["Antonio N.", "Augusto B.", "Davi P.", "Guilherme G.", "Henrique D."], theme: "Social Impact & Community Engagement", area: "Technology / Education", type: "Product", mdp: "A website with workshop options, instructor profiles and sign up form." },
  
  // Grade 8B
  { grade: "8B", title: "How can we improve focus and time management for learners?", team: ["Alexandre M.", "Enzo M.", "Nicola G."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Service", mdp: "A website for the mentorship program." },
  { grade: "8B", title: "How can we create visibility for young fashion designers?", team: ["Beatriz Q.", "Beatriz S.", "Emanuelle C.", "Marcos C.", "Sofia M."], theme: "Arts, Culture & Expression", area: "Sustainability / Arts & Design", type: "Product", mdp: "A Magazine to promote New Fashion Designers." },
  { grade: "8B", title: "How might we inspire children to read for pleasure?", team: ["Ana Luiza S.", "Elisa G.", "Francisco A.", "Guilhermina Q.", "Luna T.", "Maria Helena E."], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Psychology", type: "Service", mdp: "A family book club called mysterious box." },
  { grade: "8B", title: "How might we help swimmers with jellyfish stings?", team: ["Antonio B.", "Antonio R.", "Bernardo Z.", "Pedro M.", "Peter B.", "Samuel T."], theme: "Health, Well-being & Nutrition", area: "Technology / Design", type: "Product", mdp: "A product to treat jellyfish stings made of natural ingredients." },
  
  // Grade 8C
  { grade: "8C", title: "How can we promote circularity in fashion using technology?", team: ["Gabriela S.", "Rafaella R."], theme: "Sustainability & Environment", area: "Sustainability / Arts & Design", type: "Product", mdp: "An app to promote fashion circularity and outfit combinations." },
  { grade: "8C", title: "How can we connect students with service learning opportunities?", team: [], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "An app to connect NGOs with volunteers." },
  { grade: "8C", title: "How might we make sports more sustainable?", team: ["João Pedro V.", "Luca P."], theme: "Sustainability & Environment", area: "Technology / Education", type: "Service", mdp: "A Marketplace to sell or rent luxury sport equipment." },
  { grade: "8C", title: "How can we build a magazine to integrate the school community?", team: [], theme: "Social Impact & Community Engagement", area: "Communication / Media Literacy", type: "Product", mdp: "A lifestyle teen magazine with interviews, articles and tips." },
  { grade: "8C", title: "How might we develop skills for young people joining the job market?", team: ["Carolina F.", "Olivia L.", "Rafaella B.", "Rafaella Z."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "A learning platform focused on getting their first job." },
  { grade: "8C", title: "How might we teach first aid and life-saving skills?", team: ["Guilherme M.", "Theo D."], theme: "Social Impact & Community Engagement", area: "Technology / Education", type: "Service", mdp: "A 2-year first-aid and Heimlich maneuver certification." },
  { grade: "8C", title: "How can kids develop smart money habits with allowances?", team: ["Ana Teresa Z.", "Arthur S.", "Enrico C.", "Pedro D."], theme: "Arts, Culture & Expression", area: "Technology / Design", type: "Product", mdp: "A board game focused on allowance management." },
  
  // Grade 9A
  { grade: "9A", title: "How might we design a hydrogen-powered RC car?", team: ["Cicero S.", "Eduardo G.", "Gustavo D.", "Matteo E.", "Thomas M."], theme: "Sustainability & Environment", area: "Science / Engineering", type: "Product", mdp: "A hydrogen motor in a remote control car." },
  { grade: "9A", title: "How might we use handcrafting to advance sustainable fashion?", team: [], theme: "Sustainability & Environment", area: "Health & Well-being / Psychology", type: "Product", mdp: "A sustainable dress with eye embroideries highlighting handcrafting." },
  { grade: "9A", title: "How might we create a gamified app to teach Physics?", team: ["Bernardo N.", "Davi D.", "Felipe S."], theme: "Technology, Engineering & AI", area: "Technology / Education", type: "Product", mdp: "A gamified platform to teach Physics inspired by Duolingo." },
  { grade: "9A", title: "How might we encourage students to move more and be active?", team: ["Guilherme B.", "João C.", "Miguel O."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Service", mdp: "A gamified system that makes being active genuinely fun." },
  { grade: "9A", title: "How might we help animals in shelters awaiting adoption?", team: ["Manuella G.", "Melissa A.", "Nicole F.", "Stella H."], theme: "Social Impact & Community Engagement", area: "Technology / Education", type: "Product", mdp: "A dog cookie with different tags for dogs waiting to be adopted." },
  
  // Grade 9B
  { grade: "9B", title: "How might we design games to encourage healthy eating?", team: [], theme: "Health, Well-being & Nutrition", area: "Technology / Design", type: "Product", mdp: "A board game and card game about nutrition facts and healthy eating." },
  { grade: "9B", title: "How might we design modular tennis shoes for different courts?", team: ["Collin S.", "Felipe V.", "Felippo G.", "João F."], theme: "Technology, Engineering & AI", area: "Health & Well-being / Sports Education", type: "Product", mdp: "A prototype of sport shoes with multiple outsoles (AI)." },
  { grade: "9B", title: "How might we create affordable vegan protein bars?", team: ["Gustavo K.", "João Luca A.", "Lucas C.", "Luisa B.", "Mariana A."], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Nutrition", type: "Product", mdp: "A vegan protein bar." },
  { grade: "9B", title: "How can we use sports to celebrate teamwork at Concept?", team: ["Elena V.", "Isabela C.", "Lorenzo I.", "Pedro M.", "Vitor P."], theme: "Social Impact & Community Engagement", area: "Health & Well-being / Sports Education", type: "Service", mdp: "Mini tournament with different modalities in the last week of school." },
  
  // Grade 9C
  { grade: "9C", title: "How might we create an AI tutor for LS math students?", team: [], theme: "Technology, Engineering & AI", area: "Technology / Education", type: "Service", mdp: "A math-tutor chatbot called Chat Mate for lower school learners." },
  { grade: "9C", title: "How might we help people understand Brazil's diverse biomes?", team: ["Everaldo T.", "João S."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Service", mdp: "Rally through the Brazilian Biomes." },
  { grade: "9C", title: "How can we help teen volunteers interact with elderly with Alzheimer's?", team: [], theme: "Health, Well-being & Nutrition", area: "Health & Well-being / Psychology", type: "Product", mdp: "Moments that Matter talking cards and Visitor Manual for Elderly Club." },
  { grade: "9C", title: "How might we address fidgeting needs for neurodivergent students?", team: ["Antonio G.", "Cecília L.", "Leonardo M.", "Maria Cecília V.", "Rafael P."], theme: "Social Impact & Community Engagement", area: "Technology / Design", type: "Product", mdp: "An education kit with pencil case and fidgeting toys." },
  { grade: "9C", title: "How might we empower students to express identity through fashion?", team: ["Isadora L.", "Luisa F.", "Luisa N."], theme: "Sustainability & Environment", area: "Science / Engineering", type: "Product", mdp: "A collection of charms to personalize your purse." },
  { grade: "9C", title: "How might we develop sustainable food packaging?", team: ["André B.", "Andre L.", "Natália M.", "Manuela Y."], theme: "Sustainability & Environment", area: "Health & Well-being / Nutrition", type: "Product", mdp: "A box with a brigadeiro that turns into a decorative Christmas tree." },
];

// Get a themed image seed based on project content
const getThemedSeed = (title: string, theme: string, index: number): number => {
  const lowerTitle = title.toLowerCase();
  const lowerTheme = theme.toLowerCase();
  
  if (lowerTitle.includes('energy') || lowerTitle.includes('solar') || lowerTitle.includes('recycl') || lowerTitle.includes('sustainab') || lowerTitle.includes('hydrogen')) {
    return 100 + index;
  }
  if (lowerTitle.includes('game') || lowerTitle.includes('roblox') || lowerTitle.includes('app') || lowerTitle.includes('ai') || lowerTitle.includes('digital') || lowerTitle.includes('tutor')) {
    return 200 + index;
  }
  if (lowerTitle.includes('food') || lowerTitle.includes('eating') || lowerTitle.includes('protein') || lowerTitle.includes('nutrition') || lowerTitle.includes('hamburger') || lowerTitle.includes('vegan')) {
    return 300 + index;
  }
  if (lowerTitle.includes('fashion') || lowerTitle.includes('clothes') || lowerTitle.includes('design') || lowerTitle.includes('cosmetic') || lowerTitle.includes('fragrance') || lowerTitle.includes('dress')) {
    return 400 + index;
  }
  if (lowerTitle.includes('sport') || lowerTitle.includes('basketball') || lowerTitle.includes('volleyball') || lowerTitle.includes('exercise') || lowerTitle.includes('fitness') || lowerTitle.includes('tennis')) {
    return 500 + index;
  }
  if (lowerTitle.includes('animal') || lowerTitle.includes('pet') || lowerTitle.includes('dog') || lowerTitle.includes('shelter') || lowerTitle.includes('adoption')) {
    return 600 + index;
  }
  if (lowerTitle.includes('community') || lowerTitle.includes('elderly') || lowerTitle.includes('nursing') || lowerTitle.includes('volunteer') || lowerTitle.includes('leader')) {
    return 700 + index;
  }
  if (lowerTitle.includes('music') || lowerTitle.includes('art') || lowerTitle.includes('movie') || lowerTitle.includes('reading') || lowerTitle.includes('book') || lowerTitle.includes('video')) {
    return 800 + index;
  }
  if (lowerTitle.includes('health') || lowerTitle.includes('medical') || lowerTitle.includes('mental') || lowerTitle.includes('stress') || lowerTitle.includes('relax')) {
    return 900 + index;
  }
  
  if (lowerTheme.includes('sustainability')) return 150 + index;
  if (lowerTheme.includes('technology')) return 250 + index;
  if (lowerTheme.includes('health')) return 350 + index;
  if (lowerTheme.includes('social')) return 450 + index;
  if (lowerTheme.includes('arts')) return 550 + index;
  
  return 1000 + index;
};

export const seedProjects = (): Project[] => {
  return RAW_DATA.map((item, index) => {
    const gradeNum = parseInt(item.grade.replace(/\D/g, ''));
    const division = gradeNum >= 9 ? Division.HIGH_SCHOOL : Division.MIDDLE_SCHOOL;
    
    const baseSeed = getThemedSeed(item.title, item.theme, index);
    const imageUrl = `https://picsum.photos/seed/${baseSeed}/800/600`;

    return {
      id: `proj_${index + 1}`,
      title: item.title,
      division: division,
      grade: item.grade,
      mentor: '',
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
