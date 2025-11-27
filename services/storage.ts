import { Project, Allocation, Family } from '../types';
import { seedProjects, seedFamilies } from './data';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  onSnapshot, 
  updateDoc,
  increment,
  writeBatch,
  query,
  where
} from 'firebase/firestore';

const STORAGE_KEY_PROJECTS = 'concept_market_projects';
const STORAGE_KEY_FAMILIES = 'concept_market_families';
const STORAGE_KEY_SESSION = 'concept_market_session_user';

export const MAX_HOURS = 24;
export const MAX_PROJECTS = 5;

// -- Helpers --

const isFirebaseReady = () => !!db;

// -- Subscription Methods (Real-time) --

export const subscribeToProjects = (callback: (projects: Project[]) => void): () => void => {
  if (isFirebaseReady()) {
    // Firebase Live Listener
    const q = collection(db, 'projects');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projects: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Normalize old field names to new ones (backwards compatibility)
        projects.push({
          ...data,
          totalHoursInvested: data.totalHoursInvested ?? data.totalCoinsInvested ?? 0,
          investorCount: data.investorCount ?? 0
        } as Project);
      });
      callback(projects);
    });
    return unsubscribe;
  } else {
    // LocalStorage "Polling" simulation or just immediate return
    const load = () => {
      const existing = localStorage.getItem(STORAGE_KEY_PROJECTS);
      const data = existing ? JSON.parse(existing) : seedProjects();
      if (!existing) localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(data));
      callback(data);
    };
    
    // Initial load
    load();
    
    // Listen for local storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PROJECTS) load();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCustomUpdate = () => load();
    window.addEventListener('local-data-update', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-data-update', handleCustomUpdate);
    };
  }
};

export const subscribeToFamily = (familyId: string, callback: (family: Family | null) => void): () => void => {
  if (familyId === 'admin_user') {
    callback({ id: 'admin_user', accessCode: 'ADMIN', studentName: 'Administrator', allocations: [] });
    return () => {};
  }

  if (isFirebaseReady()) {
    const unsubscribe = onSnapshot(doc(db, "families", familyId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Normalize old field names (coins -> hours)
        const allocations = (data.allocations || []).map((a: any) => ({
          projectId: a.projectId,
          hours: a.hours ?? a.coins ?? 0
        }));
        callback({ ...data, allocations } as Family);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  } else {
    const load = () => {
      const existing = localStorage.getItem(STORAGE_KEY_FAMILIES);
      const families: Family[] = existing ? JSON.parse(existing) : seedFamilies();
      const found = families.find(f => f.id === familyId) || null;
      callback(found);
    };
    load();
    
    const handleCustomUpdate = () => load();
    window.addEventListener('local-data-update', handleCustomUpdate);
    return () => window.removeEventListener('local-data-update', handleCustomUpdate);
  }
};

// -- Auth Actions --

export const login = async (accessCode: string): Promise<Family | null> => {
  if (accessCode === 'ADMIN') {
    const adminUser = { id: 'admin_user', accessCode: 'ADMIN', studentName: 'Administrator', allocations: [] };
    localStorage.setItem(STORAGE_KEY_SESSION, 'admin_user');
    return adminUser;
  }

  if (isFirebaseReady()) {
    // 1. Query Firestore for access code
    const q = query(collection(db, "families"), where("accessCode", "==", accessCode.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const familyDoc = querySnapshot.docs[0];
      const family = familyDoc.data() as Family;
      localStorage.setItem(STORAGE_KEY_SESSION, family.id);
      return family;
    } 
    
    // 2. Auto-Create Demo User if missing (Fix for empty DB)
    if (accessCode.toUpperCase() === 'CMC2025') {
        const demoFamily: Family = {
            id: 'fam_demo', 
            accessCode: 'CMC2025', 
            studentName: 'Guest Investor', 
            allocations: [] 
        };
        await setDoc(doc(db, 'families', demoFamily.id), demoFamily);
        localStorage.setItem(STORAGE_KEY_SESSION, demoFamily.id);
        return demoFamily;
    }

    return null;
  } else {
    // Local Search
    const existing = localStorage.getItem(STORAGE_KEY_FAMILIES);
    let families: Family[] = existing ? JSON.parse(existing) : seedFamilies();
    
    // Ensure seeds exist if first run
    if (!existing) localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(families));

    const family = families.find(f => f.accessCode.toUpperCase() === accessCode.toUpperCase());
    if (family) {
      localStorage.setItem(STORAGE_KEY_SESSION, family.id);
      return family;
    }
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_SESSION);
};

export const getSessionId = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_SESSION);
};

// -- Admin / Data Management --

