import { Link } from 'react-router-dom';
import gift from './gift.png';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-white text-center space-y-6">
            {/* 브랜드 이름 */}
            <h1 className="text-4xl font-serif">presently</h1>

            {/* 설명 */}
            <p className="text-lg text-gray-600">선물. 기념일. 더 완벽하게.</p>

            {/* 선물 이미지 */}
            <img src={gift} alt="Gift" className="w-32 h-32" />

            {/* 버튼 */}
            <Link
                to="/login"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full text-lg shadow-md"
            >
                선물 받으러 가기
            </Link>
        </div>
    );
}

export default Home;
