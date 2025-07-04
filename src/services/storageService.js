import { supabase } from '../lib/supabaseClient';

export const storageService = {
    // 이미지 업로드
    async uploadImage(file, folder = 'events') {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage.from('images').upload(filePath, file);

        if (error) throw error;

        // 공개 URL 반환
        const {
            data: { publicUrl },
        } = supabase.storage.from('images').getPublicUrl(filePath);

        return publicUrl;
    },

    // 이미지 삭제
    async deleteImage(filePath) {
        const { error } = await supabase.storage.from('images').remove([filePath]);

        if (error) throw error;
    },

    // 이미지 리사이징 (Supabase Edge Functions 활용)
    async getResizedImage(url, width = 400, height = 400) {
        return `${url}?width=${width}&height=${height}&resize=cover`;
    },

    // 파일 크기 및 타입 검증
    validateFile(file, maxSize = 5 * 1024 * 1024) {
        // 5MB 기본
        if (file.size > maxSize) {
            throw new Error(`파일 크기는 ${maxSize / 1024 / 1024}MB 이하여야 합니다.`);
        }

        if (!file.type.startsWith('image/')) {
            throw new Error('이미지 파일만 업로드 가능합니다.');
        }

        return true;
    },
};
