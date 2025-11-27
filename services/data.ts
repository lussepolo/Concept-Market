
import { Project, Division, Family } from '../types';

const RAW_DATA = [
  { grade: "10B", title: "How can we design a sustainable basketball hoop system?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "A basketball game that integrates sustainability concepts." },
  { grade: "6B", title: "How might we generate renewable energy in cities using high water flow?", mentor: "Marcio Fernandes", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A plug'n play turbine that can be connected to different pipes and work as a complementary to solar panel system" },
  { grade: "6B", title: "How can we raise awareness about the importance of beach conservation?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "A pop-up book with activities focused on raising awareness about beach conservation." },
  { grade: "7B", title: "How can car engines be changed to use clean energy (solar/agricultural fuels)?", mentor: "Regina Barbosa", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A interactive manual explaining how to convert a vehicle with a regular motor to an electric motor." },
  { grade: "7C", title: "How can color and creativity help younger students build healthy eating habits?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A creative kit or guide to encourage healthy eating habits through art." },
  { grade: "8B", title: "How can we improve focus, organization, and time management for learners?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Executive skill training, website, workshop, or mentorship program." },
  { grade: "9B", title: "How can we design interactive experiences to encourage healthy eating?", mentor: "Karin Gunn", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A board/digital game to help people read and understand food labels" },
  { grade: "9B", title: "How can we prototype sports shoes for multiple sports demands?", mentor: "Regina Barbosa", area: "Health & Well-being / Sports Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A prototype of the sport shoes with multiple outsoles (AI)" },
  { grade: "9C", title: "How can we integrate AI with human tutors to support LS students in math?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Service", mdp: "A math tutor using a mix of AI and real people" },
  { grade: "9C", title: "How can we understand the brazilian territory and biomes through Rally dos Sertões?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Rally through the Brazilian Biomes experience." },
  { grade: "10A", title: "How can we raise awareness of seafood origins to encourage informed choices?", mentor: "Maira Gouveia", area: "Health & Well-being / Nutrition", theme: "Technology, Engineering & AI", type: "Product", mdp: "A labeling system or app for seafood consumer information." },
  { grade: "10A", title: "How might we create a kinetic floor tile that generates electricity?", mentor: "Marcio Fernandes", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A tile that generates energy from foot traffic." },
  { grade: "10A", title: "How can women travel safely alone?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "Mini-documentary about challenges and solutions of women travelling by themselves." },
  { grade: "10A", title: "How might we create a Roblox game that teaches recycling?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "The initial phases of a Roblox game focuses on sustainability." },
  { grade: "10B", title: "How might we promote e-sports culture at Concept?", mentor: "Marcio Fernandes", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "An e-sports program/event at school" },
  { grade: "10B", title: "How can we make cosmetics using natural ingredients?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A collection of perfumes with hypoallergenic/natural ingredients" },
  { grade: "10B", title: "How might we create an online hub on overconsumption, psychology, and beauty?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A printed magazine focused on overconsumption" },
  { grade: "10C", title: "How can we design a sports workshop that builds skills and opportunities?", mentor: "Karin Gunn", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Workshop to deal with frustration in sports." },
  { grade: "10C", title: "How can we design long-lasting fashion products?", mentor: "Regina Barbosa", area: "Sustainability / Arts & Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A wedding dress study (moulage)" },
  { grade: "10C", title: "How might we better inform people about how sports and exercise help with stress?", mentor: "Marcio Fernandes", area: "Health & Well-being / Psychology", theme: "Social Impact & Community Engagement", type: "Service", mdp: "The pilot of a Podcast Show about sports and physical education" },
  { grade: "10C", title: "How might we design a space that helps overwhelmed learners at Concept relax?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A calm down corner to support adolescents self-regulation" },
  { grade: "6A", title: "How can we design personalized kindness patches to show gratitude to our educators?", mentor: "Karin Gunn", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Kindness through clothe personalization (embroidery)" },
  { grade: "6A", title: "How can we share information about athletic activities and events at Concept?", mentor: "Maira Gouveia", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Product", mdp: "1st edition of the School Sports Newsletter. 12 pages, 400 copies." },
  { grade: "6A", title: "How might we help animal shelters in Brazil with editable materials?", mentor: "Marcio Fernandes", area: "Sustainability / Engineering", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A Canva digital toolkit that can be customized by animal shelters to engage adoption" },
  { grade: "6A", title: "How can football culture be shaped to promote peace and mutual respect?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A website with content promoting peace in soccer fields." },
  { grade: "6A", title: "How might we bring comfort, connection, and joy to people in nursing homes?", mentor: "Tainah Michida", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A box of senior care toys." },
  { grade: "6B", title: "How can we design an animal adoption campaign in collaboration with Instituto Ampara?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "An animal caring calendar (possible animal adoption fair)" },
  { grade: "6B", title: "How can we use AI to create campaigns that support animal causes?", mentor: "Maira Gouveia", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "Guessing card game to identify real dogs vs AI generated images." },
  { grade: "6B", title: "In what ways can embroidery be used to repurpose clothes into sustainable fashion?", mentor: "Regina Barbosa", area: "Technology / Education", theme: "Sustainability & Environment", type: "Product", mdp: "A collection of embroidered cellphone cases." },
  { grade: "6C", title: "How might we create mindful experiences for MS learners to reset?", mentor: "Karin Gunn", area: "Health & Well-being / Psychology", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A Concept Friends book (Bobbie-Goods-inspired)" },
  { grade: "6C", title: "How can we encourage younger generations to engage with community members?", mentor: "Maira Gouveia", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Service", mdp: "PenPal service for elderly people and a club" },
  { grade: "6C", title: "How can fruit-based ingredients be used to make natural hair care products?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A collection of fruit-based shampoos." },
  { grade: "6C", title: "How might we convert battery-powered toys to work on solar energy?", mentor: "Marcio Fernandes", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A solar-energy toy car" },
  { grade: "6C", title: "How can we design an event at school, combining sports and arts?", mentor: "Regina Barbosa", area: "Health & Well-being / Sports Education", theme: "Arts, Culture & Expression", type: "Service", mdp: "A workshop to bring together skate and art/design and customize the shape of a skate." },
  { grade: "7A", title: "How might we raise awareness of how individual dreams shape our future?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "An animation based on learner's drawings and AI tools." },
  { grade: "7A", title: "How might we help raise awareness about relationships and emotions?", mentor: "Maira Gouveia", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Service", mdp: "Activities on self awareness, mental and physical health" },
  { grade: "7A", title: "How might we design a protein bar that is both nutritious and delicious?", mentor: "Marcio Fernandes", area: "Health & Well-being / Nutrition", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A protein bar, with a better taste." },
  { grade: "7A", title: "How can we pay homage to a favorite movie series through humor?", mentor: "Regina Barbosa", area: "Technology / Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "The pilot of a TV Show of a parody of Star Wars (5 min)" },
  { grade: "7A", title: "How can we use humor in the kitchen to bring joy to others?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A pilot of a Webseries focused on cooking and having fun." },
  { grade: "7B", title: "How does music spark creativity and strengthen community?", mentor: "Karin Gunn", area: "Social Sciences / Community Service", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A playlist of musics based on learner's poetry" },
  { grade: "7B", title: "How can we use wasted cups from the school to create clothes and accessories?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A collection of accessories made by paper cups" },
  { grade: "7B", title: "How might we design a healthier version of a hamburger?", mentor: "Marcio Fernandes", area: "Health & Well-being / Nutrition", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A healthier hamburger." },
  { grade: "7B", title: "How can we encourage younger students to create a respectful sports environment?", mentor: "Tainah Michida", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A theatrical performance to inspire belonging and equity." },
  { grade: "7C", title: "How can we co-create a school learning garden with younger learners?", mentor: "Karin Gunn", area: "Sustainability / Environmental Science", theme: "Sustainability & Environment", type: "Product", mdp: "A learning garden (co-created w/ PK3)" },
  { grade: "7C", title: "How might we create a board game to promote health eating habits?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A board game that stimulates healthy eating habits and recipe sharing." },
  { grade: "7C", title: "How can reading support children’s emotional development?", mentor: "Regina Barbosa", area: "Communication / Media Literacy", theme: "Arts, Culture & Expression", type: "Product", mdp: "An interactive book shelf to promote a book exchange" },
  { grade: "8A", title: "How can a fashion event raise awareness for a social cause?", mentor: "Karin Gunn", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Service", mdp: "An experience that connects fashion and social topics" },
  { grade: "8A", title: "Volleyball 4 Girls / How can we help girls play more sports?", mentor: "Maira Gouveia", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "A collection of jersey and team uniforms for events" },
  { grade: "8A", title: "How might we create and market thermos bottles that heat and chill?", mentor: "Marcio Fernandes", area: "Sustainability / Arts & Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A thermos bottle that heats and chills." },
  { grade: "8A", title: "How can a sustainable fashion event support eco-friendly community growth?", mentor: "Regina Barbosa", area: "Technology / Education", theme: "Sustainability & Environment", type: "Service", mdp: "A platform to organize and promote eco-fashion events." },
  { grade: "8A", title: "How can we develop student leaders who inspire and train others to lead?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A website with the workshop options, instructor profiles and sign up form." },
  { grade: "8B", title: "How does daily reading for pleasure impact teens’ well-being?", mentor: "Maira Gouveia", area: "Health & Well-being / Psychology", theme: "Health, Well-being & Nutrition", type: "Service", mdp: "A family book club called mysterious box." },
  { grade: "8B", title: "How might we design an ointment for jellyfish stings?", mentor: "Marcio Fernandes", area: "Technology / Design", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "An ointment for jellyfish stings" },
  { grade: "8B", title: "How can we create visibility for young fashion designers?", mentor: "Regina Barbosa", area: "Sustainability / Arts & Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A Magazine to promote New Fashion Designers" },
  { grade: "8C", title: "How can we design a business that connects students with service learning?", mentor: "Karin Gunn", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "An app to connect NGO with volunteers." },
  { grade: "8C", title: "How can we be a sustainable agency for a school sustainable fair?", mentor: "Maira Gouveia", area: "Technology / Education", theme: "Sustainability & Environment", type: "Service", mdp: "A Marketplace to sell or rent luxury sport equipments." },
  { grade: "8C", title: "How can we build a magazine that helps us to better integrate the school?", mentor: "Maira Gouveia", area: "Communication / Media Literacy", theme: "Social Impact & Community Engagement", type: "Product", mdp: "A lifestyle teen magazine with interviews, articles and tips" },
  { grade: "8C", title: "How might we develop essential skills for young people joining the job market?", mentor: "Marcio Fernandes", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Service", mdp: "A learning platform focused on getting their first job." },
  { grade: "8C", title: "How might we build a business that teaches first aid and life-saving skills?", mentor: "Marcio Fernandes", area: "Technology / Education", theme: "Health, Well-being & Nutrition", type: "Service", mdp: "A 2-year first-aid and heimlich maneuver certification for learners" },
  { grade: "8C", title: "How can kids develop smart money habits with allowances?", mentor: "Tainah Michida", area: "Technology / Design", theme: "Arts, Culture & Expression", type: "Product", mdp: "A board game focused on allowance management" },
  { grade: "8C", title: "How can we promote circularity in fashion using technology?", mentor: "Regina Barbosa", area: "Sustainability / Arts & Design", theme: "Sustainability & Environment", type: "Product", mdp: "An app to promote fashion circularity helping people combine outfits." },
  { grade: "9A", title: "How can handcrafting support sustainable fashion and teen mental well-being?", mentor: "Karin Gunn", area: "Health & Well-being / Psychology", theme: "Sustainability & Environment", type: "Product", mdp: "A sustainable piece of cloth that reflects on sustainable fashion" },
  { grade: "9A", title: "How might we create a gamified app to teach Physics?", mentor: "Marcio Fernandes", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A Duolingo that teaches Physics" },
  { grade: "9A", title: "How can we promote the practice of exercises in school campus?", mentor: "Maira Gouveia", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "Structured reports and promotion campaigns." },
  { grade: "9A", title: "How can we use hydrogen as alternative fuel?", mentor: "Regina Barbosa", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A hydrogen motor in a remote control car" },
  { grade: "9A", title: "How might we help animals in shelters awaiting adoption?", mentor: "Tainah Michida", area: "Technology / Education", theme: "Technology, Engineering & AI", type: "Product", mdp: "A dog cookie with different tags for dogs waiting to be adopted" },
  { grade: "9B", title: "How might we create affordable vegan biscuits/bars for protein intake?", mentor: "Marcio Fernandes", area: "Health & Well-being / Nutrition", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "A vegan protein bar" },
  { grade: "9B", title: "How can we use sports to celebrate teamwork and friendship at Concept?", mentor: "Tainah Michida", area: "Health & Well-being / Sports Education", theme: "Social Impact & Community Engagement", type: "Service", mdp: "Mini tournament with different modalities to happen in the last week of school" },
  { grade: "9C", title: "How can we support well-being of elderly with Alzheimer’s?", mentor: "Karin Gunn", area: "Health & Well-being / Psychology", theme: "Health, Well-being & Nutrition", type: "Product", mdp: "Card game to support conversation and reflection for elderly with Alzheimer’s" },
  { grade: "9C", title: "How might we address fidgeting needs for neurodivergent students?", mentor: "Marcio Fernandes", area: "Technology / Design", theme: "Social Impact & Community Engagement", type: "Product", mdp: "An education kit with pencil case with pencils and fidgeting toys" },
  { grade: "9C", title: "How can we design a sustainable collection of accessories using textile residue?", mentor: "Regina Barbosa", area: "Science / Engineering", theme: "Sustainability & Environment", type: "Product", mdp: "A collection of charms to personalize your purse and a toolkit to create your own charm." },
  { grade: "9C", title: "How might we develop sustainable food packaging options?", mentor: "Tainah Michida", area: "Health & Well-being / Nutrition", theme: "Sustainability & Environment", type: "Product", mdp: "A box with a brigadeiro that turns into a decorative christmas tree" },
];

// Generates the set of projects from the dataset
export const seedProjects = (): Project[] => {
  return RAW_DATA.map((item, index) => {
    // Infer division from Grade (6-8 MS, 9-10 HS)
    const gradeNum = parseInt(item.grade.replace(/\D/g, ''));
    const division = gradeNum >= 9 ? Division.HIGH_SCHOOL : Division.MIDDLE_SCHOOL;
    
    // Generate consistent team names since they were not available in the provided text view
    const teamSize = 2 + (index % 2); // 2 or 3 students
    const team = Array.from({ length: teamSize }, (_, i) => `Student ${String.fromCharCode(65 + i)}${index + 1}`);

    return {
      id: `proj_${index + 1}`,
      title: item.title,
      division: division,
      mentor: item.mentor,
      primaryArea: item.area,
      theme: item.theme,
      outputType: item.type,
      mdp: item.mdp,
      team: team, 
      imageUrl: `https://picsum.photos/seed/${index + 150}/800/600`, // Deterministic seed for images
      totalHoursInvested: 0, // Reset to 0 for fairness
      investorCount: 0
    };
  });
};

export const seedFamilies = (): Family[] => {
  return [
    { id: 'fam_demo', accessCode: 'CMC2025', studentName: 'Guest Investor', allocations: [] },
    { id: 'fam_1', accessCode: 'FAM123', studentName: 'Smith Family', allocations: [] },
    { id: 'fam_2', accessCode: 'FAM456', studentName: 'Garcia Family', allocations: [] },
    { id: 'fam_3', accessCode: 'FAM789', studentName: 'Chang Family', allocations: [] },
    { id: 'fam_4', accessCode: 'FAM321', studentName: 'Silva Family', allocations: [] },
    { id: 'fam_5', accessCode: 'FAM654', studentName: 'Patel Family', allocations: [] }
  ];
};
