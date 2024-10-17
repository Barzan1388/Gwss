import { useState, useEffect } from 'react';
import { Home, List, Users, Check, X, Copy, ExternalLink } from 'lucide-react';

export default function CrowApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [crowBalance, setCrowBalance] = useState(0);
  const [miningStatus, setMiningStatus] = useState({
    isActive: false,
    timeLeft: { hours: 5, minutes: 30 },
    currentReward: 0
  });
  const [videoTasks, setVideoTasks] = useState([
    { id: 1, completed: false, timer: 600, code: '', reward: 1000 },
    { id: 2, completed: false, timer: 600, code: '', reward: 1000 }
  ]);
  const [socialTasks, setSocialTasks] = useState([
    { id: 1, platform: 'Telegram', reward: 400, timer: 240, completed: false },
    { id: 2, platform: 'X', reward: 450, timer: 240, completed: false },
    { id: 3, platform: 'YouTube', reward: 600, timer: 360, completed: false }
  ]);
  const [referralCode] = useState(`CBW${Math.floor(Math.random() * 90000) + 10000}`);
  const [referralCount, setReferralCount] = useState(0);

  // Mining Timer Logic
  useEffect(() => {
    let interval;
    if (miningStatus.isActive) {
      interval = setInterval(() => {
        setMiningStatus(prev => {
          const newMinutes = prev.timeLeft.minutes - 1;
          const newHours = prev.timeLeft.minutes < 0 ? 
            prev.timeLeft.hours - 1 : prev.timeLeft.hours;
          
          if (prev.currentReward >= 100) {
            return {
              ...prev,
              isActive: false,
              currentReward: 100
            };
          }

          return {
            ...prev,
            timeLeft: {
              hours: newHours,
              minutes: newMinutes < 0 ? 59 : newMinutes
            },
            currentReward: prev.currentReward + 0.001
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningStatus.isActive]);

  const startMining = () => {
    if (!miningStatus.isActive) {
      setMiningStatus({
        isActive: true,
        timeLeft: { hours: 5, minutes: 30 },
        currentReward: 0
      });
    }
  };

  const claimMiningReward = () => {
    if (miningStatus.currentReward >= 100) {
      setCrowBalance(prev => prev + 100);
      setMiningStatus({
        isActive: false,
        timeLeft: { hours: 5, minutes: 30 },
        currentReward: 0
      });
    }
  };

  const HomePage = () => (
    <div className="flex flex-col items-center p-4 space-y-6">
      <img src="/api/placeholder/300/200" alt="Crow Logo" className="rounded-lg" />
      
      <div className="text-2xl font-bold">
        {crowBalance} Crow
      </div>

      <button 
        onClick={miningStatus.currentReward >= 100 ? claimMiningReward : startMining}
        className="w-full max-w-md bg-white text-black rounded-lg p-4 flex justify-between items-center"
      >
        <span className="flex-1 text-center">
          {miningStatus.currentReward >= 100 
            ? `Claim +100 Crow`
            : miningStatus.isActive 
              ? `Crow ${miningStatus.currentReward.toFixed(3)}`
              : 'Start mining crow'
          }
        </span>
        {miningStatus.isActive && (
          <span>
            {`${String(miningStatus.timeLeft.hours).padStart(2, '0')}h ${String(miningStatus.timeLeft.minutes).padStart(2, '0')}m`}
          </span>
        )}
      </button>
    </div>
  );

  const EarnPage = () => (
    <div className="flex flex-col p-4 space-y-6">
      <img src="/api/placeholder/300/200" alt="Earn Banner" className="rounded-lg" />
      
      <h2 className="text-lg font-bold">Video from our YouTube channel</h2>
      
      {videoTasks.map((task, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/api/placeholder/60/60" alt="Video Thumbnail" className="rounded" />
              <div>
                <div>What Video</div>
                <div>{task.reward}+ Crow</div>
              </div>
            </div>
            {task.completed ? (
              <Check className="text-green-500" />
            ) : task.timer === 0 ? (
              <div className="space-y-2">
                <input 
                  type="text"
                  placeholder="Enter code"
                  className="rounded px-2 py-1"
                  onChange={(e) => {
                    const newTasks = [...videoTasks];
                    newTasks[index].code = e.target.value;
                    setVideoTasks(newTasks);
                  }}
                />
                <button
                  onClick={() => {
                    if (task.code === 'YouTube') {
                      setCrowBalance(prev => prev + task.reward);
                      const newTasks = [...videoTasks];
                      newTasks[index].completed = true;
                      setVideoTasks(newTasks);
                    }
                  }}
                  className="bg-blue-500 text-white rounded px-4 py-1"
                >
                  Check
                </button>
              </div>
            ) : (
              <div>{Math.floor(task.timer / 60)}:{(task.timer % 60).toString().padStart(2, '0')}</div>
            )}
          </div>
        </div>
      ))}

      <h2 className="text-lg font-bold">Following platforms</h2>
      
      {socialTasks.map((task, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/api/placeholder/60/60" alt={`${task.platform} Icon`} className="rounded" />
              <div>
                <div>{`Follow our ${task.platform}`}</div>
                <div>{task.reward}+ Crow</div>
              </div>
            </div>
            {task.completed ? (
              <Check className="text-green-500" />
            ) : (
              <div>{Math.floor(task.timer / 60)}:{(task.timer % 60).toString().padStart(2, '0')}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const FriendPage = () => (
    <div className="flex flex-col p-4 space-y-6">
      <img src="/api/placeholder/300/200" alt="Friend Banner" className="rounded-lg" />
      
      <button 
        onClick={() => {/* Share functionality */}}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center"
      >
        Invite a friend
      </button>

      <button 
        onClick={() => navigator.clipboard.writeText(`https://t.me/Crowgame_bot/start?startapp=${referralCode}`)}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center"
      >
        Copy link
      </button>

      <div className="text-center">
        Referred Users: {referralCount}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="pb-20">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'earn' && <EarnPage />}
        {activeTab === 'friend' && <FriendPage />}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 w-full p-4">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center space-y-1 transition-all duration-300 px-6 py-2 rounded-lg
                ${activeTab === 'home' ? 'text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-gray-400'}`}
            >
              <Home className="w-6 h-6" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('earn')}
              className={`flex flex-col items-center space-y-1 transition-all duration-300 px-6 py-2 rounded-lg
                ${activeTab === 'earn' ? 'text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-gray-400'}`}
            >
              <List className="w-6 h-6" />
              <span>Earn</span>
            </button>

            <button
              onClick={() => setActiveTab('friend')}
              className={`flex flex-col items-center space-y-1 transition-all duration-300 px-6 py-2 rounded-lg
                ${activeTab === 'friend' ? 'text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-gray-400'}`}
            >
              <Users className="w-6 h-6" />
              <span>Friend</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
