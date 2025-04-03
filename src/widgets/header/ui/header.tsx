export const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 shadow-lg">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                        <Droplets className="text-white" />
                    </div>
                    우리 카페 물맛
                </h1>
                <p className="text-sm mt-1 opacity-90">커피 맛을 좌우하는 수질 정보를 무료로 확인해보세요</p>
            </div>
        </header>
    );
};
