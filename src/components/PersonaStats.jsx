import React from 'react';
import { usePersona } from '../context/PersonaContext';
import { TrendingUp, Target, Heart } from 'lucide-react';

const PersonaStats = React.memo(({ posts }) => {
  const { currentPersona } = usePersona();

  const personaPosts = posts.filter(post => post.personaId === currentPersona.id);
  const publishedPosts = personaPosts.filter(post => post.status === 'Published').length;
  const totalPosts = personaPosts.length;
  const target = 10; // Mock target
  const health = totalPosts > 5 ? 'Healthy' : 'Needs Attention'; // Mock health

  const stats = [
    {
      title: 'Total Posts Published',
      value: publishedPosts,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      title: 'Target vs Actual',
      value: `${publishedPosts}/${target}`,
      icon: Target,
      color: 'text-blue-400',
    },
    {
      title: 'Persona Health',
      value: health,
      icon: Heart,
      color: health === 'Healthy' ? 'text-green-400' : 'text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default PersonaStats;