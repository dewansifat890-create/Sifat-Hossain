import { motion } from 'motion/react';
import { User, MapPin, Heart, GraduationCap, Users } from 'lucide-react';
import { PROFILE_IMAGE } from '../constants/data';

export default function Profile() {
  return (
    <section id="profile" className="py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          {/* Profile Image Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group h-[400px] md:h-[500px] rounded-3xl overflow-hidden glass-card p-2"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img 
              src={PROFILE_IMAGE} 
              alt="Dewan Sifat Hossain"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20">
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tighter">Dewan Sifat Hossain</h2>
              <p className="text-neon-blue text-sm md:text-base font-medium flex items-center gap-2 mt-2">
                <MapPin size={16} /> Bangladesh, Dhaka, Narayanganj
              </p>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-4 md:space-y-6">
            <div className="glass-card p-5 md:p-6 border-neon-blue/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-neon-blue">
                  <Heart size={20} md:size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Personal Info</h3>
              </div>
              <div className="space-y-2 md:space-y-3 text-white/70 text-sm md:text-base">
                <p><span className="text-neon-blue font-bold">Religion:</span> Islam</p>
                <p><span className="text-neon-blue font-bold">From:</span> Dhaka, Narayanganj</p>
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 border-neon-purple/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-neon-purple">
                  <Users size={20} md:size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Family</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70 text-sm md:text-base">
                <div>
                  <p className="font-bold text-neon-purple">Father</p>
                  <p>Ali Hossain Dewan</p>
                </div>
                <div>
                  <p className="font-bold text-neon-purple">Mother</p>
                  <p>MST Shafali Akter</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-bold text-neon-purple">Sisters</p>
                  <ul className="list-disc list-inside">
                    <li>Dewan Shampa Akter</li>
                    <li>Dewan Mim Akter</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 md:p-6 border-neon-pink/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass flex items-center justify-center text-neon-pink">
                  <GraduationCap size={20} md:size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Education</h3>
              </div>
              <div className="space-y-3 md:space-y-4 text-white/70 text-sm md:text-base">
                <div>
                  <p className="font-bold text-neon-pink">Primary</p>
                  <p>Ranipura Government Primary School</p>
                </div>
                <div>
                  <p className="font-bold text-neon-pink">Secondary</p>
                  <p>Nurul Hoque High School</p>
                </div>
                <div>
                  <p className="font-bold text-neon-pink">College</p>
                  <p>Salimuddin Chowdhury University College</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
