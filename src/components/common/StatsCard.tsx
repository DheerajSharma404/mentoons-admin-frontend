const StatCard = ({ title, value, icon: Icon, onClick }: { title: string; value: number; icon: React.ElementType, onClick: () => void }) => (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full p-3">
          <Icon className="text-white text-2xl" />
        </div>
        <p className="text-4xl font-bold text-gray-800">{value.toLocaleString()}</p>
      </div>
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
    </div>
  );

  export default StatCard;