export const getAllFamilies = async (): Promise<Family[]> => {
  if (isFirebaseReady()) {
    const snap = await getDocs(collection(db, 'families'));
    return snap.docs.map(d => d.data() as Family);
  } else {
    const existing = localStorage.getItem(STORAGE_KEY_FAMILIES);
    return existing ? JSON.parse(existing) : seedFamilies();
  }
};

export const createFamily = async (studentName: string): Promise<Family> => {
  const newFamily: Family = {
    id: `fam_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    accessCode: generateAccessCode(),
    studentName,
    allocations: []
  };

  if (isFirebaseReady()) {
    await setDoc(doc(db, 'families', newFamily.id), newFamily);
  } else {
    const families = await getAllFamilies();
    families.push(newFamily);
    localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(families));
    window.dispatchEvent(new Event('local-data-update'));
  }
  
  return newFamily;
};

// Seed function to upload data to Firebase
export const seedDatabase = async () => {
  const projects = seedProjects();
  const families = seedFamilies(); // Initial mock families

  if (isFirebaseReady()) {
    const batch = writeBatch(db);
    
    // Add Projects
    projects.forEach(p => {
      const ref = doc(db, 'projects', p.id);
      batch.set(ref, p);
    });

    // Add Families
    families.forEach(f => {
      const ref = doc(db, 'families', f.id);
      batch.set(ref, f);
    });

    await batch.commit();
    console.log("Database seeded to Firebase");
  } else {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(families));
    window.dispatchEvent(new Event('local-data-update'));
  }
};

export const resetSystem = async () => {
  if (isFirebaseReady()) {
    // In a real app, you'd delete collections via Cloud Functions or recursive delete
    // For now, we'll just re-seed to overwrite
    await seedDatabase(); 
  } else {
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_FAMILIES);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    window.location.reload();
  }
};

// -- Core Logic --

export const calculateRemainingHours = (allocations: Allocation[]): number => {
  const used = allocations.reduce((sum, a) => sum + a.hours, 0);
  return MAX_HOURS - used;
};

export const updateFamilyAllocations = async (
  familyId: string, 
  projectId: string, 
  newAmount: number
) => {
  
  if (isFirebaseReady()) {
    // Transactional update in Firebase
    const familyRef = doc(db, 'families', familyId);
    const projectRef = doc(db, 'projects', projectId);

    const fSnap = await getDoc(familyRef);
    if (!fSnap.exists()) throw new Error("Family not found");
    const family = fSnap.data() as Family;
    
    const oldAllocation = family.allocations.find(a => a.projectId === projectId);
    const oldHours = oldAllocation ? oldAllocation.hours : 0;
    const delta = newAmount - oldHours;

    let newAllocations = [...family.allocations];
    if (oldAllocation) {
        if (newAmount > 0) {
            newAllocations = family.allocations.map(a => a.projectId === projectId ? { ...a, hours: newAmount } : a);
        } else {
            newAllocations = family.allocations.filter(a => a.projectId !== projectId);
        }
    } else if (newAmount > 0) {
        newAllocations.push({ projectId, hours: newAmount });
    }

    const batch = writeBatch(db);
    batch.update(familyRef, { allocations: newAllocations });
    
    // Update project stats atomically
    // Determine investor count change
    let investorIncrement = 0;
    if (oldHours === 0 && newAmount > 0) investorIncrement = 1;
    if (oldHours > 0 && newAmount === 0) investorIncrement = -1;

    batch.update(projectRef, {
        totalHoursInvested: increment(delta),
        investorCount: increment(investorIncrement)
    });

    await batch.commit();

  } else {
    // Local Logic (Sync simulated as Async)
    const existingP = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const existingF = localStorage.getItem(STORAGE_KEY_FAMILIES);
    
    let projects: Project[] = existingP ? JSON.parse(existingP) : seedProjects();
    let families: Family[] = existingF ? JSON.parse(existingF) : seedFamilies();
    
    const familyIndex = families.findIndex(f => f.id === familyId);
    if (familyIndex === -1) return;
    const family = families[familyIndex];

    const oldAlloc = (family.allocations || []).find(a => a.projectId === projectId);
    const oldHours = oldAlloc ? oldAlloc.hours : 0;
    const delta = newAmount - oldHours;

    // Update Family
    let newAllocations = [...(family.allocations || [])];
    if (oldAlloc) {
      if (newAmount > 0) {
        newAllocations = newAllocations.map(a => a.projectId === projectId ? { ...a, hours: newAmount } : a);
      } else {
        newAllocations = newAllocations.filter(a => a.projectId !== projectId);
      }
    } else if (newAmount > 0) {
      newAllocations.push({ projectId, hours: newAmount });
    }
    families[familyIndex] = { ...family, allocations: newAllocations };

    // Update Project
    const projIndex = projects.findIndex(p => p.id === projectId);
    if (projIndex > -1) {
      const p = projects[projIndex];
      let invCount = p.investorCount;
      if (oldHours === 0 && newAmount > 0) invCount++;
      if (oldHours > 0 && newAmount === 0) invCount--;
      
      projects[projIndex] = {
        ...p,
        totalHoursInvested: p.totalHoursInvested + delta,
        investorCount: invCount
      };
    }

    localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(families));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    window.dispatchEvent(new Event('local-data-update'));
  }
};

const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate multiple unique codes for bulk creation
export const generateBulkCodes = async (count: number): Promise<string[]> => {
  const codes = new Set<string>();
  
  // Get existing codes to avoid duplicates
  const existingFamilies = await getAllFamilies();
  const existingCodes = new Set(existingFamilies.map(f => f.accessCode));
  
  while (codes.size < count) {
    const code = generateAccessCode();
    if (!existingCodes.has(code) && !codes.has(code)) {
      codes.add(code);
    }
  }
  
  return Array.from(codes);
};

// Create unclaimed family slots (codes without names)
export const createUnclaimedCodes = async (count: number): Promise<Family[]> => {
  const codes = await generateBulkCodes(count);
  const families: Family[] = codes.map((code, index) => ({
    id: `fam_${Date.now()}_${index}`,
    accessCode: code,
    studentName: '', // Empty = unclaimed
    allocations: []
  }));

  if (isFirebaseReady()) {
    const batch = writeBatch(db);
    families.forEach(f => {
      const ref = doc(db, 'families', f.id);
      batch.set(ref, f);
    });
    await batch.commit();
    console.log(`Created ${count} unclaimed codes in Firebase`);
  } else {
    const existing = await getAllFamilies();
    const all = [...existing, ...families];
    localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(all));
    window.dispatchEvent(new Event('local-data-update'));
  }

  return families;
};

// Delete a family
export const deleteFamily = async (familyId: string): Promise<boolean> => {
  if (isFirebaseReady()) {
    try {
      const familyRef = doc(db, 'families', familyId);
      const fSnap = await getDoc(familyRef);
      
      if (!fSnap.exists()) return false;
      
      const family = fSnap.data() as Family;
      const batch = writeBatch(db);
      
      // Remove family's hours from projects
      for (const alloc of family.allocations || []) {
        const projectRef = doc(db, 'projects', alloc.projectId);
        batch.update(projectRef, {
          totalHoursInvested: increment(-alloc.hours),
          investorCount: increment(-1)
        });
      }
      
      // Delete the family document
      batch.delete(familyRef);
      await batch.commit();
      
      return true;
    } catch (e) {
      console.error('Error deleting family:', e);
      return false;
    }
  } else {
    // Local storage
    const existingF = localStorage.getItem(STORAGE_KEY_FAMILIES);
    const existingP = localStorage.getItem(STORAGE_KEY_PROJECTS);
    
    let families: Family[] = existingF ? JSON.parse(existingF) : [];
    let projects: Project[] = existingP ? JSON.parse(existingP) : [];
    
    const family = families.find(f => f.id === familyId);
    if (!family) return false;
    
    // Remove hours from projects
    for (const alloc of family.allocations || []) {
      const projIndex = projects.findIndex(p => p.id === alloc.projectId);
      if (projIndex > -1) {
        projects[projIndex] = {
          ...projects[projIndex],
          totalHoursInvested: projects[projIndex].totalHoursInvested - alloc.hours,
          investorCount: projects[projIndex].investorCount - 1
        };
      }
    }
    
    // Remove family
    families = families.filter(f => f.id !== familyId);
    
    localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(families));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    window.dispatchEvent(new Event('local-data-update'));
    
    return true;
  }
};

// Claim a code by adding family name
export const claimCode = async (familyId: string, studentName: string): Promise<Family | null> => {
  if (isFirebaseReady()) {
    const familyRef = doc(db, 'families', familyId);
    await updateDoc(familyRef, { 
      studentName, 
      claimedAt: Date.now() 
    });
    const updated = await getDoc(familyRef);
    return updated.exists() ? updated.data() as Family : null;
  } else {
    const families = await getAllFamilies();
    const index = families.findIndex(f => f.id === familyId);
    if (index === -1) return null;
    
    families[index] = { 
      ...families[index], 
      studentName, 
      claimedAt: Date.now() 
    };
    localStorage.setItem(STORAGE_KEY_FAMILIES, JSON.stringify(families));
    window.dispatchEvent(new Event('local-data-update'));
    return families[index];
  }
};