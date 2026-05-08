import { motion, AnimatePresence } from 'motion/react';
import { User, MapPin, Heart, GraduationCap, Users, Camera, Key, X, Plus } from 'lucide-react';
import { PROFILE_IMAGE } from '../constants/data';
import { useState, useRef, FormEvent } from 'react';

export default function Profile() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminEducation, setIsAdminEducation] = useState(false);
  const [isAdminFamily, setIsAdminFamily] = useState(false);
  const [isAdminPersonal, setIsAdminPersonal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showEduEdit, setShowEduEdit] = useState(false);
  const [showFamilyEdit, setShowFamilyEdit] = useState(false);
  const [showPersonalEdit, setShowPersonalEdit] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passTarget, setPassTarget] = useState<'profile' | 'education' | 'family' | 'personal'>('profile');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState(localStorage.getItem('customProfileImg') || PROFILE_IMAGE);
  const [eduData, setEduData] = useState(() => {
    const saved = localStorage.getItem('customEduData');
    return saved ? JSON.parse(saved) : {
      primary: 'Ranipura Government Primary School',
      secondary: 'Nurul Hoque High School',
      college: 'Salimuddin Chowdhury University College',
      university: '',
      degree: ''
    };
  });

  const [familyData, setFamilyData] = useState(() => {
    const saved = localStorage.getItem('customFamilyData');
    return saved ? JSON.parse(saved) : {
      father: 'Ali Hossain Dewan',
      mother: 'MST Shafali Akter',
      sisters: 'Dewan Shampa Akter, Dewan Mim Akter',
      brothers: ''
    };
  });

  const [personalData, setPersonalData] = useState(() => {
    const saved = localStorage.getItem('customPersonalData');
    return saved ? JSON.parse(saved) : {
      religion: 'Islam',
      from: 'Dhaka, Narayanganj',
      birthDate: 'October 25, 2004',
      bloodGroup: ''
    };
  });

  const tapCountRef = useRef(0);
  const eduTapCountRef = useRef(0);
  const familyTapCountRef = useRef(0);
  const personalTapCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const lastEduTapRef = useRef(0);
  const lastFamilyTapRef = useRef(0);
  const lastPersonalTapRef = useRef(0);

  const handleTextClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 600) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 2) {
      setPassTarget('profile');
      setShowPassModal(true);
      tapCountRef.current = 0;
    }
  };

  const handleEduClick = () => {
    const now = Date.now();
    if (now - lastEduTapRef.current < 600) {
      eduTapCountRef.current += 1;
    } else {
      eduTapCountRef.current = 1;
    }
    lastEduTapRef.current = now;

    if (eduTapCountRef.current >= 2) {
      setPassTarget('education');
      setShowPassModal(true);
      eduTapCountRef.current = 0;
    }
  };

  const handleFamilyClick = () => {
    const now = Date.now();
    if (now - lastFamilyTapRef.current < 600) {
      familyTapCountRef.current += 1;
    } else {
      familyTapCountRef.current = 1;
    }
    lastFamilyTapRef.current = now;

    if (familyTapCountRef.current >= 2) {
      setPassTarget('family');
      setShowPassModal(true);
      familyTapCountRef.current = 0;
    }
  };

  const handlePersonalClick = () => {
    const now = Date.now();
    if (now - lastPersonalTapRef.current < 600) {
      personalTapCountRef.current += 1;
    } else {
      personalTapCountRef.current = 1;
    }
    lastPersonalTapRef.current = now;

    if (personalTapCountRef.current >= 2) {
      setPassTarget('personal');
      setShowPassModal(true);
      personalTapCountRef.current = 0;
    }
  };

  const handlePassSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '374212') {
      if (passTarget === 'profile') {
        setIsAdmin(true);
        alert("Admin Mode Activated! Tap the Camera icon to change image.");
      } else if (passTarget === 'education') {
        setIsAdminEducation(true);
        alert("Education Edit Mode Activated!");
      } else if (passTarget === 'family') {
        setIsAdminFamily(true);
        alert("Family Edit Mode Activated!");
      } else if (passTarget === 'personal') {
        setIsAdminPersonal(true);
        alert("Personal Info Edit Mode Activated!");
      }
      setShowPassModal(false);
      setPassword('');
    } else {
      alert("Unauthorized Access Attempt.");
      setPassword('');
    }
  };

  const handleChangeEducation = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedEdu = {
      primary: formData.get('primary') as string,
      secondary: formData.get('secondary') as string,
      college: formData.get('college') as string,
      university: formData.get('university') as string,
      degree: formData.get('degree') as string,
    };
    
    setEduData(updatedEdu);
    localStorage.setItem('customEduData', JSON.stringify(updatedEdu));
    setShowEduEdit(false);
    alert("Success! Education info updated.");
  };

  const handleChangeFamily = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedFamily = {
      father: formData.get('father') as string,
      mother: formData.get('mother') as string,
      sisters: formData.get('sisters') as string,
      brothers: formData.get('brothers') as string,
    };
    
    setFamilyData(updatedFamily);
    localStorage.setItem('customFamilyData', JSON.stringify(updatedFamily));
    setShowFamilyEdit(false);
    alert("Success! Family info updated.");
  };

  const handleChangePersonal = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedPersonal = {
      religion: formData.get('religion') as string,
      from: formData.get('from') as string,
      birthDate: formData.get('birthDate') as string,
      bloodGroup: formData.get('bloodGroup') as string,
    };
    
    setPersonalData(updatedPersonal);
    localStorage.setItem('customPersonalData', JSON.stringify(updatedPersonal));
    setShowPersonalEdit(false);
    alert("Success! Personal info updated.");
  };

  const handleChangeImage = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUrl = formData.get('imageUrl') as string;
    
    if (newUrl && newUrl.trim() !== "") {
      setProfileImg(newUrl);
      localStorage.setItem('customProfileImg', newUrl);
      setShowUpload(false);
      alert("Success! Profile image updated.");
    }
  };

  return (
    <section id="profile" className="py-12 md:py-20 px-6 relative">
      {/* Password Modal */}
      <AnimatePresence>
        {showPassModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPassModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue mx-auto mb-4 border border-neon-blue/20">
                  <Key size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">Admin Access</h3>
              </div>

              <form onSubmit={handlePassSubmit} className="space-y-4">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  autoFocus
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-neon-blue transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-tighter"
                >
                  Verify Access
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowUpload(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <Camera size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Update Profile Image</h3>
              </div>
              
              <form onSubmit={handleChangeImage} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Image URL</label>
                  <input 
                    name="imageUrl"
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    required
                    defaultValue={profileImg === PROFILE_IMAGE ? "" : profileImg}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all uppercase tracking-tighter"
                >
                  Save Changes
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Edit Modal */}
      <AnimatePresence>
        {showEduEdit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowEduEdit(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center text-neon-pink">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Update Education Status</h3>
              </div>
              
              <form onSubmit={handleChangeEducation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Primary School</label>
                    <input 
                      name="primary"
                      type="text" 
                      defaultValue={eduData.primary}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-pink transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Secondary School</label>
                    <input 
                      name="secondary"
                      type="text" 
                      defaultValue={eduData.secondary}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-pink transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">College</label>
                    <input 
                      name="college"
                      type="text" 
                      defaultValue={eduData.college}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-pink transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">University</label>
                    <input 
                      name="university"
                      type="text" 
                      placeholder="e.g. Dhaka University"
                      defaultValue={eduData.university}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-pink transition-colors text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Degree / Status</label>
                    <input 
                      name="degree"
                      type="text" 
                      placeholder="e.g. B.Sc in CSE"
                      defaultValue={eduData.degree}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-pink transition-colors text-sm"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-pink text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,0,187,0.3)] hover:shadow-[0_0_30px_rgba(255,0,187,0.5)] transition-all uppercase tracking-tighter mt-4"
                >
                  Save Education Info
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Family Edit Modal */}
      <AnimatePresence>
        {showFamilyEdit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowFamilyEdit(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Update Family Members</h3>
              </div>
              
              <form onSubmit={handleChangeFamily} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Father's Name</label>
                    <input 
                      name="father"
                      type="text" 
                      defaultValue={familyData.father}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-purple transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Mother's Name</label>
                    <input 
                      name="mother"
                      type="text" 
                      defaultValue={familyData.mother}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-purple transition-colors text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Sisters (comma separated)</label>
                    <input 
                      name="sisters"
                      type="text" 
                      placeholder="e.g. Sister 1, Sister 2"
                      defaultValue={familyData.sisters}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-purple transition-colors text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Brothers (comma separated)</label>
                    <input 
                      name="brothers"
                      type="text" 
                      placeholder="e.g. Brother 1, Brother 2"
                      defaultValue={familyData.brothers}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-purple transition-colors text-sm"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-purple text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(191,0,255,0.3)] hover:shadow-[0_0_30px_rgba(191,0,255,0.5)] transition-all uppercase tracking-tighter mt-4"
                >
                  Save Family Info
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personal Edit Modal */}
      <AnimatePresence>
        {showPersonalEdit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPersonalEdit(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <Heart size={20} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Update Personal Info</h3>
              </div>
              
              <form onSubmit={handleChangePersonal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Religion</label>
                    <input 
                      name="religion"
                      type="text" 
                      defaultValue={personalData.religion}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Location / From</label>
                    <input 
                      name="from"
                      type="text" 
                      defaultValue={personalData.from}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Birth Date</label>
                    <input 
                      name="birthDate"
                      type="text" 
                      defaultValue={personalData.birthDate}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-black">Blood Group</label>
                    <input 
                      name="bloodGroup"
                      type="text" 
                      placeholder="e.g. O+ (Optional)"
                      defaultValue={personalData.bloodGroup}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors text-sm"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-blue text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all uppercase tracking-tighter mt-4"
                >
                  Save Personal Info
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          {/* Profile Image Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative group h-[400px] md:h-[500px] rounded-3xl overflow-hidden glass-card p-2"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img 
              src={profileImg} 
              alt="Dewan Sifat Hossain"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            
            {isAdmin && (
              <div className="absolute top-6 right-6 z-40 flex flex-col gap-3">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUpload(true)}
                  className="w-12 h-12 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.6)] border-2 border-white/20 transition-all font-bold"
                  title="Update Profile Image"
                >
                  <Camera size={24} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setProfileImg(PROFILE_IMAGE);
                    localStorage.removeItem('customProfileImg');
                    alert("Profile image reset to default.");
                  }}
                  className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center border border-white/20 hover:bg-red-700 transition-all shadow-xl"
                  title="Reset to Default"
                >
                  <X size={18} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsAdmin(false);
                    setShowUpload(false);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all shadow-xl"
                  title="Deactivate Admin Mode"
                >
                  <X size={18} />
                </motion.button>
              </div>
            )}
            
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20">
              <h2 
                onClick={handleTextClick}
                className="text-2xl md:text-4xl font-bold text-white tracking-tighter cursor-pointer select-none active:scale-95 transition-transform"
              >
                Dewan Sifat Hossain
              </h2>
              <p className="text-neon-blue text-sm md:text-base font-medium flex items-center gap-2 mt-2">
                <MapPin size={16} /> Bangladesh, Dhaka, Narayanganj
              </p>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-4 md:space-y-6">
            <div className="glass-card p-5 md:p-6 border-neon-blue/20 relative group/personal">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-neon-blue">
                  <Heart size={20} md:size={24} />
                </div>
                <h3 
                  onClick={handlePersonalClick}
                  className="text-xl md:text-2xl font-bold cursor-pointer select-none active:scale-95 transition-transform"
                >
                  Personal Info
                </h3>
              </div>

              {isAdminPersonal && (
                <div className="absolute top-4 right-4 z-40 flex gap-2">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPersonalEdit(true)}
                    className="w-10 h-10 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-lg border border-white/20 transition-all font-bold"
                    title="Edit Personal"
                  >
                    <Plus size={18} />
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAdminPersonal(false)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 hover:bg-red-500/20 transition-all font-bold"
                    title="Close Edit Mode"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              )}

              <div className="space-y-2 md:space-y-3 text-white/70 text-sm md:text-base">
                {personalData.religion && <p><span className="text-neon-blue font-bold">Religion:</span> {personalData.religion}</p>}
                {personalData.from && <p><span className="text-neon-blue font-bold">From:</span> {personalData.from}</p>}
                {personalData.birthDate && <p><span className="text-neon-blue font-bold">Birth Date:</span> {personalData.birthDate}</p>}
                {personalData.bloodGroup && <p><span className="text-neon-blue font-bold">Blood Group:</span> {personalData.bloodGroup}</p>}
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 border-neon-purple/20 relative group/family">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-neon-purple">
                  <Users size={20} md:size={24} />
                </div>
                <h3 
                  onClick={handleFamilyClick}
                  className="text-xl md:text-2xl font-bold cursor-pointer select-none active:scale-95 transition-transform"
                >
                  Family
                </h3>
              </div>

              {isAdminFamily && (
                <div className="absolute top-4 right-4 z-40 flex gap-2">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFamilyEdit(true)}
                    className="w-10 h-10 rounded-full bg-neon-purple text-black flex items-center justify-center shadow-lg border border-white/20 transition-all"
                    title="Edit Family"
                  >
                    <Plus size={18} />
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAdminFamily(false)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 hover:bg-red-500/20 transition-all font-bold"
                    title="Close Edit Mode"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm md:text-base">
                {familyData.father && (
                  <div>
                    <p className="font-bold text-neon-purple">Father</p>
                    <p>{familyData.father}</p>
                  </div>
                )}
                {familyData.mother && (
                  <div>
                    <p className="font-bold text-neon-purple">Mother</p>
                    <p>{familyData.mother}</p>
                  </div>
                )}
                {familyData.sisters && (
                  <div className={familyData.brothers ? "" : "md:col-span-2"}>
                    <p className="font-bold text-neon-purple">Sisters</p>
                    <ul className="list-disc list-inside">
                      {familyData.sisters.split(',').map((s: string, i: number) => (
                        <li key={i}>{s.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {familyData.brothers && (
                  <div className={familyData.sisters ? "" : "md:col-span-2"}>
                    <p className="font-bold text-neon-purple">Brothers</p>
                    <ul className="list-disc list-inside">
                      {familyData.brothers.split(',').map((b: string, i: number) => (
                        <li key={i}>{b.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 border-neon-pink/20 relative group/edu">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-neon-pink">
                  <GraduationCap size={20} md:size={24} />
                </div>
                <h3 
                  onClick={handleEduClick}
                  className="text-xl md:text-2xl font-bold cursor-pointer select-none active:scale-95 transition-transform"
                >
                  Education
                </h3>
              </div>
              
              {isAdminEducation && (
                <div className="absolute top-4 right-4 z-40 flex gap-2">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEduEdit(true)}
                    className="w-10 h-10 rounded-full bg-neon-pink text-black flex items-center justify-center shadow-lg border border-white/20 transition-all"
                    title="Edit Education"
                  >
                    <Plus size={18} />
                  </motion.button>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAdminEducation(false)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 hover:bg-red-500/20 transition-all font-bold"
                    title="Close Edit Mode"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              )}

              <div className="space-y-3 md:space-y-4 text-white/70 text-sm md:text-base">
                {eduData.university && (
                  <div>
                    <p className="font-bold text-neon-pink">University</p>
                    <p>{eduData.university}</p>
                    {eduData.degree && <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-0.5">{eduData.degree}</p>}
                  </div>
                )}
                {eduData.primary && (
                  <div>
                    <p className="font-bold text-neon-pink">Primary</p>
                    <p>{eduData.primary}</p>
                  </div>
                )}
                {eduData.secondary && (
                  <div>
                    <p className="font-bold text-neon-pink">Secondary</p>
                    <p>{eduData.secondary}</p>
                  </div>
                )}
                {eduData.college && (
                  <div>
                    <p className="font-bold text-neon-pink">College</p>
                    <p>{eduData.college}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
