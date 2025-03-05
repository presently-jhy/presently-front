import { Link } from 'react-router-dom';
import gift from './gift.png';
import kakao from './kakao-icon.png';
import google from './google-icon.png';

function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
            {/* 로고 */}
            <h1 className="text-4xl font-serif mb-4">presently</h1>

            {/* 설명 */}
            <p className="text-lg text-gray-600 mb-6">선물. 기념일. 더 완벽하게.</p>

            {/* 선물 아이콘 */}
            <img
                src={gift} // 실제 이미지 경로 설정 필요
                alt="Gift"
                className="w-32 h-32 mb-6"
            />

            {/* Google 로그인 버튼 */}
            <button className="flex items-center w-80 bg-white border border-gray-300 rounded-lg py-3 px-4 mb-3 shadow-md">
                <img src={google} alt="Google Logo" className="w-6 h-6 mr-3" />
            </button>

            {/* Kakao 로그인 버튼 */}
            <button className="flex items-center w-80 bg-yellow-400 rounded-lg py-3 px-4 shadow-md">
                <img src={kakao} alt="Kakao Logo" className="w-6 h-6 mr-3" />
            </button>

            {/* 이용약관 안내 */}
            <p className="text-xs text-gray-500 mt-6 px-6">
                시작할 경우, 프레젠틀리의 서비스 이용약관과 개인정보 보호정책에 동의하게 됩니다.
            </p>
        </div>
    );
}

export default Login;
